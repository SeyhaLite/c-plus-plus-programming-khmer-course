import type { ProgressState, Settings } from '../types';

// ============================================================
// Persistence — localStorage ជាមួយ schema versioning និង migration
// ទិន្នន័យទាំងអស់នៅក្នុង browser របស់អ្នកប្រើប្រាស់។ គ្មានការផ្ញើទៅ server។
// ============================================================

export const STORAGE_KEY = 'kca.progress.v1';
export const SCHEMA_VERSION = 1;

export const defaultSettings: Settings = {
  theme: 'light',
  sound: false, // muted by default — ត្រូវការ opt-in
  reducedMotion: false,
  executionConsent: null,
};

export function defaultState(): ProgressState {
  return {
    schemaVersion: SCHEMA_VERSION,
    currentLevel: null,
    completedLessons: {},
    xp: 0,
    streak: { lastActiveDate: null, count: 0 },
    reviewQueue: [],
    snippets: [],
    activity: [],
    achievements: [],
    settings: { ...defaultSettings },
  };
}

/** Migrate unknown/older payloads onto the current schema. Defensive: never throws. */
export function migrateState(raw: unknown): ProgressState {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;
  const data = raw as Record<string, unknown> & { settings?: Partial<Settings> };

  // Future migrations branch on data.schemaVersion here (0 → 1 → ...).
  const merged: ProgressState = {
    schemaVersion: SCHEMA_VERSION,
    currentLevel: typeof data.currentLevel === 'number' ? data.currentLevel : base.currentLevel,
    completedLessons:
      data.completedLessons && typeof data.completedLessons === 'object'
        ? (data.completedLessons as ProgressState['completedLessons'])
        : {},
    xp: typeof data.xp === 'number' && Number.isFinite(data.xp) && data.xp >= 0 ? data.xp : 0,
    streak:
      data.streak && typeof data.streak === 'object'
        ? {
            lastActiveDate:
              typeof (data.streak as ProgressState['streak']).lastActiveDate === 'string'
                ? (data.streak as ProgressState['streak']).lastActiveDate
                : null,
            count: Number.isFinite((data.streak as ProgressState['streak']).count)
              ? Math.max(0, (data.streak as ProgressState['streak']).count)
              : 0,
          }
        : base.streak,
    reviewQueue: Array.isArray(data.reviewQueue) ? (data.reviewQueue as ProgressState['reviewQueue']) : [],
    snippets: Array.isArray(data.snippets) ? (data.snippets as ProgressState['snippets']) : [],
    activity: Array.isArray(data.activity) ? (data.activity as ProgressState['activity']) : [],
    achievements: Array.isArray(data.achievements) ? (data.achievements as string[]) : [],
    placementResult:
      data.placementResult && typeof data.placementResult === 'object'
        ? (data.placementResult as ProgressState['placementResult'])
        : undefined,
    settings: { ...base.settings, ...(data.settings && typeof data.settings === 'object' ? data.settings : {}) },
  };
  return sanitizeState(merged);
}

/** Final guard: enforce invariants and size limits on any imported/loaded state. */
function sanitizeSettings(s: Partial<Settings> | undefined): Settings {
  const raw = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>;
  const boolOr = (v: unknown, dflt: boolean): boolean => (typeof v === 'boolean' ? v : dflt);
  return {
    theme: raw.theme === 'dark' ? 'dark' : 'light',
    sound: boolOr(raw.sound, defaultSettings.sound),
    reducedMotion: boolOr(raw.reducedMotion, defaultSettings.reducedMotion),
    executionConsent:
      typeof raw.executionConsent === 'boolean' ? raw.executionConsent : raw.executionConsent === null ? null : null,
  };
}

export function sanitizeState(s: ProgressState): ProgressState {
  const MAX_SNIPPETS = 50;
  const MAX_ACTIVITY = 100;
  const MAX_REVIEW = 200;
  const MAX_CODE_LEN = 100_000;
  const result: ProgressState = {
    ...s,
    schemaVersion: SCHEMA_VERSION,
    xp: Math.max(0, Math.min(1_000_000, Math.floor(s.xp) || 0)),
    settings: sanitizeSettings(s.settings),
    completedLessons: Object.fromEntries(
      Object.entries(s.completedLessons || {}).filter(
        ([k, v]) => typeof k === 'string' && k.length < 200 && v && typeof v === 'object'
      )
    ) as ProgressState['completedLessons'],
    snippets: (Array.isArray(s.snippets) ? s.snippets : [])
      .filter((sn) => sn && typeof sn.code === 'string' && sn.code.length <= MAX_CODE_LEN)
      .slice(0, MAX_SNIPPETS)
      .map((sn) => ({
        id: String(sn.id || Math.random().toString(36).slice(2)),
        title: String(sn.title || 'snippet').slice(0, 120),
        code: String(sn.code).slice(0, MAX_CODE_LEN),
        savedAt: String(sn.savedAt || new Date().toISOString()),
      })),
    activity: (Array.isArray(s.activity) ? s.activity : []).filter((a) => a && typeof a.at === 'string' && typeof a.kind === 'string').slice(0, MAX_ACTIVITY),
    reviewQueue: (Array.isArray(s.reviewQueue) ? s.reviewQueue : []).filter((r) => r && typeof r.lessonId === 'string').slice(0, MAX_REVIEW),
    achievements: (Array.isArray(s.achievements) ? s.achievements : []).filter((a) => typeof a === 'string').slice(0, 200),
  };
  return result;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getStorage(): StorageLike | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* storage unavailable (private mode etc.) */
  }
  return null;
}

export type LoadResult = { ok: true; state: ProgressState } | { ok: false; reason: 'unavailable' | 'corrupt'; state: ProgressState };

export function loadState(storage: StorageLike | null = getStorage()): LoadResult {
  if (!storage) return { ok: false, reason: 'unavailable', state: defaultState() };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, state: defaultState() };
    const parsed: unknown = JSON.parse(raw);
    return { ok: true, state: migrateState(parsed) };
  } catch {
    return { ok: false, reason: 'corrupt', state: defaultState() };
  }
}

export function saveState(state: ProgressState, storage: StorageLike | null = getStorage()): { ok: boolean; reason?: 'unavailable' | 'quota' | 'error' } {
  if (!storage) return { ok: false, reason: 'unavailable' };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...state, schemaVersion: SCHEMA_VERSION }));
    return { ok: true };
  } catch (e) {
    const name = e instanceof Error ? e.name : '';
    if (name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      return { ok: false, reason: 'quota' };
    }
    return { ok: false, reason: 'error' };
  }
}

export function resetState(storage: StorageLike | null = getStorage()): ProgressState {
  const fresh = defaultState();
  saveState(fresh, storage);
  return fresh;
}

export function exportStateJSON(state: ProgressState): string {
  return JSON.stringify({ app: 'khmer-cpp-academy', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), state }, null, 2);
}

export function importStateJSON(json: string): { ok: true; state: ProgressState } | { ok: false; error_km: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error_km: 'ឯកសារមិនមែនជា JSON ត្រឹមត្រូវ។' };
  }
  if (parsed && typeof parsed === 'object' && 'app' in parsed && (parsed as { app?: unknown }).app !== 'khmer-cpp-academy') {
    return { ok: false, error_km: 'ឯកសារនេះមិនមែនជារបស់ Khmer C++ Academy ទេ។' };
  }
  const inner = parsed && typeof parsed === 'object' && 'state' in parsed ? (parsed as { state: unknown }).state : parsed;
  const state = sanitizeState(migrateState(inner));
  return { ok: true, state };
}
