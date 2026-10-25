import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { breadcrumbs } from '../../app/layout';
import { basePath } from '../../app/router';
import { openBugReportDialog } from '../bug-reports/dialog';
import { APP_VERSION } from '../../data/curriculum';

// ============================================================
// ជំនួយ និងរាយការណ៍បញ្ហា (Help)
// ============================================================

export function renderHelp(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'ជំនួយ' }]));
  host.append(el('h1', {}, 'ជំនួយ និងរាយការណ៍បញ្ហា'));

  host.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.05rem' }, icon('bug', 18), ' រាយការណ៍បញ្ហា'),
    el('p', {}, 'ជួបបញ្ហា (មេរៀនមិនដំណើរការ អក្សរខ្មែរខូច កូដមិន compile…)? ប៊ូតុងរាយការណ៍បញ្ហាមាននៅគ្រប់ទំព័រ។ វាបង្កើតរបាយការណ៍ដែលអ្នកអាច copy ទៅដាក់ក្នុង GitHub Issue។'),
    el('ul', { style: 'font-size:.9rem' },
      el('li', {}, 'របាយការណ៍បង្កើតក្នុង browser របស់អ្នក — ', el('strong', {}, 'គ្មានការផ្ញើស្វ័យប្រវត្តិ'), ' គ្មាន IP គ្មានទិន្នន័យផ្ទាល់ខ្លួន'),
      el('li', {}, 'Source path/line មានតែពេលមាន stack trace ពិតប៉ុណ្ណោះ — ក្រៅពីនោះសរសេរ "Not available in production" ដោយស្មោះត្រង់'),
      el('li', {}, 'តម្លៃដែលដូចជា token/សម្ងាត់ត្រូវបាន redact ស្វ័យប្រវត្តិ'),
      el('li', {}, 'អ្នកអាចកែរបាយការណ៍មុនចម្លង'),
    ),
    el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem' },
      el('button', { class: 'btn btn-primary', onclick: () => openBugReportDialog() }, icon('bug', 18), 'បើកទម្រង់រាយការណ៍'),
      el('a', { class: 'btn btn-secondary', href: 'https://github.com/SeyhaLite/c-plus-plus-programming-khmer-course/issues', target: '_blank', rel: 'noopener' }, 'មើល Issues លើ GitHub'),
    )
  ));

  host.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.05rem' }, icon('help', 18), ' សំណួរញឹកញាប់'),
    el('details', { style: 'margin-bottom:.5rem' }, el('summary', { style: 'font-weight:700;cursor:pointer' }, 'តើវឌ្ឍនភាពរបស់ខ្ញុំរក្សាទុកនៅឯណា?'),
      el('p', { style: 'font-size:.9rem' }, 'ក្នុង localStorage របស់ browser អ្នកផ្ទាល់។ វាមិន sync ទៅឧបករណ៍ផ្សេងទេ — ប្រើ Export/Import JSON ក្នុង ', el('a', { href: `${basePath()}/settings` }, 'ការកំណត់'), ' ដើម្បីផ្លាស់ប្តូរ។')),
    el('details', { style: 'margin-bottom:.5rem' }, el('summary', { style: 'font-weight:700;cursor:pointer' }, 'ហេតុអ្វីដំណើរការកូដមិនបាន?'),
      el('p', { style: 'font-size:.9rem' }, 'ការដំណើរការកូដប្រើសេវាខាងក្រៅ (wandbox.org) ហើយត្រូវការ៖ (១) ការយល់ព្រមរបស់អ្នក (២) អ៊ីនធឺណិត។ បើសេវាមិនឆ្លើយតប សារពិតនឹងបង្ហាញ — យើងមិនក្លែងលទ្ធផលទេ។ សូមព្យាយាមម្តងទៀត ឬពិនិត្យការកំណត់។')),
    el('details', { style: 'margin-bottom:.5rem' }, el('summary', { style: 'font-weight:700;cursor:pointer' }, 'អក្សរខ្មែររបស់ខ្ញុំបង្ហាញមិនស្អាត?'),
      el('p', { style: 'font-size:.9rem' }, 'គេហទំព័រប្រើពុម្ពអក្សរ Noto Sans Khmer (self-hosted)។ បើអក្សរនៅខូច សូមរាយការណ៍បញ្ហាជាមួយឈ្មោះ browser និងឈ្មោះទំព័រ។')),
    el('details', {}, el('summary', { style: 'font-weight:700;cursor:pointer' }, 'តើគេហទំព័រនេះថ្លៃទេ? ត្រូវការគណនីទេ?'),
      el('p', { style: 'font-size:.9rem' }, 'ឥតគិតថ្លៃទាំងស្រុង គ្មានការចុះឈ្មោះ គ្មានគណនី គ្មានការតាមដាន។ ដំណើរការលើ GitHub Pages។'))
  ));

  host.append(el('div', { class: 'card' },
    el('h2', { style: 'font-size:1.05rem' }, icon('book', 18), ' ឯកសារគម្រោង'),
    el('p', { style: 'font-size:.9rem' }, 'សម្រាប់ព័ត៌មានបច្ចេកទេសពេញលេញ សូមមើល docs/ ក្នុង repository៖ PROJECT_PLAN, ARCHITECTURE, FEATURES, DECISIONS, TESTING, DEPLOYMENT, SECURITY, CONTENT_GUIDELINES, PROGRESS, KNOWN_LIMITATIONS។'),
    el('p', { style: 'font-size:.85rem;color:var(--c-text-muted)' }, `កំណែកម្មវិធី៖ v${APP_VERSION} · ស្តង់ដារ C++ ដែលប្រើក្នុងឧទាហរណ៍៖ C++17 (g++ 13.2 ក្នុង CI និង execution)`)
  ));
}
