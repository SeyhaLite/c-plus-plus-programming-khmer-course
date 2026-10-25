import { describe, it, expect } from 'vitest';
import { allLessons, allLevels, getLesson, getLevel, lessonsOfLevel } from '../../src/data/curriculum';
import type { Exercise, Lesson } from '../../src/types';

// ============================================================
// Curriculum validation — automated content quality checks
// (រត់ក្នុង CI រាល់ការប្តូរមាតិកា)
// ============================================================

const published = allLessons.filter((l) => l.status === 'published');
const VALID_STATUS = ['published', 'draft', 'planned'];

describe('curriculum: identity and structure', () => {
  it('all lesson ids are unique', () => {
    const ids = allLessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all exercise ids are unique within each lesson', () => {
    for (const l of allLessons) {
      const ids = l.exercises.map((e) => e.id);
      expect(new Set(ids).size, `duplicate exercise id in ${l.id}`).toBe(ids.length);
    }
  });

  it('all levels ids are unique and 0..12', () => {
    const ids = allLevels.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
    expect(ids[0]).toBe(0);
    expect(ids[ids.length - 1]).toBe(12);
  });

  it('every lesson belongs to an existing level and appears in exactly one unit', () => {
    const seen = new Map<string, number>();
    for (const level of allLevels) {
      for (const unit of level.units) {
        for (const id of unit.lessonIds) {
          seen.set(id, (seen.get(id) ?? 0) + 1);
          const lesson = getLesson(id);
          expect(lesson, `unit references missing lesson ${id}`).toBeTruthy();
          expect(lesson?.level_id, `lesson ${id} level mismatch`).toBe(level.id);
        }
      }
    }
    for (const [id, count] of seen) {
      expect(count, `lesson ${id} referenced ${count} times in units`).toBe(1);
    }
    for (const lesson of allLessons) {
      expect(seen.has(lesson.id), `lesson ${lesson.id} not referenced by any unit`).toBe(true);
    }
  });

  it('status values are valid', () => {
    for (const l of allLessons) expect(VALID_STATUS).toContain(l.status);
    for (const lv of allLevels) expect(VALID_STATUS).toContain(lv.status);
  });

  it('version is semver', () => {
    for (const l of allLessons) expect(l.version, `${l.id} version`).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('lesson ids are prefixed with their level', () => {
    for (const l of allLessons) {
      expect(l.id.startsWith(`l${l.level_id}-`), `${l.id} prefix`).toBe(true);
    }
  });
});

describe('curriculum: prerequisites and ordering', () => {
  it('prerequisites reference existing lessons', () => {
    for (const l of allLessons) {
      for (const p of l.prerequisites) {
        expect(getLesson(p), `${l.id} prereq ${p} missing`).toBeTruthy();
      }
    }
  });

  it('published lessons only depend on published prerequisites', () => {
    for (const l of published) {
      for (const p of l.prerequisites) {
        const prereq = getLesson(p)!;
        expect(prereq.status, `${l.id} depends on non-published ${p}`).toBe('published');
      }
    }
  });

  it('no circular prerequisites', () => {
    const visiting = new Set<string>();
    const done = new Set<string>();
    function walk(id: string): void {
      if (done.has(id)) return;
      expect(visiting.has(id), `cycle at ${id}`).toBe(false);
      visiting.add(id);
      for (const p of getLesson(id)?.prerequisites ?? []) walk(p);
      visiting.delete(id);
      done.add(id);
    }
    allLessons.forEach((l) => walk(l.id));
  });

  it('next references existing lessons', () => {
    for (const l of allLessons) {
      if (l.next !== undefined) {
        expect(getLesson(l.next), `${l.id} next ${l.next} missing`).toBeTruthy();
      }
    }
  });

  it('first published lesson chain starts at level 0 without prerequisites', () => {
    const first = lessonsOfLevel(0)[0];
    expect(first.status).toBe('published');
    expect(first.prerequisites).toEqual([]);
  });
});

describe('curriculum: published lesson content quality', () => {
  it('has real titles, explanations, objectives, summary', () => {
    for (const l of published) {
      expect(l.title_km.trim().length, `${l.id} title_km`).toBeGreaterThan(3);
      expect(l.title_en.trim().length, `${l.id} title_en`).toBeGreaterThan(2);
      expect(l.explanation_km.trim().length, `${l.id} explanation`).toBeGreaterThan(100);
      expect(l.objectives_km.length, `${l.id} objectives`).toBeGreaterThanOrEqual(2);
      expect(l.summary_km.trim().length, `${l.id} summary`).toBeGreaterThan(20);
      expect(l.estimated_minutes, `${l.id} minutes`).toBeGreaterThan(0);
    }
  });

  // Orientation lessons explain how to use the platform itself and legitimately have no C++ examples.
  const ORIENTATION_LESSONS = ['l0-how-to-use'];

  it('has at least one code example and at least 3 exercises', () => {
    for (const l of published) {
      if (!ORIENTATION_LESSONS.includes(l.id)) {
        expect(l.examples.length, `${l.id} examples`).toBeGreaterThanOrEqual(1);
      }
      expect(l.exercises.length, `${l.id} exercises`).toBeGreaterThanOrEqual(3);
    }
  });

  it('examples have compilable-looking C++ when they declare expectedOutput', () => {
    for (const l of published) {
      for (const ex of l.examples) {
        if (ex.expectedOutput !== undefined) {
          expect(ex.code, `${l.id} example ${ex.title_km}`).toContain('int main()');
          expect(ex.code).toContain('#include <iostream>');
        }
      }
    }
  });

  it('every exercise has a prompt, explanation, and at least one hint', () => {
    for (const l of published) {
      for (const e of l.exercises) {
        expect(e.prompt_km.trim().length, `${e.id} prompt`).toBeGreaterThan(5);
        expect(e.explanation_km.trim().length, `${e.id} explanation`).toBeGreaterThan(10);
        expect(e.hints_km.length, `${e.id} hints`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('planned lessons are honestly empty (no fake content)', () => {
    for (const l of allLessons.filter((x) => x.status === 'planned')) {
      expect(l.exercises.length, `${l.id} planned must not have exercises`).toBe(0);
      expect(l.explanation_km, `${l.id} planned must not have explanation`).toBe('');
    }
  });
});

describe('curriculum: exercise schema validity', () => {
  const allExercises: { lesson: Lesson; ex: Exercise }[] = published.flatMap((l) => l.exercises.map((ex) => ({ lesson: l, ex })));

  it('multiple_choice: answerIndex in range, >= 2 distinct options', () => {
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'multiple_choice')) {
      const e = ex as Extract<Exercise, { type: 'multiple_choice' }>;
      expect(e.options_km.length).toBeGreaterThanOrEqual(2);
      expect(e.answerIndex).toBeGreaterThanOrEqual(0);
      expect(e.answerIndex).toBeLessThan(e.options_km.length);
      expect(new Set(e.options_km).size).toBe(e.options_km.length);
    }
  });

  it('fill_blank: acceptedAnswers match placeholder count and are non-empty', () => {
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'fill_blank')) {
      const e = ex as Extract<Exercise, { type: 'fill_blank' }>;
      const placeholders = [...e.template.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
      const maxIdx = Math.max(...placeholders);
      expect(e.acceptedAnswers.length, `${e.id} answers count`).toBe(maxIdx + 1);
      placeholders.forEach((p, i) => expect(p, `${e.id} placeholder order`).toBe(i));
      e.acceptedAnswers.forEach((variants) => {
        expect(variants.length, `${e.id} empty variants`).toBeGreaterThan(0);
        variants.forEach((v) => expect(v.length).toBeGreaterThan(0));
      });
    }
  });

  it('predict_output: expectedOutput non-empty', () => {
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'predict_output')) {
      const e = ex as Extract<Exercise, { type: 'predict_output' }>;
      expect(e.expectedOutput.trim().length, e.id).toBeGreaterThan(0);
      expect(e.code, e.id).toContain('int main()');
    }
  });

  it('arrange: shuffledOrder is a permutation and differs from sorted', () => {
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'arrange')) {
      const e = ex as Extract<Exercise, { type: 'arrange' }>;
      expect(e.lines.length).toBeGreaterThanOrEqual(3);
      expect([...e.shuffledOrder].sort((a, b) => a - b)).toEqual(e.lines.map((_, i) => i));
      expect(e.shuffledOrder).not.toEqual(e.lines.map((_, i) => i));
    }
  });

  it('find_error: errorLine in range, fixedLine non-empty', () => {
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'find_error')) {
      const e = ex as Extract<Exercise, { type: 'find_error' }>;
      const lines = e.code.split('\n').length;
      expect(e.errorLine).toBeGreaterThanOrEqual(1);
      expect(e.errorLine).toBeLessThanOrEqual(lines);
      expect(e.fixedLine.trim().length).toBeGreaterThan(0);
    }
  });

  it('match: at least 2 pairs, unique sides', () => {
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'match')) {
      const e = ex as Extract<Exercise, { type: 'match' }>;
      expect(e.pairs.length).toBeGreaterThanOrEqual(2);
      expect(new Set(e.pairs.map((p) => p.left_km)).size).toBe(e.pairs.length);
      expect(new Set(e.pairs.map((p) => p.right)).size).toBe(e.pairs.length);
    }
  });

  it('code_challenge: has starter, solution, >= 1 test case with expected output', () => {
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'code_challenge')) {
      const e = ex as Extract<Exercise, { type: 'code_challenge' }>;
      expect(e.starterCode, e.id).toContain('int main()');
      expect(e.solutionCode, e.id).toContain('int main()');
      expect(e.testCases.length, e.id).toBeGreaterThanOrEqual(1);
      e.testCases.forEach((tc) => expect(tc.expectedOutput.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('curriculum: level metadata', () => {
  it('every level has objective, prerequisites text, outcomes and time estimate', () => {
    for (const lv of allLevels) {
      expect(lv.objective_km.trim().length, `level ${lv.id}`).toBeGreaterThan(10);
      expect(lv.prerequisites_km.trim().length, `level ${lv.id}`).toBeGreaterThan(3);
      expect(lv.outcomes_km.length, `level ${lv.id}`).toBeGreaterThanOrEqual(1);
      expect(lv.estimated_hours, `level ${lv.id}`).toBeGreaterThan(0);
      expect(lv.units.length, `level ${lv.id}`).toBeGreaterThan(0);
    }
  });

  it('published levels contain at least one published lesson', () => {
    for (const lv of allLevels.filter((l) => l.status === 'published')) {
      const pub = lessonsOfLevel(lv.id).filter((l) => l.status === 'published');
      expect(pub.length, `level ${lv.id}`).toBeGreaterThan(0);
    }
  });

  it('getLevel/getLesson lookups work', () => {
    expect(getLevel(1)?.title_km).toContain('មូលដ្ឋាន');
    expect(getLesson('l1-hello-world')?.title_en).toBe('Hello World');
    expect(getLesson('does-not-exist')).toBeUndefined();
  });
});
