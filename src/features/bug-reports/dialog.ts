import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { buildDiagnosticReport, copyText, browserInfo, type DiagnosticInput } from '../../services/diagnostics';
import { currentRoute } from '../../app/router';
import { showToast } from '../../app/layout';

// ============================================================
// Bug report dialog — របាយការណ៍ដែលអាច copy ទៅ GitHub Issue
// មិនបង្កើត source path/line ក្លែង; redact សម្ងាត់; គ្មាន IP។
// ============================================================

const categories = [
  'កំហុស compile / execution',
  'បញ្ហា UI / ប្លង់ (layout)',
  'បញ្ហាអក្សរខ្មែរ (typography)',
  'មាតិកាមេរៀនមិនត្រឹមត្រូវ',
  'វឌ្ឍនភាពបាត់ / ការរក្សាទុក',
  'បញ្ហាផ្សេងទៀត',
];

/** Extract lesson/level/unit metadata from the current route, without inventing values. */
function routeContext(): { levelId: number | null; lessonId: string | null; unitId: string | null } {
  const path = currentRoute();
  const m = /^\/levels\/(\d+)(?:\/lessons\/([\w-]+))?/.exec(path);
  return {
    levelId: m ? Number(m[1]) : null,
    lessonId: m?.[2] ?? null,
    unitId: null, // unit is not part of the URL; marked N/A rather than invented
  };
}

export function openBugReportDialog(prefill?: Partial<DiagnosticInput>): void {
  const ctx = routeContext();
  const dialog = document.createElement('dialog');
  dialog.className = 'bug-dialog';
  dialog.setAttribute('aria-label', 'រាយការណ៍បញ្ហា');

  const categorySelect = el('select', { class: 'text-input', 'aria-label': 'ប្រភេទបញ្ហា' }, ...categories.map((c) => el('option', {}, c))) as HTMLSelectElement;
  const componentInput = el('input', { class: 'text-input', type: 'text', placeholder: 'ឧ. CodeEditor, LessonView, Navigation (បើដឹង)', 'aria-label': 'Component' }) as HTMLInputElement;
  const expectedInput = el('textarea', { class: 'text-input', rows: '2', placeholder: 'អ្វីដែលអ្នករំពឹងទុក?', 'aria-label': 'Expected' }) as HTMLTextAreaElement;
  const actualInput = el('textarea', { class: 'text-input', rows: '2', placeholder: 'អ្វីដែលកើតឡើងជាក់ស្តែង?', 'aria-label': 'Actual' }) as HTMLTextAreaElement;
  const stepsInput = el('textarea', { class: 'text-input', rows: '3', placeholder: '1. …\n2. …\n3. …', 'aria-label': 'Steps' }) as HTMLTextAreaElement;

  if (prefill) {
    if (prefill.category && categories.includes(prefill.category)) categorySelect.value = prefill.category;
    if (prefill.component) componentInput.value = prefill.component;
    if (prefill.expected) expectedInput.value = prefill.expected;
    if (prefill.actual) actualInput.value = prefill.actual;
    if (prefill.steps) stepsInput.value = prefill.steps;
  }

  const preview = el('div', { class: 'report-preview', 'aria-label': 'របាយការណ៍ជាមុន' });

  function build(): string {
    return buildDiagnosticReport({
      route: currentRoute(),
      pageTitle: document.title,
      levelId: ctx.levelId,
      unitId: ctx.unitId,
      lessonId: ctx.lessonId,
      component: componentInput.value.trim() || undefined,
      category: categorySelect.value,
      expected: expectedInput.value.trim() || undefined,
      actual: actualInput.value.trim() || undefined,
      steps: stepsInput.value.trim() || undefined,
      userAgent: browserInfo().ua,
    });
  }

  function refreshPreview(): void {
    preview.textContent = build();
  }
  [categorySelect, componentInput, expectedInput, actualInput, stepsInput].forEach((input) =>
    input.addEventListener('input', refreshPreview)
  );
  categorySelect.addEventListener('change', refreshPreview);
  refreshPreview();

  const copyBtn = el('button', { class: 'btn btn-primary', onclick: async () => {
      const ok = await copyText(preview.textContent ?? '');
      if (ok) showToast('បានចម្លងរបាយការណ៍ — សូម paste ក្នុង GitHub Issue', 'success');
      else showToast('មិនអាចចម្លងបានទេ — សូមជ្រើសរើសអក្សរដោយដៃ', 'error');
    } }, icon('copy', 18), 'ចម្លងរបាយការណ៍');
  const issueBtn = el('a', { class: 'btn btn-secondary', href: 'https://github.com/SeyhaLite/c-plus-plus-programming-khmer-course/issues/new?template=bug_report.yml', target: '_blank', rel: 'noopener' }, 'បើក GitHub Issue');
  const closeBtn = el('button', { class: 'btn btn-ghost', onclick: () => dialog.remove() }, 'បិទ');

  dialog.append(
    el('div', { style: 'max-width:640px;width:min(92vw,640px)' },
      el('h2', { style: 'font-size:1.2rem' }, icon('bug', 22), ' រាយការណ៍បញ្ហា'),
      el('p', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem' },
        'របាយការណ៍នេះត្រូវបានបង្កើតក្នុង browser របស់អ្នក — គ្មានការផ្ញើស្វ័យប្រវត្តិ គ្មាន IP ឬទិន្នន័យផ្ទាល់ខ្លួន។ ព័ត៌មានដែលអាចជាសម្ងាត់ត្រូវបាន redact។ បើចាំបាច់ សូមកែមុនចម្លង។'),
      el('div', { class: 'field' }, el('label', { for: 'bug-cat' }, 'ប្រភេទបញ្ហា'), categorySelect),
      el('div', { class: 'field' }, el('label', { for: 'bug-comp' }, 'Component (បើដឹង)'), componentInput),
      el('div', { class: 'field' }, el('label', { for: 'bug-exp' }, 'អ្វីដែលរំពឹងទុក'), expectedInput),
      el('div', { class: 'field' }, el('label', { for: 'bug-act' }, 'អ្វីដែលកើតឡើង'), actualInput),
      el('div', { class: 'field' }, el('label', { for: 'bug-steps' }, 'ជំហានធ្វើឡើងវិញ'), stepsInput),
      el('p', { style: 'font-weight:700;font-size:.9rem' }, 'របាយការណ៍ជាមុន (អាចកែបានមុនចម្លង — កែត្រង់អក្សរខាងក្រោម):'),
      preview,
      el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem' }, copyBtn, issueBtn, closeBtn)
    )
  );
  categorySelect.id = 'bug-cat'; componentInput.id = 'bug-comp'; expectedInput.id = 'bug-exp'; actualInput.id = 'bug-act'; stepsInput.id = 'bug-steps';

  // The preview is generated text; make it editable before copying.
  preview.setAttribute('contenteditable', 'true');
  preview.addEventListener('input', () => { /* user edits are kept as-is for copy */ });

  document.body.appendChild(dialog);
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  dialog.addEventListener('cancel', () => dialog.remove());
}
