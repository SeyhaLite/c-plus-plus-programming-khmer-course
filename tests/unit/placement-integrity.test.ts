import { describe, it, expect } from 'vitest';
import { placementQuestions, scoreToLevel } from '../../src/data/placement-quiz';
import { shuffleChoices } from '../../src/utils/shuffle';

// ============================================================
// Placement test integrity
//
// ការធ្វើតេស្តចំណេះដឹង (placement test) កំណត់កម្រិតចាប់ផ្តើមរបស់អ្នកសិក្សា។
// កំហុសដែលរកឃើញ៖ **សំណួរទាំង ៨ មានចម្លើយត្រឹមត្រូវនៅទីតាំងទី ១ (100%)**។
// ដោយសារតេស្តនេះមិនបានច្របល់ជម្រើសទេ ការចុចជម្រើសដំបូងជានិច្ចផ្តល់ ៨/៨
// → អ្នកសិក្សាដែលមិនចេះ C++ សោះត្រូវបានណែនាំឲ្យចាប់ផ្តើមពីកម្រិតខ្ពស់បំផុត។
// ឥឡូវ `renderQuiz` ច្របល់ជម្រើសដោយប្រើ seed ថ្មីរាល់ការចាប់ផ្តើម។
// ============================================================

describe('placement test: the position bias in the raw data is real', () => {
  it('all 8 questions have answerIndex 0', () => {
    expect(placementQuestions.length).toBe(8);
    const atZero = placementQuestions.filter((q) => q.answerIndex === 0).length;
    expect(atZero).toBe(placementQuestions.length);
  });

  it('scoring 8/8 by always choosing index 0 would give the highest level', () => {
    const gaming = placementQuestions.filter((q) => q.answerIndex === 0).map((q) => q.upToLevel);
    expect(gaming.length).toBe(8);
    expect(scoreToLevel(gaming)).toBe(scoreToLevel(placementQuestions.map((q) => q.upToLevel)));
    // កម្រិតខ្ពស់ជាងកម្រិតដំបូង → ការលោតរំលងមេរៀនពិត
    expect(scoreToLevel(gaming)).toBeGreaterThan(0);
  });
});

describe('placement test: shuffling defeats the exploit', () => {
  it('the correct answer is not at position 0 for most questions in a given attempt', () => {
    let atZeroAcrossAttempts = 0;
    let total = 0;
    for (let attempt = 0; attempt < 40; attempt++) {
      for (let qi = 0; qi < placementQuestions.length; qi++) {
        const q = placementQuestions[qi];
        const { answerPos } = shuffleChoices(q.options_km.length, q.answerIndex, `attempt${attempt}|q${qi}`);
        if (answerPos === 0) atZeroAcrossAttempts++;
        total++;
      }
    }
    // ចៃដន្យពិតប្រហែល 25% — «ចុចជម្រើសដំបូងជានិច្ច» ឥឡូវទទួលបាន ~2/8 មិនមែន 8/8
    expect(atZeroAcrossAttempts / total).toBeLessThan(0.4);
  });

  it('always choosing displayed position 0 now scores close to chance', () => {
    let score = 0;
    const attempts = 200;
    for (let attempt = 0; attempt < attempts; attempt++) {
      for (let qi = 0; qi < placementQuestions.length; qi++) {
        const q = placementQuestions[qi];
        const { answerPos } = shuffleChoices(q.options_km.length, q.answerIndex, `a${attempt}|q${qi}`);
        if (answerPos === 0) score++;
      }
    }
    const rate = score / (attempts * placementQuestions.length);
    expect(rate).toBeLessThan(0.35);
    expect(rate).toBeGreaterThan(0.12);
  });

  it('different attempts produce different orders (retaking cannot memorise positions)', () => {
    const orders = new Set<string>();
    for (let attempt = 0; attempt < 20; attempt++) {
      const order = placementQuestions
        .map((q, qi) => shuffleChoices(q.options_km.length, q.answerIndex, `t${attempt}|q${qi}`).order.join(''))
        .join('/');
      orders.add(order);
    }
    expect(orders.size).toBeGreaterThan(15);
  });

  it('shuffling preserves every option exactly once', () => {
    for (const q of placementQuestions) {
      const { order, answerPos } = shuffleChoices(q.options_km.length, q.answerIndex, 'check');
      expect([...order].sort((a, b) => a - b)).toEqual(q.options_km.map((_, i) => i));
      expect(order[answerPos]).toBe(q.answerIndex);
    }
  });
});

describe('scoreToLevel sanity', () => {
  it('more correct answers never lowers the recommended level', () => {
    const levels = placementQuestions.map((q) => q.upToLevel);
    let prev = scoreToLevel([]);
    for (let i = 1; i <= levels.length; i++) {
      const got = scoreToLevel(levels.slice(0, i));
      expect(got).toBeGreaterThanOrEqual(prev);
      prev = got;
    }
  });
});
