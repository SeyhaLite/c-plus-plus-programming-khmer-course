import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { getState, updateSettings, replaceState } from '../../services/progress';
import { exportStateJSON, importStateJSON, saveState, resetState } from '../../services/storage';
import { breadcrumbs, showToast, updateStats } from '../../app/layout';
import { openConsentDialog } from '../playground/consent';

// ============================================================
// ការកំណត់ (Settings) — theme, sound, motion, consent, ទិន្នន័យ
// ============================================================

function applySettings(): void {
  const s = getState().settings;
  document.documentElement.setAttribute('data-theme', s.theme);
  document.documentElement.setAttribute('data-motion', s.reducedMotion ? 'reduced' : 'full');
}

export function renderSettings(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'ការកំណត់' }]));
  host.append(el('h1', {}, 'ការកំណត់'));
  const s = getState();

  // --- Appearance & behavior ---
  const themeSwitch = el('input', { class: 'switch', type: 'checkbox', 'aria-label': 'Dark mode', onchange: (e) => {
    updateSettings({ theme: (e.target as HTMLInputElement).checked ? 'dark' : 'light' });
    applySettings();
  } }) as HTMLInputElement;
  themeSwitch.checked = s.settings.theme === 'dark';

  const soundSwitch = el('input', { class: 'switch', type: 'checkbox', 'aria-label': 'សំឡេង', onchange: (e) => {
    updateSettings({ sound: (e.target as HTMLInputElement).checked });
    showToast((e.target as HTMLInputElement).checked ? 'បានបើកសំឡេង — សំឡេងបង្កើតដោយ browser ផ្ទាល់ គ្មានឯកសារ audio' : 'បានបិទសំឡេង');
  } }) as HTMLInputElement;
  soundSwitch.checked = s.settings.sound;

  const motionSwitch = el('input', { class: 'switch', type: 'checkbox', 'aria-label': 'បន្ថយចលនា', onchange: (e) => {
    updateSettings({ reducedMotion: (e.target as HTMLInputElement).checked });
    applySettings();
  } }) as HTMLInputElement;
  motionSwitch.checked = s.settings.reducedMotion;

  host.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.05rem' }, icon('settings', 18), ' រូបរាង និងឥរិយាបថ'),
    el('div', { class: 'switch-row' }, el('div', {}, el('strong', {}, 'Dark mode'), el('div', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem' }, 'ផ្លាស់ប្តូរពណ៌ងងឹត/ភ្លឺ')), themeSwitch),
    el('div', { class: 'switch-row' }, el('div', {}, el('strong', {}, 'សំឡេង feedback'), el('div', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem' }, 'បិទជាលំនាំដើម។ សំឡេងបង្កើតដោយ WebAudio (គ្មានឯកសារ)។ មិនមានសំឡេងក៏នៅមាន feedback ជាអក្សរ/ពណ៌។')), soundSwitch),
    el('div', { class: 'switch-row' }, el('div', {}, el('strong', {}, 'បន្ថយចលនា (reduced motion)'), el('div', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem' }, 'បិទ animation សម្រាប់អ្នកដែលងាយវិលមុខ')), motionSwitch),
  ));

  // --- Execution consent ---
  const consentStatus = el('span', { class: s.settings.executionConsent ? 'tag tag-success' : 'tag tag-warning' },
    s.settings.executionConsent === true ? '✓ បានយល់ព្រម' : s.settings.executionConsent === false ? '✗ បានបដិសេធ' : 'មិនទាន់សម្រេច');
  host.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.05rem' }, icon('code', 18), ' ការដំណើរការកូដ (Wandbox API)'),
    el('p', { style: 'font-size:.9rem' }, 'ដើម្បីដំណើរការកូដ C++ និងពិនិត្យ test cases កូដ+stdin ត្រូវផ្ញើទៅសេវាសាធារណៈ ', el('strong', {}, 'wandbox.org'), ' (g++ 13.2 sandbox)។ គ្មានទិន្នន័យផ្សេងទៀតត្រូវផ្ញើទេ។ ស្ថានភាពបច្ចុប្បន្ន៖ ', consentStatus),
    el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem' },
      el('button', { class: 'btn btn-primary btn-sm', onclick: async () => { await openConsentDialog(); renderSettings(host); } }, icon('check', 16), 'បើកការយល់ព្រម'),
      el('button', { class: 'btn btn-secondary btn-sm', onclick: () => { updateSettings({ executionConsent: false }); renderSettings(host); showToast('បានបិទការដំណើរការកូដខាងក្រៅ'); } }, icon('x', 16), 'បិទ/ដកការយល់ព្រម'),
    )
  ));

  // --- Data: export / import / reset ---
  const fileInput = el('input', { type: 'file', accept: '.json,application/json', class: 'text-input', style: 'max-width:320px', 'aria-label': 'ឯកសារ JSON វឌ្ឍនភាព', onchange: (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('ឯកសារធំពេក (អតិបរមា 5MB)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = importStateJSON(String(reader.result ?? ''));
      if (result.ok) {
        replaceState(result.state);
        applySettings();
        updateStats();
        showToast('បាននាំចូលវឌ្ឍនភាពដោយជោគជ័យ', 'success');
        renderSettings(host);
      } else {
        showToast(result.error_km, 'error');
      }
    };
    reader.onerror = () => showToast('មិនអាចអានឯកសារបានទេ', 'error');
    reader.readAsText(file);
  } }) as HTMLInputElement;

  host.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.05rem' }, icon('save', 18), ' ទិន្នន័យវឌ្ឍនភាព'),
    el('p', { style: 'font-size:.9rem' }, 'វឌ្ឍនភាពទាំងអស់រក្សាទុកក្នុង ', el('code', {}, 'localStorage'), ' របស់ browser អ្នក — មិនមាន server ទេ។ បើអ្នកសម្អាត browser data ឬប្តូរឧបករណ៍ វាអាចបាត់។ ចាំ export ទុកជាប្រចាំ!'),
    el('ul', { class: 'kv-list', style: 'margin-bottom:1rem' },
      el('li', {}, el('span', {}, 'មេរៀនបានបញ្ចប់'), el('span', {}, String(Object.keys(s.completedLessons).length))),
      el('li', {}, el('span', {}, 'Snippets'), el('span', {}, String(s.snippets.length))),
      el('li', {}, el('span', {}, 'XP'), el('span', {}, String(s.xp))),
    ),
    el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap' },
      el('button', { class: 'btn btn-primary', onclick: () => {
          const blob = new Blob([exportStateJSON(getState())], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `khmer-cpp-academy-progress-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('បានទាញយកឯកសារវឌ្ឍនភាព', 'success');
        } }, icon('download', 18), 'នាំចេញ (Export JSON)'),
      el('label', { class: 'btn btn-secondary', style: 'cursor:pointer' }, icon('upload', 18), 'នាំចូល (Import JSON)'),
      el('button', { class: 'btn btn-danger', onclick: () => {
          if (window.confirm('លុបវឌ្ឍនភាពទាំងអស់? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ គួរ export ទុកជាមុន។')) {
            if (window.confirm('តើអ្នកប្រាកដទេ? មេរៀនដែលបញ្ចប់ XP snippets និងការកំណត់ទាំងអស់នឹងត្រូវលុប។')) {
              const fresh = resetState();
              replaceState(fresh);
              applySettings();
              updateStats();
              showToast('បានលុបវឌ្ឍនភាពទាំងអស់', 'info');
              renderSettings(host);
            }
          }
        } }, icon('trash', 18), 'លុបវឌ្ឍនភាព'),
    ),
    el('div', { class: 'sr-only' }, 'ជ្រើសរើសឯកសារ JSON ដើម្បីនាំចូល'),
    el('div', { style: 'margin-top:.75rem' }, fileInput),
  ));

  // --- Storage availability notice ---
  try {
    const probe = '__kca_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
  } catch {
    host.append(el('div', { class: 'consent-box', role: 'alert' }, '⚠ localStorage មិនអាចប្រើបានក្នុង browser នេះទេ (private mode ឬបិទ cookies) — វឌ្ឍនភាពនឹងមិនត្រូវបានរក្សាទុកទេ។'));
  }

  applySettings();
}

export { applySettings };
export { saveState };
