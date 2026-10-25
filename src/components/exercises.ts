import type { Exercise, MultipleChoiceExercise, FillBlankExercise, PredictOutputExercise, ArrangeExercise, MatchExercise, CodeChallengeExercise } from '../types';
import { el } from '../utils/dom';
import { icon } from '../app/icons';
import { outputsMatch, codeMatches } from '../utils/dom';
import { recordExerciseResult, getState } from '../services/progress';
import { playSound } from '../services/audio';
import { runTestCases, normalizeOutput } from '../services/code-execution';
import { openConsentDialog } from '../features/playground/consent';
import { highlightedCode } from '../utils/highlight';
import { pickPhrase, cheerCorrect, cheerRetry } from '../data/encouragement';
import { startStatusTimer } from '../utils/status-timer';

// ============================================================
// Exercise engine — លំហាត់អន្តរកម្ម + ការផ្តល់មតិភ្លាមៗ
// លំដាប់៖ ធ្វើលំហាត់ → ពិនិត្យ → មតិ → (ព្យាយាមម្តងទៀត) → ជាប់
// ============================================================

const typeLabels_km: Record<Exercise['type'], string> = {
  multiple_choice: 'ជ្រើសរើសចម្លើយ',
  fill_blank: 'បំពេញចន្លោះ',
  predict_output: 'ទាយលទ្ធផល',
  arrange: 'តម្រៀបកូដ',
  find_error: 'រកកំហុស',
  match: 'ផ្គូផ្គង',
  code_challenge: 'សរសេរកូដ',
};

export interface ExerciseContext {
  lessonId: string;
  onResult: (correct: boolean) => void;
  onHintUsed: () => void;
}

export interface ExerciseHandle {
  element: HTMLElement;
  isSolved: () => boolean;
}

export function renderExercise(ex: Exercise, ctx: ExerciseContext): ExerciseHandle {
  let solved = false;
  let attempts = 0;
  let hintsShown = 0;
  let feedbackEl: HTMLElement | null = null;

  const root = el('section', { class: 'exercise', 'aria-labelledby': `${ex.id}-prompt` });

  const prompt = el('h4', { id: `${ex.id}-prompt`, class: 'exercise-prompt' }, ex.prompt_km);
  const head = el('div', { class: 'exercise-head' }, el('span', { class: 'tag tag-primary exercise-type-tag' }, typeLabels_km[ex.type]), ex.required === false ? el('span', { class: 'tag tag-muted' }, 'មិនចាំបាច់') : null);
  const body = el('div', { class: 'exercise-body' });
  const actions = el('div', { class: 'exercise-actions' });

  function showFeedback(kind: 'correct' | 'incorrect' | 'hint', text: string): void {
    if (feedbackEl) feedbackEl.remove();
    feedbackEl = el(
      'div',
      { class: `feedback ${kind}`, role: 'status' },
      icon(kind === 'correct' ? 'check' : kind === 'incorrect' ? 'x' : 'lightbulb', 20),
      el('div', {}, text)
    );
    root.appendChild(feedbackEl);
  }

  function grade(correct: boolean): void {
    attempts += 1;
    if (correct && !solved) {
      solved = true;
      root.classList.add('correct');
      root.classList.remove('incorrect');
      showFeedback('correct', `${pickPhrase(cheerCorrect)} ${ex.explanation_km}`);
      playSound('correct');
      recordExerciseResult(ctx.lessonId, ex.id, true, attempts === 1);
      ctx.onResult(true);
      lockInputs();
    } else if (!correct) {
      root.classList.add('incorrect');
      showFeedback('incorrect', `${pickPhrase(cheerRetry)} ចង់ឃើញគន្លឹះ? ចុចប៊ូតុងជំនួយខាងក្រោម។`);
      playSound('incorrect');
      recordExerciseResult(ctx.lessonId, ex.id, false, false);
      ctx.onResult(false);
    }
  }

  function lockInputs(): void {
    root.querySelectorAll('button:not(.hint-btn)').forEach((b) => {
      if (!b.classList.contains('check-btn') && !b.classList.contains('hint-btn')) (b as HTMLButtonElement).disabled = true;
    });
    root.querySelectorAll('input, textarea').forEach((i) => ((i as HTMLInputElement).disabled = true));
    root.querySelectorAll('.check-btn').forEach((b) => ((b as HTMLButtonElement).disabled = true));
    root.querySelectorAll('.mc-option').forEach((b) => b.setAttribute('tabindex', '-1'));
  }

  const checkBtn = el('button', { class: 'btn btn-primary check-btn', onclick: () => { void doCheck(); } }, icon('check', 18), 'ពិនិត្យចម្លើយ');
  const hintBtn = el(
    'button',
    {
      class: 'btn btn-ghost hint-btn',
      onclick: () => {
        if (hintsShown < ex.hints_km.length) {
          showFeedback('hint', `ជំនួយទី ${hintsShown + 1}៖ ${ex.hints_km[hintsShown]}`);
          hintsShown += 1;
          ctx.onHintUsed();
        }
        hintBtn.textContent = '';
        hintBtn.append(icon('lightbulb', 18), `ជំនួយ (${hintsShown}/${ex.hints_km.length})`);
        if (hintsShown >= ex.hints_km.length) hintBtn.disabled = true;
      },
    },
    icon('lightbulb', 18),
    `ជំនួយ (0/${ex.hints_km.length})`
  );

  actions.append(checkBtn);
  if (ex.hints_km.length > 0) actions.append(hintBtn);

  // ----- type-specific rendering + check logic -----
  let checkFn: () => void = () => {};

  switch (ex.type) {
    case 'multiple_choice': {
      const exmc = ex as MultipleChoiceExercise;
      let selected = -1;
      const optionBtns = exmc.options_km.map((text, i) => {
        const b = el(
          'button',
          {
            class: 'mc-option',
            type: 'button',
            'aria-pressed': 'false',
            onclick: () => {
              selected = i;
              optionBtns.forEach((ob, j) => {
                ob.setAttribute('aria-pressed', String(j === i));
                ob.classList.remove('correct-answer', 'wrong-answer');
              });
              playSound('click');
            },
          },
          el('span', { class: 'key-hint' }, String(i + 1)),
          el('span', {}, text)
        );
        return b;
      });
      body.append(el('div', { class: 'mc-options', role: 'group', 'aria-label': 'ជម្រើសចម្លើយ' }, ...optionBtns));
      checkFn = () => {
        if (selected < 0) { showFeedback('hint', 'សូមជ្រើសរើសចម្លើយមួយជាមុនសិន។'); return; }
        optionBtns.forEach((b, j) => {
          b.classList.remove('correct-answer', 'wrong-answer');
          if (j === exmc.answerIndex) b.classList.add('correct-answer');
          else if (j === selected) b.classList.add('wrong-answer');
        });
        grade(selected === exmc.answerIndex);
      };
      break;
    }

    case 'fill_blank': {
      const exf = ex as FillBlankExercise;
      const parts = exf.template.split(/(\{\{\d+\}\})/);
      const inputs: HTMLInputElement[] = [];
      const frag = parts.map((p) => {
        const m = /^\{\{(\d+)\}\}$/.exec(p);
        if (!m) return document.createTextNode(p);
        const idx = Number(m[1]);
        const inp = el('input', {
          class: 'blank-input',
          type: 'text',
          'aria-label': `ចន្លោះទំនេរទី ${idx + 1}`,
          autocomplete: 'off',
          spellcheck: 'false',
          oninput: () => inp.classList.remove('correct', 'incorrect'),
        }) as HTMLInputElement;
        inputs[idx] = inp;
        return inp;
      });
      const template = el('div', { class: 'fill-template', dir: 'ltr' }, ...frag);
      body.append(template);
      checkFn = () => {
        let allOk = true;
        inputs.forEach((inp, i) => {
          const val = inp.value;
          const ok = codeMatches(val, exf.acceptedAnswers[i] ?? []);
          inp.classList.toggle('correct', ok);
          inp.classList.toggle('incorrect', !ok && val.length > 0);
          if (!ok) allOk = false;
        });
        grade(allOk);
      };
      break;
    }

    case 'predict_output': {
      const exp = ex as PredictOutputExercise;
      const codeBlock = el('pre', { dir: 'ltr' }, highlightedCode(exp.code));
      const input = el('textarea', { class: 'text-input', rows: '3', 'aria-label': 'ចម្លើយលទ្ធផលដែលអ្នកទាយ', placeholder: 'វាយលទ្ធផលដែលអ្នកគិតថានឹងបញ្ចេញ…', dir: 'ltr', spellcheck: 'false' }) as HTMLTextAreaElement;
      body.append(codeBlock, el('div', { class: 'output-label' }, 'ចម្លើយរបស់អ្នក៖'), input);
      checkFn = () => {
        if (!input.value.trim()) { showFeedback('hint', 'សូមវាយចម្លើយរបស់អ្នកជាមុនសិន។'); return; }
        grade(outputsMatch(input.value, exp.expectedOutput));
      };
      break;
    }

    case 'arrange': {
      const exa = ex as ArrangeExercise;
      // current order stores indices into ex.lines
      let order = [...exa.shuffledOrder];
      const listEl = el('div', { class: 'arrange-list', role: 'list', 'aria-label': 'បន្ទាត់កូដដែលត្រូវតម្រៀប' });
      function rerender(): void {
        listEl.innerHTML = '';
        order.forEach((lineIdx, pos) => {
          const moveUp = el('button', { 'aria-label': 'បម្លែងឡើងលើ', onclick: () => { if (pos > 0) { [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]]; rerender(); } } }, '↑');
          const moveDown = el('button', { 'aria-label': 'បម្លែងចុះក្រោម', onclick: () => { if (pos < order.length - 1) { [order[pos + 1], order[pos]] = [order[pos], order[pos + 1]]; rerender(); } } }, '↓');
          listEl.append(
            el('div', { class: 'arrange-item', role: 'listitem' }, el('span', { class: 'grip' }, icon('grip', 16)), highlightedCode(exa.lines[lineIdx]), el('span', { class: 'move-btns' }, moveUp, moveDown))
          );
        });
      }
      rerender();
      body.append(listEl);
      checkFn = () => {
        const correct = order.every((lineIdx, pos) => lineIdx === pos);
        if (!correct) {
          // highlight misplaced lines
          [...listEl.children].forEach((child, pos) => {
            child.classList.toggle('correct', order[pos] === pos);
            child.classList.toggle('incorrect', order[pos] !== pos);
          });
        } else {
          [...listEl.children].forEach((child) => child.classList.add('correct'));
        }
        grade(correct);
      };
      break;
    }

    case 'find_error': {
      let selectedLine = -1;
      const lines = ex.code.split('\n');
      const container = el('div', { class: 'error-lines', role: 'radiogroup', 'aria-label': 'ជ្រើសរើសបន្ទាត់ដែលមានកំហុស' });
      const lineEls = lines.map((text, i) => {
        const b = el(
          'button',
          {
            class: 'error-line',
            type: 'button',
            role: 'radio',
            'aria-checked': 'false',
            onclick: () => {
              selectedLine = i + 1;
              lineEls.forEach((lb) => { lb.classList.remove('selected', 'correct', 'wrong'); lb.setAttribute('aria-checked', 'false'); });
              b.classList.add('selected');
              b.setAttribute('aria-checked', 'true');
              playSound('click');
            },
          },
          el('span', { class: 'ln' }, String(i + 1)),
          highlightedCode(text || ' ')
        );
        container.append(b);
        return b;
      });
      body.append(container);
      checkFn = () => {
        if (selectedLine < 0) { showFeedback('hint', 'សូមចុចបន្ទាត់ដែលអ្នកគិតថាមានកំហុសជាមុនសិន។'); return; }
        lineEls.forEach((lb, i) => {
          lb.classList.remove('selected');
          if (i + 1 === ex.errorLine) lb.classList.add('correct');
          else if (i + 1 === selectedLine) lb.classList.add('wrong');
        });
        grade(selectedLine === ex.errorLine);
      };
      break;
    }

    case 'match': {
      const exm = ex as MatchExercise;
      const leftItems = exm.pairs.map((p, i) => ({ text: p.left_km, pairIndex: i }));
      const rightItems = exm.pairs.map((p, i) => ({ text: p.right, pairIndex: i })).sort(() => Math.random() - 0.5);
      let selectedLeft: number | null = null;
      const matched = new Set<number>();
      const leftBtns: HTMLButtonElement[] = [];
      const rightBtns: HTMLButtonElement[] = [];

      leftItems.forEach((item, pos) => {
        const b = el('button', { class: 'match-item', type: 'button', onclick: () => pick('left', pos) }, item.text) as HTMLButtonElement;
        leftBtns.push(b);
      });
      rightItems.forEach((item, pos) => {
        const b = el('button', { class: 'match-item', type: 'button', onclick: () => pick('right', pos) }, highlightedCode(item.text)) as HTMLButtonElement;
        rightBtns.push(b);
      });

      function pick(side: 'left' | 'right', pos: number): void {
        if (side === 'left') {
          if (matched.has(leftItems[pos].pairIndex)) return;
          leftBtns.forEach((b) => b.classList.remove('selected'));
          leftBtns[pos].classList.add('selected');
          selectedLeft = pos;
        } else {
          if (selectedLeft === null) { showFeedback('hint', 'សូមជ្រើសរើសធាតុខាងឆ្វេងមុន។'); return; }
          if (matched.has(rightItems[pos].pairIndex)) return;
          const ok = leftItems[selectedLeft].pairIndex === rightItems[pos].pairIndex;
          if (ok) {
            matched.add(rightItems[pos].pairIndex);
            leftBtns[selectedLeft].classList.remove('selected');
            leftBtns[selectedLeft].classList.add('matched');
            rightBtns[pos].classList.add('matched');
            selectedLeft = null;
            playSound('correct');
            if (matched.size === exm.pairs.length) grade(true);
          } else {
            rightBtns[pos].classList.add('wrong-flash');
            setTimeout(() => rightBtns[pos].classList.remove('wrong-flash'), 600);
            grade(false);
          }
        }
      }

      const grid = el('div', { class: 'match-grid', role: 'group', 'aria-label': 'ផ្គូផ្គងគូ' });
      for (let i = 0; i < Math.max(leftBtns.length, rightBtns.length); i++) {
        if (leftBtns[i]) grid.append(leftBtns[i]);
        if (rightBtns[i]) grid.append(rightBtns[i]);
      }
      body.append(grid);
      checkFn = () => grade(matched.size === exm.pairs.length && matched.size > 0);
      break;
    }

    case 'code_challenge': {
      const exc = ex as CodeChallengeExercise;
      const codeArea = el('textarea', {
        class: 'editor-fallback',
        spellcheck: 'false',
        'aria-label': 'កូដរបស់អ្នក',
        rows: '10',
        dir: 'ltr',
        style: 'min-height:220px',
      }) as HTMLTextAreaElement;
      codeArea.value = exc.starterCode;
      const statusLine = el('div', { class: 'status-line', role: 'status' }, 'រង់ចាំការដំណើរការកូដ…');
      body.append(
        el('p', { class: 'help' }, `លំហាត់នេះដំណើរការកូដរបស់អ្នកតាមសេវាខាងក្រៅ (Wandbox, ${'g++ 13.2'}) ដើម្បីពិនិត្យ test cases។ ត្រូវមានការយល់ព្រមរបស់អ្នកជាមុន។`),
        codeArea,
        statusLine
      );

      checkFn = async () => {
        const consent = getState().settings.executionConsent;
        if (!consent) {
          const granted = await openConsentDialog();
          if (!granted) {
            showFeedback('hint', 'ដោយគ្មានការយល់ព្រម កូដមិនអាចផ្ញើទៅដំណើរការបានទេ។ អ្នកអាចបើកការយល់ព្រមក្នុងការកំណត់ ឬហាត់សរសេរកូដក្នុងទំព័រ "ហាត់សរសេរកូដ" ហើយត្រឡប់មកវិញ។ លំហាត់នេះត្រូវការការដំណើរការពិត ដូច្នេះមិនអាចឆ្លើយដោយការទាយបានទេ។');
            return;
          }
        }
        checkBtn.disabled = true;
        const timer = startStatusTimer(statusLine, 'កំពុង compile និងដំណើរការកូដ…');
        const { results, error } = await runTestCases(codeArea.value, exc.testCases);
        timer.stop();
        checkBtn.disabled = false;
        if (error) {
          statusLine.textContent = error;
          showFeedback('hint', error + ' សូមព្យាយាមម្តងទៀតពេលក្រោយ។ លទ្ធផលមិនត្រូវបានក្លែងឡើយទេ។');
          return;
        }
        const detail = results.map((r) => `Test ${r.index + 1}: ${r.passed ? '✓ ជាប់' : '✗ ធ្លាក់'}${r.passed ? '' : ` — រំពឹង «${normalizeOutput(r.expectedOutput)}» ទទួលបាន «${normalizeOutput(r.actualOutput)}»${r.stderr ? `\nstderr: ${r.stderr.slice(0, 300)}` : ''}`}`).join('\n');
        statusLine.textContent = detail;
        const allPassed = results.length === exc.testCases.length && results.every((r) => r.passed);
        grade(allPassed);
      };
      break;
    }
  }

  async function doCheck(): Promise<void> {
    await checkFn();
  }

  root.append(head, prompt, body, actions);
  return { element: root, isSolved: () => solved };
}
