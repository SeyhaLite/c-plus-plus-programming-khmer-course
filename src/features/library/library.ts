import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { breadcrumbs } from '../../app/layout';
import { basePath } from '../../app/router';
import { CPP_STANDARD } from '../../data/curriculum';

// ============================================================
// បណ្ណាល័យ C++ — ឯកសារយោងរហ័ស (quick reference)
// ============================================================

function refTable(title: string, headers: string[], rows: string[][]): HTMLElement {
  return el('div', { class: 'card', style: 'margin-bottom:1rem;overflow-x:auto' },
    el('h2', { style: 'font-size:1.05rem' }, title),
    el('table', { style: 'width:100%;border-collapse:collapse;font-size:.88rem' },
      el('thead', {}, el('tr', {}, ...headers.map((h) => el('th', { style: 'text-align:start;padding:.4rem .6rem;border-bottom:2px solid var(--c-border)' }, h)))),
      el('tbody', {}, ...rows.map((r) => el('tr', {}, ...r.map((c, ci) =>
        el('td', { style: 'padding:.4rem .6rem;border-bottom:1px solid var(--c-border)' }, ci === 0 ? el('code', {}, c) : c))))))
  );
}

export function renderLibrary(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'បណ្ណាល័យ C++' }]));
  host.append(el('h1', {}, 'បណ្ណាល័យ C++'),
    el('p', { class: 'help', style: 'color:var(--c-text-muted);max-width:70ch' }, `ឯកសារយោងរហ័សសម្រាប់ ${CPP_STANDARD} — ពាក្យបច្ចេកទេសជាភាសាអង់គ្លេស ការពន្យល់ជាភាសាខ្មែរ។ សម្រាប់ឯកសារពេញលេញ សូមមើល cppreference.com។`));

  host.append(refTable('ប្រភេទទិន្នន័យមូលដ្ឋាន (Basic types)', ['ប្រភេទ', 'ការពិពណ៌នា', 'ឧទាហរណ៍'], [
    ['int', 'ចំនួនគត់ (ប្រមាណ ±2 ពាន់លាន)', 'int age = 20;'],
    ['double', 'ចំនួនទសភាគ', 'double pi = 3.14159;'],
    ['char', 'អក្សរមួយតួ', "char grade = 'A';"],
    ['bool', 'ពិត/មិនពិត', 'bool ok = true;'],
    ['std::string', 'អក្សរជាខ្សែ (ត្រូវ #include <string>)', 'std::string s = "Hello";'],
  ]));

  host.append(refTable('Operators សំខាន់ៗ', ['Operator', 'ន័យ', 'ឧទាហរណ៍'], [
    ['+ - * /', 'បូក ដក គុណ ចែក (int/int កាត់ទសភាគ)', '7 / 2 → 3'],
    ['%', 'សំណល់ (modulo)', '7 % 2 → 1'],
    ['++ --', 'បន្ថែម/បន្ថយ 1', 'i++;'],
    ['== != < > <= >=', 'ប្រៀបធៀប → bool', 'a == b'],
    ['&& || !', 'និង ឬ មិន (logical)', 'a > 0 && b > 0'],
    ['= += -= *= /=', 'ផ្តល់តម្លៃ / shorthand', 'x += 3'],
    ['<< >>', 'stream out / in (និង bit shift)', 'cout << x; cin >> x;'],
    ['& *', 'address-of / dereference (pointer)', 'int* p = &x;'],
  ]));

  host.append(refTable('std::iostream / std::string ដែលប្រើញឹកញាប់', ['ឈ្មោះ', 'ការពិពណ៌នា'], [
    ['std::cout', 'បញ្ចេញទិន្នន័យទៅអេក្រង់ (standard output)'],
    ['std::cin', 'អានទិន្នន័យពី input (standard input)'],
    ['std::endl', 'ចុះបន្ទាត់ថ្មី'],
    ['std::getline(std::cin, s)', 'អានបន្ទាត់ពេញ (រួមទាំងចន្លោះ) ចូល std::string'],
    ['s.length() / s.size()', 'ប្រវែង string'],
    ['s.substr(pos, len)', 'ផ្នែករងនៃ string'],
    ['s.find("x")', 'ស្វែងរកអក្សរ ត្រឡប់ index ឬ std::string::npos'],
    ['std::stoi(s) / std::to_string(n)', 'បំលែង string ↔ ចំនួន'],
  ]));

  host.append(refTable('ពាក្យបញ្ជា compile (terminal)', ['ពាក្យបញ្ជា', 'ការពិពណ៌នា'], [
    ['g++ -std=c++17 main.cpp -o main', 'compile ជាមួយស្តង់ដារ C++17'],
    ['-Wall -Wextra', 'បើកការព្រមានទាំងអស់ — គួរប្រើជានិច្ច'],
    ['-g', 'បន្ថែម debug info សម្រាប់ gdb'],
    ['./main (ឬ main.exe)', 'ដំណើរការកម្មវិធី'],
    ['echo $? (Linux/macOS)', 'មើល exit code របស់កម្មវិធីចុងក្រោយ'],
  ]));

  host.append(refTable('វចនានុក្រមអង់គ្លេស–ខ្មែរ', ['ពាក្យអង់គ្លេស', 'ន័យខ្មែរ'], [
    ['variable', 'អថេរ'],
    ['constant', 'ថេរ'],
    ['function', 'មុខងារ / អនុគមន៍'],
    ['loop', 'រង្វិលជុំ'],
    ['condition', 'លក្ខខណ្ឌ'],
    ['compiler', 'កម្មវិធីបកប្រែកូដ (compiler)'],
    ['statement', 'សេចក្តីណែនាំ'],
    ['array', 'អារេ'],
    ['pointer', 'ទ្រនិច (pointer)'],
    ['reference', 'យោង (reference)'],
    ['return value', 'តម្លៃត្រឡប់'],
    ['parameter', 'ប៉ារ៉ាម៉ែត្រ'],
    ['bug', 'កំហុសក្នុងកូដ'],
    ['output', 'លទ្ធផលចេញ'],
    ['input', 'ទិន្នន័យចូល'],
  ]));

  host.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.05rem' }, icon('play', 18), ' វីដេអូ និងធនធានបន្ថែម (ខាងក្រៅ)'),
    el('p', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem' },
      'តំណខាងក្រោមនាំទៅកាន់ធនធនឥតគិតថ្លៃនៅគេហទំព័រផសេង (ភាគច្រើនជាភាសាអង់គ្លេស)។ គេហទំព័រនេះមិនទទួលខុសត្រូវលើមាតិកាខាងក្រៅទេ ហើយតំណអាចប្តូរបាន។'),
    el('ul', { style: 'font-size:.9rem' },
      el('li', {}, el('a', { href: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', target: '_blank', rel: 'noopener' }, 'freeCodeCamp — C++ Tutorial for Beginners (Full Course, video)'), ' — វីដេអូពេញមេរៀន (អង់គ្លេស)'),
      el('li', {}, el('a', { href: 'https://www.learncpp.com/', target: '_blank', rel: 'noopener' }, 'LearnCpp.com'), ' — មេរៀនអត្ថបទដ៏លម្អិត (អង់គ្លេស)'),
      el('li', {}, el('a', { href: 'https://en.cppreference.com/', target: '_blank', rel: 'noopener' }, 'cppreference.com'), ' — ឯកសារយោងស្តង់ដារ'),
      el('li', {}, el('a', { href: 'https://www.youtube.com/results?search_query=learn+c%2B%2B+in+khmer', target: '_blank', rel: 'noopener' }, 'ស្វែងរកវីដេអូ C++ ជាភាសាខ្មែរលើ YouTube'), ' — មាតិកាខ្មែរពីសហគមន៍'),
    ),
    el('p', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem;margin-top:.5rem' },
      'ចំណាំ៖ រាល់រូបភាពនៅក្នុងគេហទំព័រនេះ (ដ្យាក្រាម SVG) គឺជារូបភាពដើមដែលបង្កើតឡើងសម្រាប់គម្រោង — គ្មានបញ្ហាអាជ្ញាបណ្ណ និងមិនពឹងផ្អែកលើ server ខាងក្រៅទេ។')
  ));

  host.append(el('div', { class: 'card' },
    el('h2', { style: 'font-size:1.05rem' }, icon('book', 18), ' ធនធានបន្ថែម'),
    el('ul', {},
      el('li', {}, el('a', { href: 'https://en.cppreference.com/', target: '_blank', rel: 'noopener' }, 'cppreference.com'), ' — ឯកសារយោងស្តង់ដារ C++ (អង់គ្លេស)'),
      el('li', {}, el('a', { href: `${basePath()}/playground` }, 'ហាត់សរសេរកូដ'), ' — សាកល្បងកូដភ្លាមៗក្នុង browser'),
    )
  ));
}
