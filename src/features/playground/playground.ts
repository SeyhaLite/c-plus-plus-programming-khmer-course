import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { breadcrumbs, showToast, updateStats } from '../../app/layout';
import { getState, saveSnippet, recordCodeRun } from '../../services/progress';
import { openConsentDialog } from './consent';
import { runCpp, normalizeOutput, COMPILER, LIMITS } from '../../services/code-execution';
import { copyText } from '../../services/diagnostics';
import { allLessons } from '../../data/curriculum';
import type { CodeChallengeExercise } from '../../types';
import { getAchievement } from '../../data/achievements';
import { startStatusTimer, type StatusTimer } from '../../utils/status-timer';
import { playSound } from '../../services/audio';

// ============================================================
// Playground — កន្លែងហាត់សរសេរកូដ C++
// Editor: CodeMirror (lazy-loaded) + textarea fallback
// Execution: Wandbox API ជាមួយ consent ច្បាស់លាស់
// ============================================================

const DEFAULT_CODE = `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`;

interface EditorAdapter {
  getCode(): string;
  setCode(code: string): void;
  setEditable?(editable: boolean): void;
}

async function mountEditor(host: HTMLElement, initial: string): Promise<EditorAdapter> {
  try {
    const [{ basicSetup }, { cpp }, { EditorView }, { EditorState }] = await Promise.all([
      import('codemirror'),
      import('@codemirror/lang-cpp'),
      import('@codemirror/view'),
      import('@codemirror/state'),
    ]);
    const state = EditorState.create({ doc: initial, extensions: [basicSetup, cpp()] });
    const view = new EditorView({ state, parent: host });
    return {
      getCode: () => view.state.doc.toString(),
      setCode: (c) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: c } }),
      setEditable: (b) => {
        view.contentDOM.contentEditable = b ? 'true' : 'false';
        view.dom.style.opacity = b ? '1' : '0.65';
      },
    };
  } catch {
    // Fallback: plain textarea — ដំណើរការបាន គ្មាន syntax highlighting
    const ta = el('textarea', { class: 'editor-fallback', spellcheck: 'false', 'aria-label': 'កូដ C++' }) as HTMLTextAreaElement;
    ta.value = initial;
    host.innerHTML = '';
    host.append(ta);
    return { getCode: () => ta.value, setCode: (c) => { ta.value = c; }, setEditable: (b) => { ta.disabled = !b; } };
  }
}

export async function renderPlayground(host: HTMLElement): Promise<void> {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'ហាត់សរសេរកូដ' }]));
  host.append(
    el('h1', {}, 'ហាត់សរសេរកូដ C++'),
    el('p', { class: 'help', style: 'color:var(--c-text-muted);max-width:70ch' },
      `សរសេរ និងដំណើរការកូដ C++17 (${COMPILER}) ដោយផ្ទាល់ក្នុង browser។ ការដំណើរការកូដត្រូវការការយល់ព្រមរបស់អ្នក ព្រោះកូដត្រូវផ្ញើទៅសេវា sandbox ខាងក្រៅ (Wandbox)។ គ្មាន API key ឬការតាមដានទេ។`
    )
  );

  // Challenge selector — លំហាត់សរសេរកូដពីមេរៀន
  const challenges = allLessons
    .filter((l) => l.status === 'published')
    .flatMap((l) => l.exercises.filter((e): e is CodeChallengeExercise => e.type === 'code_challenge').map((e) => ({ lesson: l, ex: e })));

  const challengeSelect = el('select', { class: 'text-input', style: 'max-width:420px', 'aria-label': 'ជ្រើសរើសបទបញ្ហា' },
    el('option', { value: '' }, '— សរសេរកូដសេរី (free coding) —'),
    ...challenges.map((c, i) => el('option', { value: String(i) }, `${c.lesson.title_km} › ${c.ex.prompt_km.slice(0, 60)}…`))
  ) as HTMLSelectElement;

  const editorHost = el('div', { class: 'editor-host', id: 'editor-host' });
  const stdinInput = el('textarea', { class: 'text-input', rows: '2', placeholder: 'Input (stdin) — មួយលេខ/អក្សរក្នុងមួយបន្ទាត់', 'aria-label': 'Input (stdin)', dir: 'ltr', spellcheck: 'false' }) as HTMLTextAreaElement;

  const stdoutPane = el('div', { class: 'output-pane', 'aria-label': 'លទ្ធផល stdout', dir: 'ltr' }, '(មិនទាន់មានលទ្ធផល)');
  const stderrPane = el('div', { class: 'output-pane stderr', 'aria-label': 'កំហុស stderr', dir: 'ltr', style: 'display:none' });
  const testPane = el('div', { class: 'output-pane', 'aria-label': 'លទ្ធផល test cases', dir: 'ltr', style: 'display:none' });
  const statusLine = el('div', { class: 'status-line', role: 'status' }, `ដំណើរការក្នុង sandbox · កូដអតិបរមា ${LIMITS.maxCodeBytes / 1000}KB · timeout ${LIMITS.timeoutMs / 1000}s`);

  let currentChallenge: (typeof challenges)[number] | null = null;
  let editor: EditorAdapter | null = null;

  const runBtn = el('button', { class: 'btn btn-primary', onclick: () => { void doRun(false); } }, icon('play', 18), 'ដំណើរការ (Run)');
  const testBtn = el('button', { class: 'btn btn-success', style: 'display:none', onclick: () => { void doRun(true); } }, icon('clipboard', 18), 'ពិនិត្យ Test Cases');
  const resetBtn = el('button', { class: 'btn btn-secondary', onclick: () => { editor?.setCode(currentChallenge ? currentChallenge.ex.starterCode : DEFAULT_CODE); stdinInput.value = ''; showToast('បានកំណត់កូដឡើងវិញ'); } }, icon('refresh', 18), 'Reset');
  const copyBtn = el('button', { class: 'btn btn-secondary', onclick: async () => { const ok = await copyText(editor?.getCode() ?? ''); showToast(ok ? 'បានចម្លងកូដ' : 'មិនអាចចម្លងបានទេ', ok ? 'success' : 'error'); } }, icon('copy', 18), 'ចម្លង');
  const saveBtn = el('button', { class: 'btn btn-secondary', onclick: () => {
      const title = window.prompt('ឈ្មោះ snippet៖', `Snippet ${getState().snippets.length + 1}`);
      if (title === null) return;
      saveSnippet(title || 'គ្មានឈ្មោះ', editor?.getCode() ?? '');
      showToast('បានរក្សាទុក snippet ក្នុង browser របស់អ្នក', 'success');
    } }, icon('save', 18), 'រក្សាទុក');
  const clearOutBtn = el('button', { class: 'btn btn-ghost', onclick: () => { stdoutPane.textContent = '(មិនទាន់មានលទ្ធផល)'; stderrPane.style.display = 'none'; testPane.style.display = 'none'; } }, 'សម្អាត Output');
  const solutionBtn = el('button', { class: 'btn btn-ghost', style: 'display:none', onclick: () => {
      if (window.confirm('បង្ហាញចម្លើយ? សូមព្យាយាមដោយខ្លួនឯងជាមុនសិន — ការរៀនពិតកើតឡើងពេលអ្នកគិតដោយខ្លួនឯង។')) {
        if (currentChallenge) editor?.setCode(currentChallenge.ex.solutionCode);
      }
    } }, icon('lightbulb', 18), 'បង្ហាញចម្លើយ');

  const challengeDesc = el('div', { class: 'card', style: 'display:none;margin-bottom:1rem' });

  challengeSelect.addEventListener('change', () => {
    const idx = challengeSelect.value === '' ? -1 : Number(challengeSelect.value);
    currentChallenge = idx >= 0 ? challenges[idx] : null;
    if (currentChallenge) {
      editor?.setCode(currentChallenge.ex.starterCode);
      stdinInput.value = currentChallenge.ex.testCases[0]?.stdin ?? '';
      challengeDesc.style.display = 'block';
      challengeDesc.innerHTML = '';
      challengeDesc.append(
        el('strong', {}, 'បទបញ្ហា៖ '), currentChallenge.ex.prompt_km,
        el('div', { class: 'help', style: 'color:var(--c-text-muted);margin-top:.5rem' }, `Test cases៖ ${currentChallenge.ex.testCases.length} · ប្រើប៊ូតុង "ពិនិត្យ Test Cases" ដើម្បីផ្ទៀងផ្ទាត់`)
      );
      testBtn.style.display = 'inline-flex';
      solutionBtn.style.display = 'inline-flex';
    } else {
      editor?.setCode(DEFAULT_CODE);
      challengeDesc.style.display = 'none';
      testBtn.style.display = 'none';
      solutionBtn.style.display = 'none';
    }
    testPane.style.display = 'none';
  });

  let runTimer: StatusTimer | null = null;
  function setRunning(on: boolean): void {
    for (const b of [runBtn, testBtn, resetBtn, solutionBtn]) b.disabled = on;
    editor?.setEditable?.(!on);
    if (on) {
      runTimer = startStatusTimer(statusLine, 'កំពុង compile និងដំណើរការកូដ…');
      // highly visible loading state: spinner inside the Run button + output pane
      runBtn.replaceChildren(makeSpinner(), document.createTextNode(' កំពុងដំណើរការ…'));
      stdoutPane.replaceChildren(makeSpinner(), document.createTextNode(' កំពុងរង់ចាំលទ្ធផលពី sandbox…'));
      stderrPane.style.display = 'none';
      testPane.style.display = 'none';
    } else {
      runTimer?.stop();
      runTimer = null;
      runBtn.replaceChildren(icon('play', 18), document.createTextNode(' ដំណើរការ (Run)'));
    }
  }

  function makeSpinner(): HTMLElement {
    const sp = el('span', { class: 'spinner', 'aria-hidden': 'true' });
    return sp;
  }

  async function doRun(runTests: boolean): Promise<void> {
    if (!editor) return;
    let consent = getState().settings.executionConsent;
    if (!consent) {
      consent = await openConsentDialog();
      if (!consent) {
        statusLine.textContent = 'មិនមានការយល់ព្រម — កូដមិនត្រូវបានផ្ញើទេ។ អ្នកអាចបើកវាក្នុងការកំណត់។';
        return;
      }
    }
    setRunning(true);
    try {
      if (runTests && currentChallenge) {
        const results: string[] = [];
        let allPassed = true;
        for (let i = 0; i < currentChallenge.ex.testCases.length; i++) {
          const tc = currentChallenge.ex.testCases[i];
          runTimer?.stop();
        runTimer = startStatusTimer(statusLine, `កំពុងដំណើរការ test ${i + 1}/${currentChallenge.ex.testCases.length}…`);
          const res = await runCpp({ code: editor.getCode(), stdin: tc.stdin });
          if (res.stage === 'network' || res.stage === 'limits') {
            results.push(`⚠ Test ${i + 1}: មិនអាចដំណើរការបាន — ${res.message_km}`);
            allPassed = false;
            if (res.stderr) results.push(res.stderr);
            break;
          }
          const passed = res.ok && normalizeOutput(res.stdout) === normalizeOutput(tc.expectedOutput);
          if (!passed) allPassed = false;
          results.push(`${passed ? '✓' : '✗'} Test ${i + 1} (stdin: ${JSON.stringify(tc.stdin)}): ${passed ? 'ជាប់' : 'ធ្លាក់'}`);
          if (!passed) {
            results.push(`  រំពឹង: ${JSON.stringify(normalizeOutput(tc.expectedOutput))}`);
            results.push(`  ទទួលបាន: ${JSON.stringify(normalizeOutput(res.stdout))}`);
            if (res.stderr) results.push(`  stderr: ${res.stderr.split('\n').slice(0, 8).join('\n  ')}`);
          }
        }
        testPane.style.display = 'block';
        testPane.textContent = results.join('\n');
        statusLine.textContent = allPassed ? '✓ Test cases ទាំងអស់ជាប់! អ្នកអាចត្រឡប់ទៅមេរៀនដើម្បីទទួលការទទួលស្គាល់។' : '✗ Test មិនទាន់ជាប់ — សូមកែកូដ ហើយសាកល្បងម្តងទៀត។';
        if (allPassed) playSound('complete');
      } else {
        const res = await runCpp({ code: editor.getCode(), stdin: stdinInput.value });
        stdoutPane.textContent = res.stdout || '(គ្មាន stdout)';
        if (res.stderr) {
          stderrPane.style.display = 'block';
          stderrPane.textContent = res.stderr;
        } else {
          stderrPane.style.display = 'none';
        }
        statusLine.textContent = `${res.message_km} · exit code: ${res.exitCode ?? '—'} · ${res.durationMs}ms`;
        if (res.ok) {
          const unlocked = recordCodeRun();
          updateStats();
          if (unlocked.length) {
            const a = getAchievement(unlocked[0]);
            if (a) showToast(`សមិទ្ធផលថ្មី៖ ${a.title_km}!`, 'success');
            playSound('achievement');
          }
        }
      }
    } finally {
      setRunning(false);
    }
  }

  const editorPanel = el('div', { class: 'panel' },
    el('div', { class: 'panel-head' },
      el('h2', {}, 'កូដ (main.cpp)'),
      el('span', { class: 'tag tag-muted mono', style: 'margin-inline-start:auto' }, COMPILER),
    ),
    el('div', { class: 'panel-body' }, editorHost),
    el('div', { class: 'panel-head', style: 'border-top:1px solid var(--c-border);border-bottom:none' },
      el('label', { for: 'stdin-box', style: 'font-size:.85rem;font-weight:700' }, 'Input (stdin):'),
    ),
    el('div', { style: 'padding:.5rem' }, stdinInput),
  );
  stdinInput.id = 'stdin-box';

  const outputPanel = el('div', { class: 'panel' },
    el('div', { class: 'panel-head' }, el('h2', {}, 'លទ្ធផល'), el('span', { class: 'tag tag-muted', style: 'margin-inline-start:auto' }, 'stdout / stderr / tests')),
    el('div', { class: 'panel-body' }, stdoutPane, stderrPane, testPane),
    statusLine,
  );

  host.append(
    el('div', { style: 'margin-bottom:1rem' }, challengeSelect),
    challengeDesc,
    el('div', { class: 'playground-layout' },
      el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap' }, runBtn, testBtn, resetBtn, copyBtn, saveBtn, clearOutBtn, solutionBtn),
      el('div', { class: 'playground-panels' }, editorPanel, outputPanel)
    )
  );

  editor = await mountEditor(editorHost, DEFAULT_CODE);
}
