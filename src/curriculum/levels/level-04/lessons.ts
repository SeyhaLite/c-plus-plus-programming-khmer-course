import type { Lesson } from '../../../types';

// ============================================================
// កម្រិត ៤ — រង្វិលជុំ (Level 4 — Loops)
// ============================================================

export const level04Lessons: Lesson[] = [
  {
    id: 'l4-for',
    level_id: 4,
    unit_id: 1,
    title_km: 'រង្វិល for',
    title_en: 'for loop',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 18,
    prerequisites: ['l3-logic-mistakes'],
    objectives_km: [
      'សរសេររង្វិល for ដោយផ្នែកទាំង ៣ (init, condition, update)',
      'រាប់ចំនួនដងដែលរង្វិលដំណើរការបានត្រឹមត្រូវ',
      'ប្រើរង្វិលសម្រាប់ការបូកសរុប និងការបញ្ចេញជាស្វ័យប្រវត្តិ',
    ],
    explanation_km: `**រង្វិល (loop)** ធ្វើឲ្យកូដមួយក្រុមដំណើរការម្តងហើយម្តងទៀត។ **for** គឺជារង្វិលដែលច្បាស់បំផុតពេលយើងដឹងចំនួនដង៖

ផ្នែកទាំង ៣ នៃ for៖
- **init** — បង្កើតអថេររាប់ (ឧ. \`int i = 1\`) ធ្វើម្តងគត់
- **condition** — ពិនិត្យមុនរាល់ដង; បើ false រង្វិលឈប់
- **update** — ធ្វើបន្ទាប់ពីរាល់ដង (ឧ. \`++i\`)

លំដាប់ដំណើរការ៖ init → condition → body → update → condition → body → … រហូតដល់ condition មិនពិត។

ចំណាំ៖ \`for (int i = 0; i < n; ++i)\` ដំណើរការ n ដងគត់ (i = 0 … n-1) — នេះជាទម្រង់ដែលអ្នកនឹងឃើញញឹកបំផុត។`,
    examples: [
      {
        title_km: 'បូកសរុបលេខ ១ ដល់ ៥',
        code: `#include <iostream>

int main() {
    int sum = 0;
    for (int i = 1; i <= 5; ++i) {
        sum += i;
    }
    std::cout << sum << std::endl;
    return 0;
}`,
        expectedOutput: '15\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'ការតាមដាន (trace) រង្វិល',
        columns: ['i', 'sum បន្ទាប់ពីដងនោះ'],
        rows: [
          ['1', '1'],
          ['2', '3'],
          ['3', '6'],
          ['4', '10'],
          ['5', '15'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `for (int i = 1; i <= 5; ++i) { ... }   // ចង់បាន 4 ដង ប៉ុន្តែបាន 5 ដង`,
      rightCode: `for (int i = 1; i < 5; ++i) { ... }    // 4 ដង (i = 1..4)`,
      note_km:
        'កំហុសព្រំដែន (off-by-one)៖ <= រាប់បញ្ចូលតម្លៃចុង ឯ < មិនរាប់ទេ។ ត្រូវសួរខ្លួនឯងជានិច្ចថា "តើចង់បានដងប៉ុន្មាន?"',
    },
    exercises: [
      {
        id: 'l4-for-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    for (int i = 0; i < 4; ++i) {
        std::cout << i << std::endl;
    }
    return 0;
}`,
        expectedOutput: '0\n1\n2\n3\n',
        hints_km: ['i ចាប់ផ្តើមពី 0 ហើយឈប់ពេល i == 4។', 'រង្វិលដំណើរការ 4 ដង: i = 0, 1, 2, 3។'],
        explanation_km: 'លក្ខខណ្ឌ i < 4 ពិតសម្រាប់ i = 0..3 ដូច្នេះបញ្ចេញ 4 បន្ទាត់។',
      },
      {
        id: 'l4-for-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ for (int i = 0; i < 3; ++i) ដំណើរការប៉ុន្មានដង?',
        options_km: ['3 ដង', '4 ដង', '2 ដង', 'មិនអាចដឹងទេ'],
        answerIndex: 0,
        hints_km: ['រាប់តម្លៃ i ដែលធ្វើឲ្យលក្ខខណ្ឌពិត 0, 1, 2។'],
        explanation_km: 'i យកតម្លៃ 0, 1, 2 → 3 ដង។ ពេល i = 3 លក្ខខណ្ឌមិនពិត រង្វិលឈប់។',
      },
      {
        id: 'l4-for-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញផ្នែក update ដើម្បីឲ្យរង្វិលរាប់ឡើងម្តងមួយៗ៖',
        template: `for (int i = 0; i < 10; {{0}}) {
    std::cout << i << " ";
}`,
        acceptedAnswers: [['++i', 'i++', 'i += 1', 'i+=1', 'i = i + 1', 'i=i+1']],
        hints_km: ['ផ្នែកទី ៣ បន្ថែម 1 ទៅ i បន្ទាប់ពីរាល់ដង។'],
        explanation_km: '++i (ឬ i++) បន្ថែម 1 ក្នុងមួយដង — បើភ្លេចវា រង្វិលនឹងមិនឈប់ទេ។',
      },
      {
        id: 'l4-for-ex4',
        type: 'code_challenge',
        prompt_km: 'សរសេរកម្មវិធីអាន n រួចបញ្ចេញផលបូក 1 + 2 + … + n។ បើ n = 0 បញ្ចេញ 0។',
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    // សរសេររង្វិល for នៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; ++i) {
        sum += i;
    }
    std::cout << sum << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '5\n', expectedOutput: '15\n' },
          { stdin: '1\n', expectedOutput: '1\n' },
          { stdin: '0\n', expectedOutput: '0\n' },
        ],
        hints_km: ['បង្កើតអថេរ sum = 0 មុនរង្វិល។', 'រង្វិលពី i = 1 ដល់ i <= n ហើយបន្ថែម i ទៅ sum។', 'បើ n = 0 រង្វិលមិនដំណើរការទេ — sum នៅតែ 0 ត្រឹមត្រូវ។'],
        explanation_km:
          'រង្វិល for បូកតម្លៃ i នីមួយៗចូល sum។ ករណី n = 0 ដំណើរការត្រឹមត្រូវដោយស្វ័យប្រវត្តិ ព្រោះលក្ខខណ្ឌមិនពិតតាំងពីដំបូង។',
      },
    ],
    summary_km:
      'for មានផ្នែក ៣៖ init, condition, update។ ទម្រង់ i = 0; i < n; ++i ដំណើរការ n ដង។ ការតាមដាន (trace) តម្លៃអថេរក្នុងរាល់ដង ជួយឲយយល់ និងរកកំហុសបាន។',
    next: 'l4-while',
  },
  {
    id: 'l4-while',
    level_id: 4,
    unit_id: 1,
    title_km: 'រង្វិល while',
    title_en: 'while loop',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l4-for'],
    objectives_km: [
      'ប្រើ while ពេលចំនួនដងមិនដឹងជាមុន',
      'ធានាថាលក្ខខណ្ឌនឹងក្លាយជា false (ជៀសវាង infinite loop)',
    ],
    explanation_km: `**while** ពិនិត្យលក្ខខណ្ឌ **មុន** រាល់ដង ហើយដំណើរការ body តែពេលលក្ខខណ្ឌពិត៖

វាសមបំផុតពេលយើង **មិនដឹងជាមុន** ថារង្វិលត្រូវដំណើរការប៉ុន្មានដង — ឧ. អានទិន្នន័យរហូតដល់ចប់ ឬរង្វិលរហូតដល់លក្ខខណ្ឌមួយកើតឡើង។

ចំណាំសុវត្ថិភាព៖ ត្រូវធានាថាមានអ្វីមួយក្នុង body ធ្វើឲ្យលក្ខខណ្ឌខិតទៅរក false (ឧ. បន្ថយ n) — បើទេ រង្វិលនឹងដំណើរការមិនឈប់ (infinite loop)។`,
    examples: [
      {
        title_km: 'រាប់ថយក្រោយ',
        code: `#include <iostream>

int main() {
    int n = 3;
    while (n > 0) {
        std::cout << n << std::endl;
        --n;
    }
    std::cout << "Go!" << std::endl;
    return 0;
}`,
        expectedOutput: '3\n2\n1\nGo!\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'តារាងតាមដាន while',
        columns: ['ដងទី', 'n មុនពិនិត្យ', 'n > 0?', 'បញ្ចេញ'],
        rows: [
          ['1', '3', 'true', '3'],
          ['2', '2', 'true', '2'],
          ['3', '1', 'true', '1'],
          ['4', '0', 'false', '(ឈប់)'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `int n = 3;
while (n > 0) {
    std::cout << n << std::endl;   // ភ្លេច --n → infinite loop!
}`,
      rightCode: `int n = 3;
while (n > 0) {
    std::cout << n << std::endl;
    --n;   // ធ្វើឲ្យលក្ខខណ្ឌខិតទៅរក false
}`,
      note_km:
        'រាល់ while ត្រូវមាន "ជំហានខិតជិត" ក្នុង body។ បើទេ លក្ខខណ្ឌនៅពិតជារៀងរហូត ហើយកម្មវិធីជាប់គាំង។',
    },
    exercises: [
      {
        id: 'l4-while-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    int x = 0;
    while (x < 10) {
        x += 4;
    }
    std::cout << x << std::endl;
    return 0;
}`,
        expectedOutput: '12\n',
        hints_km: ['តាមដាន x៖ 0 → 4 → 8 → 12។', 'រង្វិលឈប់ពេល x >= 10 — តើ x ចុងក្រោយជាអ្វី?'],
        explanation_km: 'x ឆ្លងកាត់ 4, 8 ហើយទៅ 12; ពេលនោះ x < 10 មិនពិតទៀត រង្វិលឈប់ ហើយបញ្ចេញ 12។',
      },
      {
        id: 'l4-while-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើស្ថានភាពណាសមនឹង while ជាង for?',
        options_km: [
          'អានលេខពីអ្នកប្រើរហូតដល់គេវាយ 0',
          'បញ្ចេញលេខ 1 ដល់ 100',
          'ដំណើរការកូដ 3 ដងគត់',
          'បូកតម្លៃក្នុង array ដែលស្គាល់ទំហំ',
        ],
        answerIndex: 0,
        hints_km: ['while ល្អពេលចំនួនដងអាស្រ័យលើទិន្នន័យ មិនមែនលើតួរាប់ទេ។'],
        explanation_km: 'ពេលចំនួនដងមិនដឹងជាមុន (អាស្រ័យលើអ្វីដែលអ្នកប្រើវាយ) while គឺជាជម្រើសធម្មជាតិ។',
      },
      {
        id: 'l4-while-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញពាក្យគន្លឹះខ្វះដើម្បីបង្កើតរង្វិល៖',
        template: `{{0}} (n > 0) {
    std::cout << n << std::endl;
    --n;
}`,
        acceptedAnswers: [['while']],
        hints_km: ['ពាក្យគន្លឹះ ៥ អក្សរដែលមានន័យថា "ខណៈពេលដែល"។'],
        explanation_km: 'while (លក្ខខណ្ឌ) ដំណើរការ body ម្តងទៀតរាល់ពេលលក្ខខណ្ឌពិត។',
      },
      {
        id: 'l4-while-ex4',
        type: 'code_challenge',
        prompt_km: 'សរសេរកម្មវិធីអាន n (វិជ្ជមាន) រួចបញ្ចេញចំនួនខ្ទង់របស់វា។ ឧ. 123 → 3។',
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    // ប្រើ while ចែក n នឹង 10 ម្តងមួយខ្ទង់

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int digits = 0;
    while (n > 0) {
        n /= 10;
        ++digits;
    }
    std::cout << digits << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '123\n', expectedOutput: '3\n' },
          { stdin: '9999\n', expectedOutput: '4\n' },
          { stdin: '7\n', expectedOutput: '1\n' },
        ],
        hints_km: ['រាល់ដង ចែក n នឹង 10 (n /= 10) ដកយកមួយខ្ទង់ចេញ។', 'រាប់ដងដែលចែក ក្នុងអថេរ digits។'],
        explanation_km:
          'while (n > 0) ដំណើរការម្តងក្នុងមួយខ្ទង់ ព្រោះការចែកគត់នឹង 10 កាត់ខ្ទង់ចុងក្រោយចោល។',
      },
    ],
    summary_km:
      'while ពិនិត្យលក្ខខណ្ឌមុនរាល់ដង — សមពេលចំនួនដងមិនដឹងជាមុន។ ត្រូវធានាថា body ធ្វើឲ្យលក្ខខណ្ឌខិតទៅរក false ជានិច្ច។',
    next: 'l4-do-while',
  },
  {
    id: 'l4-do-while',
    level_id: 4,
    unit_id: 1,
    title_km: 'do-while',
    title_en: 'do-while loop',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 12,
    prerequisites: ['l4-while'],
    objectives_km: [
      'ប្រើ do-while ពេល body ត្រូវដំណើរការយ៉ាងតិចមួយដង',
      'ស្គាល់ភាពខុសគ្នារវាង while និង do-while',
    ],
    explanation_km: `**do-while** ដូច while ប៉ុន្តែពិនិត្យលក្ខខណ្ឌ **បន្ទាប់ពី** body — ដូច្នេះ body ដំណើរការ **យ៉ាងតិចមួយដង** ជានិច្ច។

ទម្រង់៖
- do { … } while (លក្ខខណ្ឌ);
- ចំណាំសញ្ញា ; នៅចុង while — វាចាំបាច់!

ករណីប្រើធម្មតា៖ ការទទួលយក និងពិនិត្យទិន្នន័យ (validation) — សួរអ្នកប្រើម្តង រួចសួរម្តងទៀតរហូតដល់ទិន្នន័យត្រឹមត្រូវ។`,
    examples: [
      {
        title_km: 'ទាមទារទិន្នន័យវិជ្ជមាន',
        code: `#include <iostream>

int main() {
    int n = 0;
    do {
        std::cin >> n;
    } while (n <= 0);
    std::cout << n << std::endl;
    return 0;
}`,
        stdin: '-5\n-2\n7\n',
        expectedOutput: '7\n',
        note_km: 'ទិន្នន័យខុសត្រូវបានសួរម្តងទៀត រហូតដល់ទទួលបានតម្លៃវិជ្ជមាន។',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'while ធៀបនឹង do-while',
        columns: ['លក្ខណៈ', 'while', 'do-while'],
        rows: [
          ['ពេលពិនិត្យលក្ខខណ្ឌ', 'មុន body', 'បន្ទាប់ពី body'],
          ['ចំនួនដងអប្បបរមា', '0', '1'],
          ['សញ្ញា ; នៅចុង', 'គ្មាន', 'មាន'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `do {
    std::cout << "A";
} while (n < 5)   // ខ្វះ ; → compile error`,
      rightCode: `do {
    std::cout << "A";
} while (n < 5);  // ត្រឹមត្រូវ`,
      note_km: 'do-while គឺជា statement មួយដែលបញ្ចប់ដោយ ; បន្ទាប់ពី while (លក្ខខណ្ឌ)។',
    },
    exercises: [
      {
        id: 'l4-do-while-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី? (ចំណាំ៖ លក្ខខណ្ឌមិនពិតតាំងពីដំបូង)',
        code: `#include <iostream>

int main() {
    int n = 10;
    do {
        std::cout << "A" << std::endl;
    } while (n < 5);
    return 0;
}`,
        expectedOutput: 'A\n',
        hints_km: ['do-while ដំណើរការ body មុន ទើបពិនិត្យលក្ខខណ្ឌ។'],
        explanation_km: 'ទោះលក្ខខណ្ឌមិនពិត body ដំណើរការមួយដងរួចហើយ → បញ្ចេញ A មួយដង។',
      },
      {
        id: 'l4-do-while-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ do-while ដំណើរការ body យ៉ាងតិចប៉ុន្មានដង?',
        options_km: ['1 ដង', '0 ដង', '2 ដង', 'អាស្រ័យលើលក្ខខណឌ'],
        answerIndex: 0,
        hints_km: ['លក្ខខណ្ឌត្រូវបានពិនិត្យបន្ទាប់ពី body ដំបូង។'],
        explanation_km: 'ដោយសារលក្ខខណ្ឌពិនិត្យបន្ទាប់ពី body រាល់ដង body ទី ១ ដំណើរការជានិច្ច។',
      },
      {
        id: 'l4-do-while-ex3',
        type: 'code_challenge',
        prompt_km: 'សរសេរកម្មវិធីអាន n (n >= 1) រួចបញ្ចេញ n, n-1, …, 1 ដោយប្រើ do-while។',
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    // សរសេរ do-while នៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    do {
        std::cout << n << std::endl;
        --n;
    } while (n >= 1);
    return 0;
}`,
        testCases: [
          { stdin: '3\n', expectedOutput: '3\n2\n1\n' },
          { stdin: '1\n', expectedOutput: '1\n' },
        ],
        hints_km: ['ក្នុង body បញ្ចេញ n រួចបន្ថយ n។', 'លក្ខខណ្ឌបន្តគឺ n >= 1។', 'កុំភ្លេចសញ្ញា ; បន្ទាប់ពី while (…)។'],
        explanation_km:
          'do-while ធានាថាតម្លៃដំបូងត្រូវបានបញ្ចេញយ៉ាងតិចមួយដង ហើយបន្តរហូតដល់ n ធ្លាក់ក្រោម 1។',
      },
    ],
    summary_km:
      'do-while ដំណើរការ body យ៉ាងតិចមួយដង ព្រោះលក្ខខណ្ឌពិនិត្យបន្ទាប់ពី។ សមសម្រាប់ការទទួលយក និងពិនិត្យទិន្នន័យ។ កុំភ្លេច ; នៅចុង។',
    next: 'l4-break-continue',
  },
  {
    id: 'l4-break-continue',
    level_id: 4,
    unit_id: 2,
    title_km: 'break និង continue',
    title_en: 'break and continue',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l4-do-while'],
    objectives_km: [
      'ប្រើ break ដើម្បីឈប់រង្វិលភ្លាម',
      'ប្រើ continue ដើម្បីរំលងដងបច្ចុប្បន្ន',
      'ជ្រើសរើសឲ្យត្រូវរវាងពីរនេះ',
    ],
    explanation_km: `ក្នុងរង្វិល មានពាក្យគន្លឹះគ្រប់គ្រងលំហូរពីរ៖
- **break** — បញ្ចប់រង្វិលទាំងស្រុងភ្លាមៗ ទៅកូដបន្ទាប់ពីរង្វិល
- **continue** — រំលងផ្នែកដែលនៅសល់នៃ **ដងបច្ចុប្បន្ន** ហើយទៅដងបន្ទាប់ភ្លាម

គន្លឹះ៖ break/continue មានឥទ្ធិពលលើរង្វិល **ខាងក្នុងបំផុត** ដែលវាស្ថិតនៅក្នុងប៉ុណ្ណោះ។`,
    examples: [
      {
        title_km: 'រំលងលេខសេស ឈប់មុន 10',
        code: `#include <iostream>

int main() {
    for (int i = 1; i <= 10; ++i) {
        if (i % 2 == 1) {
            continue;
        }
        if (i > 8) {
            break;
        }
        std::cout << i << std::endl;
    }
    return 0;
}`,
        expectedOutput: '2\n4\n6\n8\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'សកម្មភាពក្នុងរាល់ដង',
        columns: ['i', 'សកម្មភាព'],
        rows: [
          ['1', 'continue (រំលង)'],
          ['2', 'បញ្ចេញ 2'],
          ['9', 'continue (រំលង)'],
          ['10', 'break (ឈប់)'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `for (...) {
    if (bad) continue;
    std::cout << "done";   // មិនដំណើរការទេពេល bad
    ++counter;             // នេះក៏ត្រូវរំលងដែរ!
}`,
      rightCode: `for (...) {
    if (bad) {
        ++counter;         // ធ្វើអ្វីដែលចាំបាច់មុនរំលង
        continue;
    }
    std::cout << "done";
}`,
      note_km: 'continue រំលង **អ្វីទាំងអស់** ដែលនៅក្រោមវាក្នុងដងនោះ — រួមទាំងការ update ដែលអ្នកដាក់នៅចុង body។',
    },
    exercises: [
      {
        id: 'l4-break-continue-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    for (int i = 1; i <= 6; ++i) {
        if (i == 5) {
            break;
        }
        std::cout << i << std::endl;
    }
    return 0;
}`,
        expectedOutput: '1\n2\n3\n4\n',
        hints_km: ['ពេល i == 5 រង្វិលឈប់ភ្លាម — តើ 5 ត្រូវបានបញ្ចេញទេ?'],
        explanation_km: 'break នៅ i == 5 បញ្ចប់រង្វិលមុនពេលបញ្ចេញ 5 ដូច្នេះលទ្ធផលគឺ 1–4។',
      },
      {
        id: 'l4-break-continue-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើពាក្យគន្លឹះណារំលងតែដងបច្ចុប្បន្ន ហើយបន្តទៅដងបន្ទាប់?',
        options_km: ['continue', 'break', 'return', 'else'],
        answerIndex: 0,
        hints_km: ['break ឈប់ទាំងស្រុង ឯពាក្យមួយទៀតគ្រាន់តែរំលងដងនេះ។'],
        explanation_km: 'continue រំលងផ្នែកដែលនៅសល់នៃដងបច្ចុប្បន្ន រួចទៅដងបន្ទាប់របស់រង្វិល។',
      },
      {
        id: 'l4-break-continue-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញពាក្យគន្លឹះដើម្បីឈប់រង្វិលពេលរកឃើញតម្លៃគោលដៅ៖',
        template: `for (int i = 0; i < 100; ++i) {
    if (a[i] == target) {
        found = i;
        {{0}};
    }
}`,
        acceptedAnswers: [['break']],
        hints_km: ['គ្មានប្រយោជន៍ក្នុងការបន្តស្វែងរកបន្ទាប់ពីរកឃើញទេ។'],
        explanation_km: 'break បញ្ចប់ការស្វែងរកភ្លាមៗ ហើយរក្សាទុក index ដែលរកឃើញ។',
      },
      {
        id: 'l4-break-continue-ex4',
        type: 'code_challenge',
        prompt_km: 'សរសេរកម្មវិធីអាន n (n >= 2) រួចបញ្ចេញតួចែកតូចបំផុតធំជាង 1 របស់ n។ ឧ. 15 → 3។',
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    // រង្វិលពី 2 ឡើង ប្រើ break ពេលរកឃើញតួចែក

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    for (int i = 2; i <= n; ++i) {
        if (n % i == 0) {
            std::cout << i << std::endl;
            break;
        }
    }
    return 0;
}`,
        testCases: [
          { stdin: '49\n', expectedOutput: '7\n' },
          { stdin: '15\n', expectedOutput: '3\n' },
          { stdin: '2\n', expectedOutput: '2\n' },
        ],
        hints_km: ['ពិនិត្យ n % i == 0 ពី i = 2 ឡើងទៅ។', 'ពេលរកឃើញដំបូង បញ្ចេញវា រួច break។'],
        explanation_km:
          'តួចែកតូចបំផុតធំជាង 1 ត្រូវបានរកឃើញដំបូងគេក្នុងលំដាប់ឡើង — break ធានាថាយើងបញ្ចេញតែវាមួយ។',
      },
    ],
    summary_km:
      'break ឈប់រង្វិលទាំងស្រុង; continue រំលងតែដងបច្ចុប្បន្ន។ ទាំងពីរមានឥទ្ធិពលលើរង្វិលខាងក្នុងបំផុតប៉ុណ្ណោះ។',
    next: 'l4-nested-loops',
  },
  {
    id: 'l4-nested-loops',
    level_id: 4,
    unit_id: 2,
    title_km: 'រង្វិលជុំបង្កប់',
    title_en: 'Nested loops',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 18,
    prerequisites: ['l4-break-continue'],
    objectives_km: [
      'សរសេររង្វិលក្នុងរង្វិលសម្រាប់ទិន្នន័យពីរវិមាត្រ',
      'គណនាចំនួនដងសរុបដែល body ខាងក្នុងដំណើរការ',
    ],
    explanation_km: `**រង្វិលបង្កប់** គឺជារង្វិលដែលស្ថិតក្នុងរង្វិលមួយទៀត។ រាល់ **មួយដង** នៃរង្វិលខាងក្រៅ រង្វិលខាងក្នុងដំណើរការគ្រប់ដងរបស់វា។

ដូច្នេះបើរង្វិលក្រៅដំណើរការ R ដង ហើយរង្វិលក្នុងដំណើរការ C ដងក្នុងមួយដងក្រៅ body ខាងក្នុងដំណើរការសរុប R × C ដង។

ការប្រើធម្មតា៖ តារាង ក្រាហ្វិករាងចតុកោណ តារាងគុណ និងការដំណើរការលើ grid។

ចំណាំ៖ ប្រើអថេររាប់ **ផ្សេងគ្នា** សម្រាប់រង្វិលនីមួយៗ (i សម្រាប់ខាងក្រៅ j សម្រាប់ខាងក្នុង)។`,
    examples: [
      {
        title_km: 'តារាងគុណ 3×3',
        code: `#include <iostream>

int main() {
    for (int i = 1; i <= 3; ++i) {
        for (int j = 1; j <= 3; ++j) {
            std::cout << i * j << " ";
        }
        std::cout << std::endl;
    }
    return 0;
}`,
        expectedOutput: '1 2 3 \n2 4 6 \n3 6 9 \n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'រាល់ដងរបស់រង្វិលខាងក្រៅ ដំណើរការរង្វិលខាងក្នុងពេញលេញ',
        columns: ['i (ខាងក្រៅ)', 'j ដែលដំណើរការ', 'បន្ទាត់លទ្ធផល'],
        rows: [
          ['1', '1, 2, 3', '1 2 3'],
          ['2', '1, 2, 3', '2 4 6'],
          ['3', '1, 2, 3', '3 6 9'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `for (int i = 1; i <= 3; ++i) {
    for (int i = 1; i <= 3; ++i) {   // អថេរដូចគ្នា → ខូចរង្វិលក្រៅ!
        ...
    }
}`,
      rightCode: `for (int i = 1; i <= 3; ++i) {
    for (int j = 1; j <= 3; ++j) {   // អថេរផ្សេងគ្នា
        ...
    }
}`,
      note_km: 'ការប្រើអថេររាប់តែមួយសម្រាប់រង្វិលទាំងពីរធ្វើឲ្យរង្វិលខាងក្នុងកែតម្លៃអថេររបស់រង្វិលខាងក្រៅ។',
    },
    exercises: [
      {
        id: 'l4-nested-loops-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    for (int i = 1; i <= 2; ++i) {
        for (int j = 1; j <= 3; ++j) {
            std::cout << "*";
        }
        std::cout << std::endl;
    }
    return 0;
}`,
        expectedOutput: '***\n***\n',
        hints_km: ['រង្វិលខាងក្នុងបញ្ចេញ * បីដង រួចខាងក្រៅចុះបន្ទាត់។', 'រង្វិលខាងក្រៅដំណើរការ 2 ដង → 2 បន្ទាត់។'],
        explanation_km: 'រាល់ដងនៃ i បញ្ចេញ *** មួយបន្ទាត់ → បន្ទាត់ពីរ។',
      },
      {
        id: 'l4-nested-loops-ex2',
        type: 'multiple_choice',
        prompt_km: 'បើរង្វិលខាងក្រៅ 3 ដង និងខាងក្នុង 4 ដង តើ body ខាងក្នុងដំណើរការសរុបប៉ុន្មានដង?',
        options_km: ['12', '7', '3', '4'],
        answerIndex: 0,
        hints_km: ['គុណ មិនមែនបូកទេ។'],
        explanation_km: 'រាល់ដងខាងក្រៅ ខាងក្នុងដំណើរការ 4 ដង → 3 × 4 = 12។',
      },
      {
        id: 'l4-nested-loops-ex3',
        type: 'code_challenge',
        prompt_km: 'សរសេរកម្មវិធីអាន w និង h រួចបញ្ចេញចតុកោណនៃសញ្ញា * ទំហំ w × h (w ជួរឈរ, h ជួរដេក)។',
        starterCode: `#include <iostream>

int main() {
    int w = 0;
    int h = 0;
    std::cin >> w >> h;
    // រង្វិលបង្កប់នៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int w = 0;
    int h = 0;
    std::cin >> w >> h;
    for (int row = 0; row < h; ++row) {
        for (int col = 0; col < w; ++col) {
            std::cout << "*";
        }
        std::cout << std::endl;
    }
    return 0;
}`,
        testCases: [
          { stdin: '3 2\n', expectedOutput: '***\n***\n' },
          { stdin: '1 4\n', expectedOutput: '*\n*\n*\n*\n' },
        ],
        hints_km: ['រង្វិលខាងក្រៅ = ជួរដេក (h) រង្វិលខាងក្នុង = ជួរឈរ (w)។', 'បញ្ចប់រាល់ជួរដេកដោយ std::endl។'],
        explanation_km:
          'រង្វិលខាងក្នុងបញ្ចេញ * ចំនួន w ដងក្នុងមួយជួរដេក ហើយរង្វិលខាងក្រៅធ្វើវា h ដង។',
      },
    ],
    summary_km:
      'រង្វិលបង្កប់ដំណើរការខាងក្នុងពេញលេញក្នុងរាល់ដងខាងក្រៅ (R × C ដងសរុប)។ ប្រើអថេររាប់ផ្សេងគ្នាសម្រាប់រង្វិលនីមួយៗ។',
    next: 'l4-loop-tracing',
  },
  {
    id: 'l4-loop-tracing',
    level_id: 4,
    unit_id: 2,
    title_km: 'ការតាមដាន (trace) រង្វិលជុំ',
    title_en: 'Tracing loops',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l4-nested-loops'],
    objectives_km: [
      'តាមដានតម្លៃអថេរក្នុងរាល់ដងនៃរង្វិលដោយដៃ',
      'ប្រើតារាង trace ដើម្បីព្យាករណ៍លទ្ធផលមុនដំណើរការ',
    ],
    explanation_km: `**ការតាមដាន (tracing)** គឺជាជំនាញដើរតាមកូដក្នុងក្បាលអ្នក មួយដងម្តងៗ ដោយកត់តម្លៃអថេរទាំងអស់។ វាជាវិធីល្អបំផុតដើម្បី៖
- ព្យាករណ៍លទ្ធផលមុនពេល compile
- រកកំហុស logic (off-by-one, លំដាប់ខុស)
- យល់ពីកូដអ្នកដទៃ

វិធីសាស្ត្រ៖ សរសេរតារាងដែលមានជួរឈរមួយសម្រាប់អថេរសំខាន់ៗនីមួយៗ ហើយជួរដេកមួយសម្រាប់រាល់ដងនៃរង្វិល។ កុំទាយ — គណនាជំហានម្តងមួយៗ។`,
    examples: [
      {
        title_km: 'តម្លៃបូកបន្សំ (cumulative)',
        code: `#include <iostream>

int main() {
    int x = 0;
    for (int i = 1; i <= 4; ++i) {
        x = x + i;
        std::cout << x << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
        expectedOutput: '1 3 6 10 \n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'តារាង trace',
        columns: ['i', 'x មុន', 'x = x + i', 'បញ្ចេញ'],
        rows: [
          ['1', '0', '1', '1'],
          ['2', '1', '3', '3'],
          ['3', '3', '6', '6'],
          ['4', '6', '10', '10'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: 'គិតថា x "វិលត្រឡប់" ទៅ 0 ក្នុងរាល់ដង',
      rightCode: 'x រក្សាតម្លៃចាស់របស់វារហូតដល់មានការដាក់តម្លៃថ្មី',
      note_km:
        'អថេរខាងក្រៅរង្វិលរក្សាតម្លៃរវាងដងនីមួយៗ — នេះហើយជាមូលដ្ឋាននៃការបូកបន្សំ។ កំហុសទូទៅគឺការស្មានថាវាចាប់ផ្តើមឡើងវិញ។',
    },
    exercises: [
      {
        id: 'l4-loop-tracing-ex1',
        type: 'predict_output',
        prompt_km: 'តាមដានដោយដៃ រួចទាយលទ្ធផល៖',
        code: `#include <iostream>

int main() {
    int p = 1;
    for (int i = 1; i <= 4; ++i) {
        p = p * 2;
    }
    std::cout << p << std::endl;
    return 0;
}`,
        expectedOutput: '16\n',
        hints_km: ['p គុណនឹង 2 ក្នុងរាល់ដង៖ 1→2→4→8→16។'],
        explanation_km: 'ការគុណបន្តបន្ទាប់ 4 ដងនឹង 2 ផ្តល់ 2^4 = 16។',
      },
      {
        id: 'l4-loop-tracing-ex2',
        type: 'multiple_choice',
        prompt_km: 'ក្នុងកូដខាងលើ តើតម្លៃរបស់ p បន្ទាប់ពីដងទី 3 គឺជាអ្វី?',
        options_km: ['8', '4', '16', '2'],
        answerIndex: 0,
        hints_km: ['ដងទី 1: 2, ដងទី 2: 4, ដងទី 3: …?'],
        explanation_km: 'p ដើរតាម 2, 4, 8, 16 — បន្ទាប់ពីដងទី 3 វាជា 8។',
      },
      {
        id: 'l4-loop-tracing-ex3',
        type: 'code_challenge',
        prompt_km: 'សរសេរកម្មវិធីអាន n រួចបញ្ចេញតម្លៃ n(n+1)/2 ដោយប្រើរង្វិល (កុំប្រើរូបមន្តផ្ទាល់)។',
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    // បូក 1..n ដោយរង្វិល

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int total = 0;
    for (int i = 1; i <= n; ++i) {
        total += i;
    }
    std::cout << total << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '4\n', expectedOutput: '10\n' },
          { stdin: '1\n', expectedOutput: '1\n' },
        ],
        hints_km: ['នេះគឺជាលំហាត់ trace ដដែល — ប៉ុន្តែឥឡូវអ្នកសរសេរវាខ្លួនឯង។', 'អថេរ total ចាប់ផ្តើម 0 ហើយបន្ថែម i ក្នុងរាល់ដង។'],
        explanation_km:
          'ការបូកបន្សំតាមរង្វិលផ្តល់លទ្ធផលដូចរូបមន្ត n(n+1)/2 — ហើយវាជាលំហាត់ល្អក្នុងការហ្វឹកហាត់ trace។',
      },
    ],
    summary_km:
      'Tracing គឺជាជំនាញមូលដ្ឋាននៃការស្មានលទ្ធផល និងការរកកំហុស៖ សរសេរតារាង តាមដានអថេរក្នុងរាល់ដង ហើយកុំទាយ។',
    next: 'l5-functions-intro',
  },
];
