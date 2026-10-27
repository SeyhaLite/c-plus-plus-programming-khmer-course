// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { initProgress, getState, replaceState } from '../../src/services/progress';
import { defaultState, STORAGE_KEY } from '../../src/services/storage';
import { renderExercise } from '../../src/components/exercises';
import { renderLessonView } from '../../src/features/lessons/lesson-view';
import { renderLessonRoute } from '../../src/features/lessons/lessons-route';
import { renderLevelDetail } from '../../src/features/curriculum/levels';
import { getLesson } from '../../src/data/curriculum';
import type { Exercise } from '../../src/types';

// ============================================================
// Integration tests — lesson navigation, exercise interaction,
// progress persistence across simulated refresh.
// ============================================================

function freshState(): void {
  localStorage.clear();
  initProgress();
  replaceState(defaultState());
}

function mount(): HTMLElement {
  document.body.innerHTML = '<div id="app"><main id="main"></main><div id="toasts"></div></div>';
  return document.getElementById('main')!;
}

function click(node: Element): void {
  node.dispatchEvent(new Event('click', { bubbles: true }));
}

function ctx(results: boolean[] = []) {
  return {
    lessonId: 'test-lesson',
    onResult: (correct: boolean) => results.push(correct),
    onHintUsed: () => {},
  };
}

beforeEach(freshState);

/**
 * រកប៊ូតុងជម្រើស MC តាម **អត្ថបទ** មិនមែនតាមទីតាំង DOM ទេ —
 * ចាំបាច់តាំងពីជម្រើសត្រូវបានច្របល់ (shuffleChoices) ដើម្បីកំចាត់ភាពលំអៀងទីតាំង។
 */
function optionByText(root: Element | Document, text: string): Element {
  // អត្ថបទជម្រើសស្ថិតក្នុង <span> ទី ២ (span ទី ១ ជាលេខ key-hint)
  const found = [...root.querySelectorAll('.mc-option')].find(
    (b) => (b.querySelector('span:not(.key-hint)')?.textContent ?? '').trim() === text.trim()
  );
  if (!found) throw new Error(`MC option not found: ${JSON.stringify(text)}`);
  return found;
}

describe('exercise engine: multiple_choice', () => {
  it('grades a correct answer, records XP, shows explanation', () => {
    const ex: Exercise = {
      id: 'mc1', type: 'multiple_choice', prompt_km: 'Pick one', options_km: ['A', 'B'],
      answerIndex: 0, hints_km: ['hint'], explanation_km: 'because A',
    };
    const results: boolean[] = [];
    const { element } = renderExercise(ex, ctx(results));
    document.body.append(element);
    // ចម្លើយត្រឹមត្រូវគឺ 'A' — រកតាមអត្ថបទ ព្រោះទីតាំងត្រូវបានច្របល់
    click(optionByText(element, 'A'));
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('correct')).toBe(true);
    expect(element.textContent).toContain('because A');
    expect(optionByText(element, 'A').classList.contains('correct-answer')).toBe(true);
    expect(results).toEqual([true]);
    // XP recorded: first-try correct = 5
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(persisted.xp).toBe(5);
  });

  it('wrong answer goes to review queue and allows retry', () => {
    const ex: Exercise = {
      id: 'mc2', type: 'multiple_choice', prompt_km: 'Pick', options_km: ['A', 'B'],
      answerIndex: 1, hints_km: [], explanation_km: 'B is right',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    click(optionByText(element, 'A')); // ខុស (ចម្លើយត្រឹមត្រូវគឺ 'B')
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('incorrect')).toBe(true);
    expect(optionByText(element, 'A').classList.contains('wrong-answer')).toBe(true);
    expect(getState().reviewQueue.some((r) => r.exerciseId === 'mc2')).toBe(true);
    // retry correct → removed from review queue
    click(optionByText(element, 'B'));
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('correct')).toBe(true);
    expect(getState().reviewQueue.some((r) => r.exerciseId === 'mc2')).toBe(false);
  });

  it('options are shuffled but grading follows the TEXT, not the position', () => {
    // កំហុសចាស់៖ ៩២% នៃលំហាត់មានចម្លើយនៅទីតាំងទី ១ → ចុចជម្រើសដំបូងជានិច្ច = ៩២%។
    const ex: Exercise = {
      id: 'mc-shuffled', type: 'multiple_choice', prompt_km: 'Pick', options_km: ['W', 'X', 'Y', 'Z'],
      answerIndex: 0, hints_km: [], explanation_km: 'W is right',
    };
    const positions = new Set<number>();
    for (const seedDay of ['2026-10-27', '2026-10-28', '2026-11-1', '2027-3-9']) {
      // render ជាមួយ seed ថ្ងៃផ្សេងគ្នា (mock ថ្ងៃ)
      const RealDate = Date;
      const [y, m, d] = seedDay.split('-').map(Number);
      globalThis.Date = class extends RealDate {
        constructor() { super(y, m - 1, d, 12, 0, 0); }
      } as unknown as DateConstructor;
      try {
        const { element } = renderExercise(ex, ctx());
        document.body.append(element);
        const btns = [...element.querySelectorAll('.mc-option')];
        positions.add(btns.findIndex((b) => (b.textContent ?? '').endsWith('W')));
        // ចុចជម្រើសដែលបង្ហាញនៅទីតាំងទី ១ — grading ត្រូវតែតាម **អត្ថបទ** មិនមែនទីតាំង
        click(btns[0]);
        click(element.querySelector('.check-btn')!);
        const wBtn = btns.find((b) => (b.textContent ?? '').endsWith('W'))!;
        expect(wBtn.classList.contains('correct-answer')).toBe(true);
        element.remove();
      } finally {
        globalThis.Date = RealDate;
      }
    }
    // ចម្លើយត្រឹមត្រូវមិននៅទីតាំងដដែលរាល់ថ្ងៃទេ → ការចាំទីតាំងមិនអាចប្រើបាន
    // (តេស្ត distribution ពេញលេញស្ថិតក្នុង tests/unit/shuffle.test.ts)
    expect(positions.size).toBeGreaterThan(1);
  });

  it('number keys 1-4 select the matching option (the key-hint is now real)', () => {
    const ex: Exercise = {
      id: 'mc-keys', type: 'multiple_choice', prompt_km: 'Pick', options_km: ['W', 'X', 'Y', 'Z'],
      answerIndex: 2, hints_km: [], explanation_km: 'Y is right',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    const box = element.querySelector('.mc-options')!;
    box.dispatchEvent(Object.assign(new Event('keydown', { bubbles: true }), { key: '3' }));
    const btns = [...element.querySelectorAll('.mc-option')];
    expect(btns[2].getAttribute('aria-pressed')).toBe('true');
    click(element.querySelector('.check-btn')!);
    // លេខ ៣ = ទីតាំងទី ៣ ដែលបង្ហាញ (មិនមែន index ២ នៃ options_km) → អាចត្រូវ ឬខុស
    expect(element.classList.contains('correct') || element.classList.contains('incorrect')).toBe(true);
  });

  it('progressive hints reveal one at a time', () => {
    const ex: Exercise = {
      id: 'mc3', type: 'multiple_choice', prompt_km: 'Pick', options_km: ['A', 'B'],
      answerIndex: 0, hints_km: ['first hint', 'second hint'], explanation_km: 'ok',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    const hintBtn = element.querySelector('.hint-btn') as HTMLButtonElement;
    click(hintBtn);
    expect(element.textContent).toContain('first hint');
    expect(element.textContent).not.toContain('second hint');
    click(hintBtn);
    expect(element.textContent).toContain('second hint');
    expect(hintBtn.disabled).toBe(true);
  });
});

describe('exercise engine: other types', () => {
  it('predict_output grades whitespace-tolerantly', () => {
    const ex: Exercise = {
      id: 'po1', type: 'predict_output', prompt_km: 'What prints?', code: 'int main(){}',
      expectedOutput: 'Hello\n', hints_km: [], explanation_km: 'e',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    (element.querySelector('textarea') as HTMLTextAreaElement).value = 'Hello';
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('correct')).toBe(true);
  });

  it('fill_blank: per-blank diagnostics, near-miss state, and answer reveal', () => {
    const ex: Exercise = {
      id: 'fb1', type: 'fill_blank', prompt_km: 'Fill', template: '{{0}} << "Hello, World!" << std::endl;',
      acceptedAnswers: [['std::cout']], hints_km: ['ឈ្មោះពេញគឺ std::cout'], explanation_km: 'e',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    const input = element.querySelector('.blank-input') as HTMLInputElement;
    // 1st wrong: which-blank diagnostic
    input.value = 'nope';
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('incorrect')).toBe(true);
    expect(element.textContent).toContain('ចន្លោះទី 1: «nope» មិនត្រឹមត្រូវទេ');
    // 2nd wrong: auto-hint included
    input.value = 'xyz';
    click(element.querySelector('.check-btn')!);
    expect(element.textContent).toContain('គន្លឹះ៖ ឈ្មោះពេញគឺ std::cout');
    // near-miss typo: "so close" state, not plain wrong
    input.value = 'std::cont';
    click(element.querySelector('.check-btn')!);
    expect(input.classList.contains('close')).toBe(true);
    expect(element.textContent).toContain('ខុសបន្តិច');
    // ការប្រៀបធៀបតួអក្សរ (Compare me) ត្រូវតែបង្ហាញ — អ្នកសិក្សាមិនត្រូវជាប់គាំង
    expect(element.textContent).toContain('std::cout');
    const compare = element.querySelector('.blank-compare') as HTMLElement;
    expect(compare.hidden).toBe(false);
    expect(compare.textContent).toContain('ទីតាំង 8');
    // 4th wrong: reveal accepted answer so learner is never stuck
    input.value = 'still-wrong';
    click(element.querySelector('.check-btn')!);
    expect(element.textContent).toContain('ចម្លើយត្រឹមត្រូវ៖');
    expect(element.textContent).toContain('ចន្លោះទី 1 = std::cout');
    // typing the correct answer still required to pass
    input.value = 'std::cout';
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('correct')).toBe(true);
  });

  it('find_error identifies the right line', () => {
    const ex: Exercise = {
      id: 'fe1', type: 'find_error', prompt_km: 'Find', code: 'a;\nb;\nc;',
      errorLine: 2, fixedLine: 'b fixed;', hints_km: [], explanation_km: 'e',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    click(element.querySelectorAll('.error-line')[1]);
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('correct')).toBe(true);
  });

  it('arrange grades correct ordering after moving items', () => {
    const ex: Exercise = {
      id: 'ar1', type: 'arrange', prompt_km: 'Sort', lines: ['one', 'two', 'three'],
      shuffledOrder: [1, 0, 2], hints_km: [], explanation_km: 'e',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    // current visual order: two, one, three → move item 0 ("two") down once
    const firstRow = element.querySelectorAll('.arrange-item')[0];
    const downBtn = firstRow.querySelectorAll('.move-btns button')[1];
    click(downBtn);
    click(element.querySelector('.check-btn')!);
    expect(element.classList.contains('correct')).toBe(true);
  });

  it('match pairs left→right and completes when all matched', () => {
    const ex: Exercise = {
      id: 'mt1', type: 'match', prompt_km: 'Match',
      pairs: [{ left_km: 'ទីមួយ', right: 'first' }, { left_km: 'ទីពីរ', right: 'second' }],
      hints_km: [], explanation_km: 'e',
    };
    const { element } = renderExercise(ex, ctx());
    document.body.append(element);
    const buttons = [...element.querySelectorAll('.match-item')] as HTMLButtonElement[];
    const findBtn = (text: string): HTMLButtonElement => buttons.find((b) => b.textContent?.includes(text))!;
    click(findBtn('ទីមួយ'));
    click(findBtn('first'));
    click(findBtn('ទីពីរ'));
    click(findBtn('second'));
    expect(element.classList.contains('correct')).toBe(true);
  });
});

describe('lesson route behavior', () => {
  it('renders a published lesson with explanation and exercises', () => {
    // complete the prerequisite chain first (l1-hello-world requires l0-how-to-use)
    const s = defaultState();
    s.completedLessons['l0-how-to-use'] = { completedAt: new Date().toISOString(), score: 1, attempts: 1, hintsUsed: 0 };
    replaceState(s);
    const host = mount();
    renderLessonRoute('1', 'l1-hello-world', host);
    expect(host.textContent).toContain('Hello World');
    expect(host.querySelectorAll('.exercise').length).toBeGreaterThanOrEqual(3);
    expect(host.textContent).toContain('លទ្ធផលរំពឹងទុក');
  });

  it('shows an honest "planned" notice for unpublished lessons', () => {
    const host = mount();
    renderLessonRoute('6', 'l6-arrays', host);
    expect(host.textContent).toContain('កំពុងរៀបចំ');
    expect(host.querySelectorAll('.exercise').length).toBe(0);
  });

  it('blocks locked lessons and lists the prerequisite', () => {
    const host = mount();
    renderLessonRoute('1', 'l1-main-function', host); // requires l1-hello-world
    expect(host.textContent).toContain('នៅបិទ');
    expect(host.textContent).toContain('Hello World');
  });

  it('unlocks after completing the prerequisite', () => {
    freshState();
    const s = defaultState();
    s.completedLessons['l1-hello-world'] = { completedAt: new Date().toISOString(), score: 1, attempts: 1, hintsUsed: 0 };
    replaceState(s);
    const host = mount();
    renderLessonRoute('1', 'l1-main-function', host);
    expect(host.textContent).not.toContain('នៅបិទ');
    expect(host.querySelectorAll('.exercise').length).toBeGreaterThan(0);
  });

  it('404 for unknown lesson id', () => {
    const host = mount();
    renderLessonRoute('1', 'no-such-lesson', host);
    expect(host.textContent).toContain('រកមិនឃើញ');
  });
});

describe('lesson completion flow', () => {
  it('completing all required exercises marks the lesson done and persists it', () => {
    const host = mount();
    const lesson = getLesson('l0-what-is-cpp')!;
    renderLessonView(lesson, host);

    // Solve MC #1 (answerIndex known from data)
    const exercises = [...host.querySelectorAll('.exercise')];
    expect(exercises.length).toBe(lesson.exercises.length);

    function solveMc(root: Element, lessonData: Exercise): void {
      const mc = lessonData as Extract<Exercise, { type: 'multiple_choice' }>;
      // ជម្រើសត្រូវបានច្របល់ → ជ្រើសតាមអត្ថបទនៃចម្លើយត្រឹមត្រូវ មិនមែនតាមសន្ទស្សន៍ទេ
      click(optionByText(root, mc.options_km[mc.answerIndex]));
      click(root.querySelector('.check-btn')!);
    }
    function solveMatch(root: Element, lessonData: Exercise): void {
      const m = lessonData as Extract<Exercise, { type: 'match' }>;
      const buttons = [...root.querySelectorAll('.match-item')] as HTMLButtonElement[];
      for (const pair of m.pairs) {
        const left = buttons.find((b) => b.textContent === pair.left_km)!;
        const right = buttons.find((b) => b.textContent === pair.right)!;
        click(left);
        click(right);
      }
    }

    lesson.exercises.forEach((ex, i) => {
      if (ex.type === 'multiple_choice') solveMc(exercises[i], ex);
      else if (ex.type === 'match') solveMatch(exercises[i], ex);
    });

    expect(getState().completedLessons['l0-what-is-cpp']).toBeTruthy();
    expect(getState().achievements).toContain('first-lesson');
    // persisted through localStorage ("refresh" survival)
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(persisted.completedLessons['l0-what-is-cpp']).toBeTruthy();
    expect(host.textContent).toContain('សង្ខេបមេរៀន');
    expect(host.querySelector('.completion-panel')).toBeTruthy();
    expect(host.textContent).toContain('មេរៀនបន្ទាប់');
  });

  it('progress survives a simulated refresh (re-init from storage)', () => {
    const s = getState();
    s.xp = 42;
    // force persist
    replaceState({ ...s });
    initProgress(); // simulates page reload
    expect(getState().xp).toBe(42);
  });
});

describe('level detail page', () => {
  it('renders published level with lesson path', () => {
    const host = mount();
    renderLevelDetail(1, host);
    expect(host.textContent).toContain('មូលដ្ឋាន C++');
    expect(host.querySelectorAll('.path-node').length).toBe(5);
  });

  it('renders planned level with honest notice', () => {
    const host = mount();
    renderLevelDetail(7, host);
    expect(host.textContent).toContain('កំពុងរៀបចំ');
    expect(host.textContent).toContain('Pointers');
  });
});
