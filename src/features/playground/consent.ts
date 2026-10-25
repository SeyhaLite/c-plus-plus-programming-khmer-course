import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { updateSettings } from '../../services/progress';

// ============================================================
// Execution consent dialog — ការយល់ព្រមមុនផ្ញើកូដទៅសេវាខាងក្រៅ
// ============================================================

export function openConsentDialog(): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'consent-dialog';

    const accept = el('button', { class: 'btn btn-primary' }, icon('check', 18), 'ខ្ញុំយល់ព្រម — ដំណើរការកូដ');
    const decline = el('button', { class: 'btn btn-secondary' }, icon('x', 18), 'ទេ — កុំផ្ញើកូដ');

    dialog.append(
      el('div', { class: 'consent-box', style: 'max-width:560px' },
        el('h2', { style: 'font-size:1.2rem' }, 'ការយល់ព្រមដំណើរការកូដ'),
        el('p', {}, 'ដើម្បីដំណើរការកូដ C++ និងពិនិត្យ test cases កូដរបស់អ្នកនឹងត្រូវផ្ញើទៅសេវា ', el('strong', {}, 'Wandbox (wandbox.org)'), ' ដែលជា sandbox សាធារណៈឥតគិតថ្លៃ (g++ 13.2, C++17)។'),
        el('ul', {},
          el('li', {}, 'អ្វីដែលផ្ញើ៖ កូដដែលអ្នកវាយ និង input (stdin) ប៉ុណ្ណោះ'),
          el('li', {}, 'អ្វីដែលមិនផ្ញើ៖ វឌ្ឍនភាព ការកំណត់ ឬទិន្នន័យផ្ទាល់ខ្លួនផ្សេងទៀត'),
          el('li', {}, 'គេហទំព័រនេះមិនមាន API key ឬការតាមដានអ្នកប្រើទេ'),
          el('li', {}, 'អ្នកអាចដកការយល់ព្រមបានគ្រប់ពេលក្នុង ការកំណត់'),
        ),
        el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, 'សូមកុំដាក់ពាក្យសម្ងាត់ ឬទិន្នន័យសម្ងាត់ក្នុងកូដដែលអ្នកដំណើរការ។ អានបន្ថែមក្នុង docs/SECURITY.md របស់ repo។'),
        el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem' }, accept, decline)
      )
    );

    document.body.appendChild(dialog);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');

    function close(result: boolean): void {
      if (result) updateSettings({ executionConsent: true });
      dialog.remove();
      resolve(result);
    }
    accept.addEventListener('click', () => close(true));
    decline.addEventListener('click', () => close(false));
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(false); });
  });
}
