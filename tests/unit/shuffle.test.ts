import { describe, it, expect } from 'vitest';
import { shuffleChoices, seededRandom, hashString, shuffled, todaySeedPart } from '../../src/utils/shuffle';
import { allLessons } from '../../src/data/curriculum';
import type { MultipleChoiceExercise } from '../../src/types';

// ============================================================
// Position-bias guards
//
// កំហុសដែលតេស្តទាំងនេះទប់ស្កាត់៖ **៣៣ ក្នុងចំណោម ៣៦ (92%) លំហាត់ជ្រើសរើសចម្លើយ
// មានចម្លើយត្រឹមត្រូវនៅទីតាំងទី ១**។ អ្នកសិក្សាអាចទទួលបាន ~៩២% ដោយចុចជម្រើស
// ដំបូងជានិច្ច ដោយមិនចាំបាច់ចេះ C++ — លំហាត់ទាំងអស់គ្មានតម្លៃវាស់វែង។
// ដំណោះស្រាយ៖ `shuffleChoices` ច្របល់លំដាប់ពេល render។
// ============================================================

const published = allLessons.filter((l) => l.status === 'published');
const mcs = published.flatMap((l) =>
  l.exercises.filter((e): e is MultipleChoiceExercise => e.type === 'multiple_choice')
);

describe('the historical position bias is real and is now neutralised', () => {
  it('documents the raw data bias (33/36 answers sit at index 0)', () => {
    const atZero = mcs.filter((m) => m.answerIndex === 0).length;
    // បើលេខនេះធ្លាក់ចុះ (អ្នកនិពន្ធកែមាតិកា) តេស្តនេះនៅតែត្រឹមត្រូវ —
    // ចំណុចសំខាន់គឺថាភាពលំអៀងដើមមានពិត ហើយ shuffle គឺជាដំណោះស្រាយ។
    expect(atZero / mcs.length).toBeGreaterThan(0.5);
  });

  it('after shuffling, the correct answer is NOT usually at position 0', () => {
    const days = ['2026-10-27', '2026-10-28', '2026-11-3', '2027-1-15', '2027-6-1'];
    let atZero = 0;
    let total = 0;
    for (const day of days) {
      for (const m of mcs) {
        const { answerPos } = shuffleChoices(m.options_km.length, m.answerIndex, `${m.id}|${day}`);
        if (answerPos === 0) atZero++;
        total++;
      }
    }
    // ចៃដន្យពិតប្រហែល 25% សម្រាប់ជម្រើស ៤។ អនុញ្ញាតឲ្យមានភាពប្រែប្រួល។
    expect(atZero / total).toBeLessThan(0.4);
    expect(atZero / total).toBeGreaterThan(0.08);
  });

  it('position distribution across many seeds is roughly uniform', () => {
    const dist = [0, 0, 0, 0];
    let n = 0;
    for (let i = 0; i < 4000; i++) {
      const { answerPos } = shuffleChoices(4, 0, `seed-${i}`);
      dist[answerPos]++;
      n++;
    }
    for (const c of dist) {
      expect(c / n, `distribution ${JSON.stringify(dist)}`).toBeGreaterThan(0.15);
      expect(c / n, `distribution ${JSON.stringify(dist)}`).toBeLessThan(0.35);
    }
  });
});

describe('shuffleChoices correctness', () => {
  it('never loses or duplicates an option', () => {
    for (let i = 0; i < 500; i++) {
      const { order } = shuffleChoices(4, i % 4, `s${i}`);
      expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
    }
  });

  it('answerPos always points at the original answerIndex', () => {
    for (const len of [2, 3, 4, 5]) {
      for (const ans of Array.from({ length: len }, (_, i) => i)) {
        for (let i = 0; i < 50; i++) {
          const { order, answerPos } = shuffleChoices(len, ans, `x${i}`);
          expect(order[answerPos]).toBe(ans);
        }
      }
    }
  });

  it('is deterministic for the same seed (retry must not move the options)', () => {
    const a = shuffleChoices(4, 0, 'lesson|2026-10-27');
    const b = shuffleChoices(4, 0, 'lesson|2026-10-27');
    expect(a.order).toEqual(b.order);
    expect(a.answerPos).toBe(b.answerPos);
  });

  it('differs between exercises on the same day', () => {
    const seen = new Set<string>();
    for (const m of mcs) {
      seen.add(shuffleChoices(m.options_km.length, m.answerIndex, `${m.id}|${todaySeedPart()}`).order.join(','));
    }
    // លំហាត់ខុសគ្នាគួរមានលំដាប់ខុសគ្នាយ៉ាងហោចណាស់ពាក់កណ្តាល
    expect(seen.size).toBeGreaterThan(mcs.length / 2);
  });

  it('never leaves a 2+ option question in its original order', () => {
    for (let i = 0; i < 500; i++) {
      const { order } = shuffleChoices(4, 1, `id${i}`);
      expect(order.every((v, k) => v === k), `identity shuffle at seed id${i}`).toBe(false);
    }
  });

  it('handles degenerate sizes without throwing', () => {
    expect(shuffleChoices(0, 0, 'z').order).toEqual([]);
    expect(shuffleChoices(1, 0, 'z')).toEqual({ order: [0], answerPos: 0 });
    expect(shuffleChoices(2, 1, 'z').order).toHaveLength(2);
  });
});

describe('shuffle primitives', () => {
  it('seededRandom is in [0,1) and deterministic', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    for (let i = 0; i < 100; i++) {
      const v = a();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      expect(v).toBe(b());
    }
  });

  it('hashString is stable and order-sensitive', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
    expect(hashString('')).toBeGreaterThan(0);
  });

  it('shuffled does not mutate the input array', () => {
    const src = [1, 2, 3, 4, 5];
    const copy = [...src];
    shuffled(src, seededRandom(1));
    expect(src).toEqual(copy);
  });

  it('todaySeedPart returns a Y-M-D string', () => {
    expect(todaySeedPart(new Date(2026, 9, 27))).toBe('2026-10-27');
  });
});
