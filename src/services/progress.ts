import type { ActivityEntry, ProgressState, ReviewItem, Snippet } from '../types';
import { loadState, saveState } from './storage';
import { XP_RULES } from '../data/achievements';
import { getLevel, lessonsOfLevel } from '../data/curriculum';

// ============================================================
// Progress store — ស្ថានភាពអ្នកសិក្សា + ក្បួន XP/streak/review queue
// ============================================================

let state: ProgressState;
let storageWarning: string | null = null;
const subscribers = new Set<() => void>();

export function initProgress(): void {
  const result = loadState();
  state = result.state;
  storageWarning = result.ok ? null : result.reason === 'unavailable'
    ? 'ការរក្សាទុកមិនអាចប្រើបានក្នុង browser នេះទេ — វឌ្ឍនភាពនឹងបាត់ពេលបិទទំព័រ។'
    : 'ទិន្នន័យវឌ្ឍនភាពចាស់មានកំហុស ហើយត្រូវបានកំណត់ឡើងវិញ។';
}

export function getState(): ProgressState {
  if (!state) initProgress();
  return state;
}

export function getStorageWarning(): string | null {
  return storageWarning;
}

export function subscribe(fn: () => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function commit(persist = true): void {
  if (persist) saveState(state);
  subscribers.forEach((fn) => fn());
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** ក្បួន streak៖ រៀនម្តងក្នុងមួយថ្ងៃ; ខកខានមួយថ្ងៃ → streak ចាប់ផ្តើមពី 1 ឡើងវិញ។ */
export function touchStreak(): void {
  const t = today();
  if (state.streak.lastActiveDate === t) return;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  state.streak.count = state.streak.lastActiveDate === yesterday ? state.streak.count + 1 : 1;
  state.streak.lastActiveDate = t;
}

function addActivity(entry: Omit<ActivityEntry, 'at'>): void {
  state.activity.unshift({ at: new Date().toISOString(), ...entry });
  state.activity = state.activity.slice(0, 100);
}

export function addXP(amount: number): void {
  state.xp = Math.max(0, state.xp + Math.floor(amount));
}

export function recordExerciseResult(lessonId: string, exerciseId: string, correct: boolean, firstTry: boolean): void {
  touchStreak();
  if (correct) {
    if (firstTry) addXP(XP_RULES.exerciseFirstTry);
    // ដកចេញពី review queue បើឆ្លើយត្រូវវិញ
    state.reviewQueue = state.reviewQueue.filter((r) => !(r.lessonId === lessonId && r.exerciseId === exerciseId));
  } else {
    const existing = state.reviewQueue.find((r) => r.lessonId === lessonId && r.exerciseId === exerciseId);
    if (existing) {
      existing.wrongCount += 1;
      existing.lastWrongAt = new Date().toISOString();
    } else {
      const item: ReviewItem = { lessonId, exerciseId, wrongCount: 1, lastWrongAt: new Date().toISOString() };
      state.reviewQueue.unshift(item);
      state.reviewQueue = state.reviewQueue.slice(0, 200);
    }
  }
  commit();
}

export function completeLesson(lessonId: string, score: number, hintsUsed: number): string[] {
  const prev = state.completedLessons[lessonId];
  state.completedLessons[lessonId] = {
    completedAt: new Date().toISOString(),
    score,
    attempts: (prev?.attempts ?? 0) + 1,
    hintsUsed: (prev?.hintsUsed ?? 0) + hintsUsed,
  };
  touchStreak();
  if (!prev) addXP(XP_RULES.lessonComplete);
  addActivity({ kind: 'lesson_completed', lessonId, detail_km: `បញ្ចប់មេរៀន (ពិន្ទុ ${Math.round(score * 100)}%)` });

  const unlocked = checkAchievements();
  commit();
  return unlocked;
}

export function selectLevel(levelId: number): void {
  state.currentLevel = levelId;
  addActivity({ kind: 'level_selected', detail_km: `បានជ្រើសរើសកម្រិត ${levelId}` });
  commit();
}

export function recordQuiz(levelId: number): string[] {
  addXP(XP_RULES.quizComplete);
  touchStreak();
  state.placementResult = { levelId, takenAt: new Date().toISOString() };
  addActivity({ kind: 'quiz_taken', detail_km: `លទ្ធផលណែនាំ៖ កម្រិត ${levelId}` });
  const unlocked = checkAchievements();
  commit();
  return unlocked;
}

export function saveSnippet(title: string, code: string): Snippet {
  const snippet: Snippet = {
    id: `sn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    title: title.slice(0, 120),
    code: code.slice(0, 100_000),
    savedAt: new Date().toISOString(),
  };
  state.snippets.unshift(snippet);
  state.snippets = state.snippets.slice(0, 50);
  addActivity({ kind: 'snippet_saved', detail_km: `បានរក្សាទុក snippet "${snippet.title}"` });
  commit();
  return snippet;
}

export function deleteSnippet(id: string): void {
  state.snippets = state.snippets.filter((s) => s.id !== id);
  commit();
}

export function recordCodeRun(): string[] {
  const unlocked: string[] = [];
  if (!state.achievements.includes('first-code-run')) {
    state.achievements.push('first-code-run');
    unlocked.push('first-code-run');
  }
  commit();
  return unlocked;
}

export function updateSettings(patch: Partial<ProgressState['settings']>): void {
  state.settings = { ...state.settings, ...patch };
  commit();
}

export function replaceState(newState: ProgressState): void {
  state = newState;
  commit();
}

// ---------- Achievements ----------

export function checkAchievements(): string[] {
  const unlocked: string[] = [];
  const grant = (id: string): void => {
    if (!state.achievements.includes(id)) {
      state.achievements.push(id);
      unlocked.push(id);
    }
  };
  const completedCount = Object.keys(state.completedLessons).length;
  if (completedCount >= 1) grant('first-lesson');
  for (const levelId of [0, 1, 2, 3, 4]) {
    const level = getLevel(levelId);
    if (!level) continue;
    const lessons = lessonsOfLevel(levelId).filter((l) => l.status === 'published');
    if (lessons.length > 0 && lessons.every((l) => state.completedLessons[l.id])) {
      grant(`level-${levelId}-complete`);
    }
  }
  if (state.streak.count >= 3) grant('streak-3');
  if (state.streak.count >= 7) grant('streak-7');
  if (state.xp >= 100) grant('xp-100');
  if (state.xp >= 500) grant('xp-500');
  if (state.placementResult) grant('quiz-taken');
  return unlocked;
}

// ---------- Aggregates for dashboard ----------

export function levelProgress(levelId: number): { done: number; total: number; percent: number } {
  const lessons = lessonsOfLevel(levelId).filter((l) => l.status === 'published');
  const done = lessons.filter((l) => state.completedLessons[l.id]).length;
  return { done, total: lessons.length, percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function overallProgress(): { done: number; total: number; percent: number } {
  let done = 0;
  let total = 0;
  for (const level of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const p = levelProgress(level);
    done += p.done;
    total += p.total;
  }
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}
