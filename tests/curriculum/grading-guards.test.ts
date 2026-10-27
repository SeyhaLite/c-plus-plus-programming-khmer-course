import { describe, it, expect } from 'vitest';
import { allLessons } from '../../src/data/curriculum';
import { gradeBlank, outputsMatch, stripCodeComments } from '../../src/utils/grading';
import type { Exercise, FillBlankExercise, Lesson, PredictOutputExercise } from '../../src/types';

// ============================================================
// ការការពារកំហុស grading (grading regression guards)
//
// ប្រវត្តិ៖ អ្នកសិក្សាបានរាយការណ៍ថាជាប់គាំងក្នុងលំហាត់បំពេញចន្លោះ —
// សារនិយាយ «ស្ទើរតែត្រូវហើយ ខុសតែ ១ អក្សរ» ប៉ុន្តែគាត់មើលមិនឃើញអក្សរខុស
// ហើយទោះបីជាវាយចម្លើយត្រឹមត្រូវក៏នៅតែមិនជាប់។ មូលហេតុពិត៖
//   ១. អក្សរលាក់ (ZWSP/BOM/bidi) និងអក្សរដូច ASCII (Cyrillic/Greek/fullwidth)
//      បង្កើត Levenshtein = ១ ប៉ុន្តែមើលមិនឃើញ → ជាប់គាំងជាអចិន្ត្រៃយ៍។
//   ២. ចម្លើយត្រឹមត្រូវដែលសមមូល (cout, i+=1, i = i + 1, "and") ត្រូវបានបដិសេធ
//      ព្រោះ acceptedAnswers មានតែមួយទម្រង់។
//   ៣. STD::COUT (មិនដំណើរការក្នុង C++) ត្រូវបាន **ទទួលយក** ព្រោះ case-insensitive។
//   ៤. fuzzyClose មាន gate `length < 4` → ចម្លើយខ្លី (%, &&, //, \n) គ្មានមតិអ្វីសោះ។
// តេស្តទាំងនេះធានាថាកំហុសទាំង ៤ មិនអាចត្រឡប់មកវិញបានទេ។
// ============================================================

const published = allLessons.filter((l) => l.status === 'published');
const allExercises: { lesson: Lesson; ex: Exercise }[] = published.flatMap((l) =>
  l.exercises.map((ex) => ({ lesson: l, ex }))
);
const fillBlanks = allExercises.filter((x) => x.ex.type === 'fill_blank');

const KHMER_RE = /[\u1780-\u17FF\u17E0-\u17E9\u17D4-\u17DA]/;
const ASCII_RE = /^[\x20-\x7e]*$/;

describe('fill_blank: every declared accepted answer actually passes the grader', () => {
  it('has fill_blank exercises to check', () => {
    expect(fillBlanks.length).toBeGreaterThan(0);
  });

  for (const { ex } of fillBlanks) {
    const f = ex as FillBlankExercise;
    it(`${f.id}: all ${f.acceptedAnswers.flat().length} accepted variant(s) grade as correct`, () => {
      f.acceptedAnswers.forEach((variants, blankIdx) => {
        variants.forEach((v) => {
          const verdict = gradeBlank(v, variants, { text: f.prose });
          expect(verdict.ok, `variant ${JSON.stringify(v)} of blank ${blankIdx} was REJECTED`).toBe(true);
        });
      });
    });
  }
});

describe('fill_blank: no accepted answer is a single fragile form', () => {
  it('identifier/operator blanks offer at least one variant, and long code blanks tolerate spacing', () => {
    for (const { ex } of fillBlanks) {
      const f = ex as FillBlankExercise;
      f.acceptedAnswers.forEach((variants, i) => {
        expect(variants.length, `${f.id} blank ${i} has no accepted answers`).toBeGreaterThan(0);
        // ចម្លើយដែលមាន operator + ចន្លោះ ត្រូវតែទទួលយកទម្រង់គ្មានចន្លោះផង
        for (const v of variants) {
          const noSpace = v.replace(/\s*([+\-*/%=<>!&|^~?:,;])\s*/g, '$1');
          if (noSpace !== v) {
            expect(
              gradeBlank(noSpace, variants, { text: f.prose }).ok,
              `${f.id} blank ${i}: «${v}» is accepted but the spacing variant «${noSpace}» is not`
            ).toBe(true);
          }
        }
      });
    }
  });

  it('accepts equivalent forms learners actually type (real regressions)', () => {
    const hello = fillBlanks.find((x) => x.ex.id === 'l1-hello-world-ex2')?.ex as FillBlankExercise | undefined;
    if (hello) {
      const acc = hello.acceptedAnswers[0];
      for (const typed of ['std::cout', 'cout', 'std:: cout', '  std::cout  ']) {
        expect(gradeBlank(typed, acc, { text: hello.prose }).ok, `should accept ${JSON.stringify(typed)}`).toBe(true);
      }
      // C++ ជាភាសា case-sensitive — ចម្លើយអក្សរធំមិនដំណើរការទេ ដូច្នេះមិនត្រូវទទួលយក
      expect(gradeBlank('STD::COUT', acc, { text: hello.prose }).ok).toBe(false);
      expect(gradeBlank('STD::COUT', acc, { text: hello.prose }).problems.some((p) => p.kind === 'case')).toBe(true);
    }
    const forLoop = fillBlanks.find((x) => x.ex.id === 'l4-for-ex3')?.ex as FillBlankExercise | undefined;
    if (forLoop) {
      const acc = forLoop.acceptedAnswers[0];
      for (const typed of ['++i', 'i++', 'i += 1', 'i+=1', 'i = i + 1', 'i=i+1']) {
        expect(gradeBlank(typed, acc, { text: forLoop.prose }).ok, `should accept ${JSON.stringify(typed)}`).toBe(true);
      }
    }
  });
});

describe('fill_blank: invisible/look-alike characters can never dead-end a learner', () => {
  const ZWSP = '\u200b';
  const CYR_O = '\u043e';
  const CYR_S = '\u0455';
  const FULLWIDTH_COLON = '\uff1a';

  it('a correct answer polluted by invisible chars is accepted AND explained', () => {
    for (const { ex } of fillBlanks) {
      const f = ex as FillBlankExercise;
      if (f.prose) continue;
      const answer = f.acceptedAnswers[0][0];
      if (!ASCII_RE.test(answer)) continue;
      const polluted = `${answer}${ZWSP}`;
      const v = gradeBlank(polluted, f.acceptedAnswers[0], { text: f.prose });
      expect(v.ok, `${f.id}: invisible char made a correct answer fail`).toBe(true);
      expect(v.autoFixed, `${f.id}: auto-fix must be reported`).toBe(true);
      expect(v.problems.some((p) => p.kind === 'invisible'), `${f.id}: must name the invisible char`).toBe(true);
    }
  });

  it('a correct answer typed with homoglyphs is accepted AND the glyph is named', () => {
    for (const { ex } of fillBlanks) {
      const f = ex as FillBlankExercise;
      if (f.prose) continue;
      const answer = f.acceptedAnswers[0][0];
      if (!/[os]/.test(answer)) continue;
      const polluted = answer.replace(/o/g, CYR_O).replace(/s/g, CYR_S);
      if (polluted === answer) continue;
      const v = gradeBlank(polluted, f.acceptedAnswers[0], { text: f.prose });
      expect(v.ok, `${f.id}: homoglyphs made a correct answer fail`).toBe(true);
      expect(v.problems.some((p) => p.kind === 'homoglyph'), `${f.id}: must name the homoglyph`).toBe(true);
    }
  });

  it('fullwidth punctuation is folded instead of silently rejected', () => {
    const v = gradeBlank(`std${FULLWIDTH_COLON}${FULLWIDTH_COLON}cout`, ['std::cout']);
    expect(v.ok).toBe(true);
    expect(v.autoFixed).toBe(true);
  });

  it('near-miss feedback exists even for 1–3 character answers (old length<4 gate removed)', () => {
    expect(gradeBlank('&&&', ['&&']).close).toBe(true);
    expect(gradeBlank('///', ['//']).close).toBe(true);
    expect(gradeBlank('/n', ['\\n']).close).toBe(true);
    expect(gradeBlank('%%', ['%']).close).toBe(true);
  });
});

describe('fill_blank: C++ templates stay C++ (Khmer prose must be flagged)', () => {
  it('non-prose templates and answers are pure ASCII outside comments/strings', () => {
    for (const { ex } of fillBlanks) {
      const f = ex as FillBlankExercise;
      if (f.prose) continue;
      // អក្សរខ្មែរ **ក្នុង comment** គឺត្រឹមត្រូវ (វាជាការពន្យល់)។
      // អក្សរខ្មែរ **ក្រៅ comment** នៅក្នុង template កូដ C++ = កំហុសមាតិកា។
      const bare = stripCodeComments(f.template.replace(/\{\{\d+\}\}/g, f.acceptedAnswers[0]?.[0] ?? ''));
      expect(KHMER_RE.test(bare), `${f.id}: Khmer text outside a comment inside a C++ template — mark it prose:true or move it into a comment`).toBe(false);
      f.acceptedAnswers.forEach((variants, i) => {
        variants.forEach((v) => {
          expect(KHMER_RE.test(v), `${f.id} blank ${i}: Khmer accepted answer inside a C++ exercise`).toBe(false);
        });
      });
    }
  });

  it('prose exercises are explicitly marked', () => {
    for (const { ex } of fillBlanks) {
      const f = ex as FillBlankExercise;
      // template ជាអត្ថបទខ្មែរ (មិនមែនកូដ) → ត្រូវតែ prose:true
      // បំពេញចន្លោះជាមុនសិន — បើមិនដូច្នោះទេ `{{0}} នេះជា comment`
      // មិនត្រូវបានចាត់ទុកជា comment ទេ (ព្រោះ // មិនទាន់មាន)។
      const filled = f.template.replace(/\{\{(\d+)\}\}/g, (_m, i: string) => f.acceptedAnswers[Number(i)]?.[0] ?? '');
      const templateIsProse = KHMER_RE.test(stripCodeComments(filled));
      if (templateIsProse) {
        expect(f.prose, `${f.id}: Khmer-language blank must set prose:true so grading is tolerant`).toBe(true);
      }
      // ច្រាសមកវិញ៖ prose:true មិនគួរមានលើ template កូដ C++ ទេ
      if (f.prose) {
        expect(KHMER_RE.test(stripCodeComments(filled)), `${f.id}: prose:true on a C++ template`).toBe(true);
      }
    }
  });
});

describe('predict_output: blank lines are significant (regression)', () => {
  it('no expectedOutput contains an internal blank line without a matching note', () => {
    // បន្ទាត់ទទេខាងក្នុងធ្វើឲ្យចម្លើយមិនច្បាស់លាស់ (អ្នកសិក្សាមិនដឹងថាត្រូវវាយ Enter ប៉ុន្មានដង)។
    // បន្ទាត់ទទេនៅចុង (\n ចុងក្រោយ) គឺធម្មតា ព្រោះ outputsMatch អត់ឱន។
    for (const { ex } of allExercises.filter((x) => x.ex.type === 'predict_output')) {
      const p = ex as PredictOutputExercise;
      const trimmed = p.expectedOutput.replace(/\n+$/, '');
      expect(/\n[ \t]*\n/.test(trimmed), `${p.id}: internal blank line in expectedOutput`).toBe(false);
      expect(/[ \t]+\n/.test(p.expectedOutput), `${p.id}: trailing spaces on an output line`).toBe(false);
    }
  });

  it('grader distinguishes a missing blank line', () => {
    const withBlank = allExercises
      .filter((x) => x.ex.type === 'predict_output')
      .map((x) => x.ex as PredictOutputExercise)
      .find((p) => /\n\n/.test(p.expectedOutput));
    if (withBlank) {
      const collapsed = withBlank.expectedOutput.replace(/\n\n/g, '\n');
      expect(outputsMatch(collapsed, withBlank.expectedOutput)).toBe(false);
    }
  });
});
