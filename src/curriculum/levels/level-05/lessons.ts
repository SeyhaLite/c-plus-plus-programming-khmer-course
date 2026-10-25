import type { Lesson } from '../../../types';

// ============================================================
// កម្រិត ៥ — Functions (Level 5 — Functions)
// ============================================================

export const level05Lessons: Lesson[] = [
  {
    id: 'l5-functions-intro',
    level_id: 5,
    unit_id: 1,
    title_km: 'ការបង្កើតមុខងារ',
    title_en: 'Function basics',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 18,
    prerequisites: ['l4-loop-tracing'],
    objectives_km: [
      'បង្កើត និងហៅមុខងារ (function) ដោយខ្លួនឯង',
      'យល់ពី return type និង void',
      'ដឹងថាកម្មវិធីចាប់ផ្តើមពី main ជានិច្ច ទោះមានមុខងារច្រើន',
    ],
    explanation_km: `**មុខងារ (function)** គឺជាករុមកូដដែលមានឈ្មោះ អាចហៅប្រើម្តងហើយម្តងទៀត។ វាជួយឲ្យកូដ៖
- ខ្លីជាងមុន (គ្មានការសរសេរដដែល)
- ងាយអាន (ឈ្មោះមុខងារប្រាប់ថាវាធ្វើអ្វី)
- ងាយតេស្ត (តេស្តមុខងារម្តងមួយៗ)

រចនាសម្ព័ន្ធ៖ \`return_type ឈ្មោះ(parameters) { body }\`
- **void** មានន័យថាមុខងារមិនត្រឡប់តម្លៃទេ
- កម្មវិធីនៅតែចាប់ផ្តើមពី \`main()\` — មុខងារដំណើរការតែពេលត្រូវបាន **ហៅ (called)**`,
    examples: [
      {
        title_km: 'មុខងារគ្មានតម្លៃត្រឡប់ (void)',
        code: `#include <iostream>

void greet() {
    std::cout << "សួស្តី!" << std::endl;
}

int main() {
    greet();
    greet();
    return 0;
}`,
        expectedOutput: 'សួស្តី!\nសួស្តី!\n',
      },
    ],
    diagrams: [
      {
        type: 'pipeline',
        title_km: 'ការហៅមុខងារ',
        steps: [
          { label_km: 'main ហៅ', sub: 'greet();' },
          { label_km: 'body ដំណើរការ', sub: 'cout …' },
          { label_km: 'ត្រឡប់ទៅ main', sub: 'បន្ទាត់បន្ទាប់' },
        ],
      },
    ],
    commonMistake: {
      wrongCode: `int main() {
    greet();          // ហៅមុនពេល compiler ស្គាល់ greet
    return 0;
}
void greet() { ... }   // និយមន័យនៅខាងក្រោយ`,
      rightCode: `void greet() { ... }   // និយមន័យមុន (ឬមាន declaration)
int main() {
    greet();
    return 0;
}`,
      note_km:
        'compiler អានពីលើចុះក្រោម — វាត្រូវស្គាល់មុខងារមុនពេលការហៅ។ ដាក់និយមន័យពីលើ main ឬប្រើ forward declaration។',
    },
    exercises: [
      {
        id: 'l5-functions-intro-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

void line() {
    std::cout << "-----" << std::endl;
}

int main() {
    line();
    line();
    line();
    return 0;
}`,
        expectedOutput: '-----\n-----\n-----\n',
        hints_km: ['រាល់ការហៅដំណើរការ body ម្តង។', 'មានការហៅប៉ុន្មានដង?'],
        explanation_km: 'line() ត្រូវបានហៅ 3 ដង ដូច្នេះបញ្ចេញ 3 បន្ទាត់។',
      },
      {
        id: 'l5-functions-intro-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើកម្មវិធី C++ ចាប់ផ្តើមដំណើរការពីណា ទោះបីមានមុខងារច្រើនក៏ដោយ?',
        options_km: ['main()', 'មុខងារដែលសរសេរមុនគេ', 'មុខងារដែលហៅដំបូង', 'void ដំបូង'],
        answerIndex: 0,
        hints_km: ['ចំណុចចូលតែមួយគត់នៃកម្មវិធី C++។'],
        explanation_km: 'main() គឺជាចំណុចចាប់ផ្តើមជានិច្ច; មុខងារផ្សេងដំណើរការតែពេលត្រូវបានហៅ។',
      },
      {
        id: 'l5-functions-intro-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញពាក្យគន្លឹះ៖ មុខងារនេះមិនត្រឡប់តម្លៃទេ',
        template: `{{0}} showHelp() {
    std::cout << "help";
}`,
        acceptedAnswers: [['void']],
        hints_km: ['ពាក្យ ៤ អក្សរដែលមានន័យថា "គ្មានតម្លៃត្រឡប់"។'],
        explanation_km: 'void ប្រាប់ compiler ថាមុខងារមិនត្រឡប់តម្លៃ — គ្មាន return ដែលមានតម្លៃទេ។',
      },
      {
        id: 'l5-functions-intro-ex4',
        type: 'code_challenge',
        prompt_km: 'បង្កើតមុខងារ void ឈ្មោះ greet ដែលបញ្ចេញ "សួស្តី" មួយបន្ទាត់ រួចហៅវា 2 ដងក្នុង main។',
        starterCode: `#include <iostream>

// សរសេរមុខងារ greet នៅទីនេះ

int main() {
    // ហៅ greet ពីរដង

    return 0;
}`,
        solutionCode: `#include <iostream>

void greet() {
    std::cout << "សួស្តី" << std::endl;
}

int main() {
    greet();
    greet();
    return 0;
}`,
        testCases: [{ stdin: '', expectedOutput: 'សួស្តី\nសួស្តី\n' }],
        hints_km: ['ទម្រង់៖ void greet() { … }', 'ក្នុង main ហៅ greet(); ពីរដង។'],
        explanation_km: 'និយមន័យមុខងារនៅពីលើ main ធ្វើឲ្យ compiler ស្គាល់វាមុនការហៅ។',
      },
    ],
    summary_km:
      'មុខងារជាកូដមានឈ្មោះដែលហៅបានម្តងទៀត។ void = គ្មានតម្លៃត្រឡប់។ កម្មវិធីចាប់ផ្តើមពី main ជានិច្ច ហើយនិយមន័យត្រូវនៅមុនការហៅ។',
    next: 'l5-params-return',
  },
  {
    id: 'l5-params-return',
    level_id: 5,
    unit_id: 1,
    title_km: 'Parameters និង return values',
    title_en: 'Parameters and returns',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 18,
    prerequisites: ['l5-functions-intro'],
    objectives_km: [
      'ផ្តល់ទិន្នន័យចូលមុខងារតាម parameters',
      'ត្រឡប់លទ្ធផលដោយ return',
      'ខុសគ្នារវាង argument និង parameter',
    ],
    explanation_km: `**Parameter** គឺជាអថេរដែលមុខងារទទួលពេល被ហៅ; **argument** គឺជាតម្លៃពិតដែលយើងផ្តល់។

\`return\` ធ្វើពីរយ៉ាង៖
- បញ្ចប់មុខងារភ្លាម
- ផ្តល់តម្លៃមួយត្រឡប់ទៅកន្លែងដែលហៅ

មុខងារដែលមាន return type (មិនមែន void) ត្រូវតែ return តម្លៃនៃប្រភេទនោះគ្រប់ផ្លូវ។`,
    examples: [
      {
        title_km: 'មុខងារបូកលេខ',
        code: `#include <iostream>

int add(int a, int b) {
    return a + b;
}

int main() {
    std::cout << add(2, 3) << std::endl;
    return 0;
}`,
        expectedOutput: '5\n',
      },
    ],
    diagrams: [
      {
        type: 'pipeline',
        title_km: 'argument → parameter → return',
        steps: [
          { label_km: 'argument', sub: 'add(2, 3)' },
          { label_km: 'parameter', sub: 'a=2, b=3' },
          { label_km: 'return', sub: '5' },
        ],
      },
    ],
    commonMistake: {
      wrongCode: `int add(int a, int b) {
    int sum = a + b;
    // ភ្លេច return → តម្លៃមិនកំណត់!
}`,
      rightCode: `int add(int a, int b) {
    return a + b;
}`,
      note_km:
        'មុខងារដែលប្រកាស return type ប៉ុន្តែមិន return គឺជាកំហុស (compiler ព្រមាន ហើយលទ្ធផលមិនកំណត់)។',
    },
    exercises: [
      {
        id: 'l5-params-return-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int mul(int a, int b) {
    return a * b;
}

int main() {
    std::cout << mul(4, 5) << std::endl;
    return 0;
}`,
        expectedOutput: '20\n',
        hints_km: ['argument 4 និង 5 ចូលទៅ parameter a និង b។'],
        explanation_km: 'mul(4,5) ត្រឡប់ 4 × 5 = 20។',
      },
      {
        id: 'l5-params-return-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ return ធ្វើអ្វីខ្លះ?',
        options_km: [
          'បញ្ចប់មុខងារភ្លាម និងផ្តល់តម្លៃត្រឡប់',
          'បញ្ចេញលទ្ធផលទៅអេក្រង់',
          'បង្កើតអថេរថ្មី',
          'ហៅមុខងារផ្សេង',
        ],
        answerIndex: 0,
        hints_km: ['return មិនបញ្ចេញអ្វីទៅអេក្រង់ទេ — វាផ្តល់តម្លៃត្រឡប់។'],
        explanation_km: 'return បញ្ចប់ការដំណើរការរបស់មុខងារ ហើយផ្តល់តម្លៃទៅកន្លែងហៅ។',
      },
      {
        id: 'l5-params-return-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញប្រភេទត្រឡប់ត្រឹមត្រូវ',
        template: `{{0}} square(int n) {
    return n * n;
}`,
        acceptedAnswers: [['int']],
        hints_km: ['n * n នៃ int ជា int។'],
        explanation_km: 'ដោយសារ return n * n ជាចំនួនគត់ ប្រភេទត្រឡប់ត្រូវជា int។',
      },
      {
        id: 'l5-params-return-ex4',
        type: 'code_challenge',
        prompt_km: 'សរសេរមុខងារ int square(int n) ដែលត្រឡប់ n*n ហើយអាន n ពីអ្នកប្រើ រួចបញ្ចេញលទ្ធផល។',
        starterCode: `#include <iostream>

// សរសេរមុខងារ square នៅទីនេះ

int main() {
    int n = 0;
    std::cin >> n;
    // ហៅ square ហើយបញ្ចេញ

    return 0;
}`,
        solutionCode: `#include <iostream>

int square(int n) {
    return n * n;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << square(n) << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '5\n', expectedOutput: '25\n' },
          { stdin: '0\n', expectedOutput: '0\n' },
          { stdin: '-3\n', expectedOutput: '9\n' },
        ],
        hints_km: ['return type គឺ int ព្រោះលទ្ធផលជាចំនួនគត់។', 'ក្នុង main៖ std::cout << square(n) << std::endl;'],
        explanation_km: 'មុខងារទទួល parameter ត្រឡប់លទ្ធផល ហើយ main បញ្ចេញវា — ការបំបែកការងារបែបនេះធ្វើឲ្យកូដងាយស្តារ។',
      },
    ],
    summary_km:
      'Parameter ទទួលទិន្នន័យ; return ផ្តល់លទ្ធផលត្រឡប់។ មុខងារដែលមាន return type ត្រូវតែ return គ្រប់ផ្លូវ។',
    next: 'l5-scope',
  },
  {
    id: 'l5-scope',
    level_id: 5,
    unit_id: 1,
    title_km: 'វិសាលភាព (scope)',
    title_en: 'Scope',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l5-params-return'],
    objectives_km: [
      'យល់ពីវិសាលភាពរបស់អថេរ local',
      'យល់ពី shadowing (អថេរឈ្មោះដូចគ្នាក្នុង scope ក្នុង)',
      'ដឹងពីអាយុកាល (lifetime) អថេរ local',
    ],
    explanation_km: `**Scope** គឺជាតំបន់ក្នុងកូដដែលអថេរមួយអាចមើលឃើញបាន។ អថេរដែលបង្កើតក្នុង block \`{ }\` គឺ **local** ទៅ block នោះ៖
- វាមិនអាចប្រើបានពីខាងក្រៅ block
- វាមានអាយុកាលតែពេល block ដំណើរការ

**Shadowing**៖ បើ scope ខាងក្នុងបង្កើតអថេរឈ្មោះដូចគ្នា វា "បិទបាំង" អថេរខាងក្រៅក្នុង scope នោះ — តម្លៃខាងក្រៅមិនបាត់ គ្រាន់តែមិនមើលឃើញបណ្តោះអាសន្ន។`,
    examples: [
      {
        title_km: 'Shadowing ក្នុង block ខាងក្នុង',
        code: `#include <iostream>

int main() {
    int x = 1;
    {
        int x = 2;
        std::cout << x << std::endl;
    }
    std::cout << x << std::endl;
    return 0;
}`,
        expectedOutput: '2\n1\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'តម្លៃដែលមើលឃើញតាម scope',
        columns: ['ទីតាំងក្នុងកូដ', 'x ដែលមើលឃើញ'],
        rows: [
          ['ក្នុង block ខាងក្នុង', '2 (x របស់ block)'],
          ['ក្រៅ block', '1 (x របស់ main)'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `{
    int temp = 5;
}
std::cout << temp;   // compile error: temp មិនមាននៅទីនេះទេ`,
      rightCode: `int temp = 5;
std::cout << temp;   // ប្រើក្នុង scope តែមួយ`,
      note_km: 'អថេរ local ស្លាប់នៅពេល block បញ្ចប់ — ការប្រើវាពីខាងក្រៅគឺជា compile error។',
    },
    exercises: [
      {
        id: 'l5-scope-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    int a = 10;
    {
        int b = 5;
        a = a + b;
    }
    std::cout << a << std::endl;
    return 0;
}`,
        expectedOutput: '15\n',
        hints_km: ['b មានតែក្នុង block ប៉ុណ្ណោះ ប៉ុន្តែ a ត្រូវបានកែពីខាងក្នុង។'],
        explanation_km: 'a ត្រូវបានបន្ថែមដោយ b ក្នុង block → 15; b បាត់បន្ទាប់ពី block ប៉ុន្តែ a នៅ។',
      },
      {
        id: 'l5-scope-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើអ្វីកើតឡើងពេលប្រើអថេរ local ពីខាងក្រៅ block របស់វា?',
        options_km: ['compile error', 'តម្លៃ 0 ត្រឡប់', 'តម្លៃចាស់ត្រឡប់', 'កម្មវិធីគាំង'],
        answerIndex: 0,
        hints_km: ['compiler មិនស្គាល់ឈ្មោះនោះនៅ scope នោះទេ។'],
        explanation_km: 'ឈ្មោះមិនមានក្នុង scope នោះ → compile error "was not declared in this scope"។',
      },
      {
        id: 'l5-scope-ex3',
        type: 'find_error',
        prompt_km: 'កូដនេះមិន compile ទេ។ ចុចបន្ទាត់ដែលប្រើអថេរខុស scope៖',
        code: `#include <iostream>

int main() {
    {
        int inner = 7;
    }
    std::cout << inner << std::endl;
    return 0;
}`,
        errorLine: 7,
        fixedLine: '    std::cout << "done" << std::endl;',
        hints_km: ['inner ត្រូវបានបង្កើតក្នុង block តូច ហើយស្លាប់នៅពេល block បញ្ចប់។'],
        explanation_km: 'បន្ទាត់ 7 ប្រើ inner ពីខាងក្រៅ scope របស់វា — compile error។',
      },
    ],
    summary_km:
      'អថេរ local មានវិសាលភាព និងអាយុកាលក្នុង block របស់វា។ Shadowing បិទបាំងអថេរខាងក្រៅបណ្តោះអាសន្ន ប៉ុន្តែមិនលុបវាទេ។',
    next: 'l5-pass-by-ref',
  },
  {
    id: 'l5-pass-by-ref',
    level_id: 5,
    unit_id: 2,
    title_km: 'Pass by value និង reference',
    title_en: 'Passing by reference',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 20,
    prerequisites: ['l5-scope'],
    objectives_km: [
      'ខុសគ្នារវាង pass by value និង pass by reference',
      'ប្រើ & ដើម្បីអនុញ្ញាតឲយមុខងារកែអថេរដើម',
      'ដឹងពេលណាគួរប្រើរបៀបណា',
    ],
    explanation_km: `**Pass by value** (លំនាំដើម)៖ មុខងារទទួល **ច្បាប់ចម្លង** — ការកែក្នុងមុខងារមិនប៉ះពាល់អថេរដើមទេ។

**Pass by reference**៖ ដាក់ \`&\` បន្ទាប់ពីប្រភេទក្នុង parameter — មុខងារទទួលបាន **យោង** ទៅអថេរដើម ហើយអាចកែវាបាន។

ពេលណាប្រើអ្វី៖
- by value — តម្លៃតូចៗ ដែលមុខងារមិនគួរកែ
- by reference — ពេលមុខងារត្រូវកែទិន្នន័យ ឬទិន្នន័យធំ (ជៀសវាងការចម្លង)`,
    examples: [
      {
        title_km: 'កែតម្លៃដើមតាម reference',
        code: `#include <iostream>

void addTen(int &n) {
    n += 10;
}

int main() {
    int x = 5;
    addTen(x);
    std::cout << x << std::endl;
    return 0;
}`,
        expectedOutput: '15\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'ឥទ្ធិពលលើអថេរដើម',
        columns: ['របៀបហៅ', 'x បន្ទាប់ពីការហៅ'],
        rows: [
          ['addTen(x) ដោយ value', '5 (មិនប្រែ)'],
          ['addTen(x) ដោយ reference', '15 (ប្រែ)'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `void addTen(int n) {   // by value
    n += 10;           // កែតែច្បាប់ចម្លង
}`,
      rightCode: `void addTen(int &n) {  // by reference
    n += 10;           // កែអថេរដើម
}`,
      note_km: 'បើមុខងារគួរកែអថេរដើម ប៉ុន្តែអ្នកភ្លេច & ការកែនឹងបាត់ខ្លួនពេលមុខងារបញ្ចប់។',
    },
    exercises: [
      {
        id: 'l5-pass-by-ref-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី? (ចំណាំ៖ គ្មាន &)',
        code: `#include <iostream>

void tryChange(int n) {
    n = 100;
}

int main() {
    int x = 1;
    tryChange(x);
    std::cout << x << std::endl;
    return 0;
}`,
        expectedOutput: '1\n',
        hints_km: ['by value = ច្បាប់ចម្លង។ តើការកែប៉ះពាល់ដើមទេ?'],
        explanation_km: 'n ជាច្បាប់ចម្លងរបស់ x — ការកែ n មិនប៉ះពាល់ x ទេ។',
      },
      {
        id: 'l5-pass-by-ref-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ signature ណាអនុញ្ញាតឲ្យមុខងារកែអថេរដើម?',
        options_km: ['void f(int &n)', 'void f(int n)', 'void f(const int &n)', 'void f(int *n) ដោយគ្មាន & ពេលហៅ'],
        answerIndex: 0,
        hints_km: ['const & អានបានប៉ុណ្ណោះ មិនកែទេ។'],
        explanation_km: 'int &n ជាយោងមិន const — ការកែក្នុង f ប៉ះពាល់អថេរដើម។',
      },
      {
        id: 'l5-pass-by-ref-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញសញ្ញាដើម្បីធ្វើឲ្យ parameter ជា reference៖',
        template: `void doubleIt(int {{0}} n) {
    n = n * 2;
}`,
        acceptedAnswers: [['&']],
        hints_km: ['សញ្ញាមួយដែលក៏ប្រើសម្រាប់ address-of ដែរ។'],
        explanation_km: '& ក្នុងបញ្ជី parameter មានន័យថា pass by reference។',
      },
      {
        id: 'l5-pass-by-ref-ex4',
        type: 'code_challenge',
        prompt_km: 'សរសេរមុខងារ void swap(int &a, int &b) ដែលផ្លាស់ប្តូរតម្លៃ រួចអាន a និង b ហើយបញ្ចេញវាក្រោយផ្លាស់ប្តូរ។',
        starterCode: `#include <iostream>

// សរសេរ swap នៅទីនេះ

int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    // ហៅ swap រួចបញ្ចេញ a និង b

    return 0;
}`,
        solutionCode: `#include <iostream>

void swap(int &a, int &b) {
    int t = a;
    a = b;
    b = t;
}

int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    swap(a, b);
    std::cout << a << " " << b << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '1 2\n', expectedOutput: '2 1\n' },
          { stdin: '5 5\n', expectedOutput: '5 5\n' },
        ],
        hints_km: ['ត្រូវការអថេរជំនួយ mួយ (temp) សម្រាប់ការផ្លាស់ប្តូរ។', 'parameter ទាំងពីរត្រូវជា reference (&)។'],
        explanation_km:
          'swap ត្រូវការ reference — បើមិនដូច្នេះទេ វានឹងផ្លាស់ប្តូរតែច្បាប់ចម្លង ហើយ main មិនឃើញការផ្លាស់ប្តូរទេ។',
      },
    ],
    summary_km:
      'By value ផ្តល់ច្បាប់ចម្លង; by reference (&) ផ្តល់យោងទៅអថេរដើម។ ជ្រើសរើសតាមថាតើមុខងារគួរកែទិន្នន័យឬអត់។',
    next: 'l5-overloading',
  },
  {
    id: 'l5-overloading',
    level_id: 5,
    unit_id: 2,
    title_km: 'Function overloading',
    title_en: 'Overloading',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l5-pass-by-ref'],
    objectives_km: [
      'បង្កើតមុខងារឈ្មោះដូចគ្នាដែលខុសគ្នាតែ parameters',
      'យល់ពីរបៀបដែល compiler ជ្រើសរើស overload',
      'ដឹងថា return type តែមួយមុខមិនគ្រប់គ្រាន់ទេ',
    ],
    explanation_km: `**Overloading** អនុញ្ញាតឲ្យមុខងារច្រើនមាន **ឈ្មោះដូចគ្នា** បើ parameters ខុសគ្នា (ចំនួន ឬប្រភេទ)។ Compiler ជ្រើសរើស version ត្រឹមត្រូវតាម argument ពេលហៅ។

ចំណាំ៖ មុខងារពីរដែលខុសគ្នាតែ **return type** មិនអាច overload បានទេ — compiler មិនអាចជ្រើសរើសដោយផ្អែកលើតម្លៃត្រឡប់ទេ។`,
    examples: [
      {
        title_km: 'twice សម្រាប់ int និង double',
        code: `#include <iostream>

int twice(int n) {
    return n * 2;
}

double twice(double n) {
    return n * 2;
}

int main() {
    std::cout << twice(3) << std::endl;
    std::cout << twice(1.5) << std::endl;
    return 0;
}`,
        expectedOutput: '6\n3\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'ការជ្រើសរើស overload',
        columns: ['ការហៅ', 'overload ដែលត្រូវបានជ្រើស', 'លទ្ធផល'],
        rows: [
          ['twice(3)', 'int twice(int)', '6'],
          ['twice(1.5)', 'double twice(double)', '3'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `int f(int n);
double f(int n);   // ខុសគ្នាតែ return type → compile error`,
      rightCode: `int f(int n);
double f(double n);   // ខុសគ្នាត្រង់ប្រភេទ parameter → ត្រឹមត្រូវ`,
      note_km: 'Overload ត្រូវការភាពខុសគ្នាក្នុងបញ្ជី parameter មិនមែនត្រឹមតែ return type ទេ។',
    },
    exercises: [
      {
        id: 'l5-overloading-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int sum(int a, int b) {
    return a + b;
}

int sum(int a, int b, int c) {
    return a + b + c;
}

int main() {
    std::cout << sum(1, 2) << std::endl;
    std::cout << sum(1, 2, 3) << std::endl;
    return 0;
}`,
        expectedOutput: '3\n6\n',
        hints_km: ['ចំនួន argument កំណត់ overload។'],
        explanation_km: 'sum ពីរ argument → version ទី ១; បី argument → version ទី ២។',
      },
      {
        id: 'l5-overloading-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើគូណាមិនអាចជា overloads ត្រឹមត្រូវ?',
        options_km: [
          'int f(int n); និង int f(double n);',
          'int f(int n); និង double f(int n);',
          'int f(int a, int b); និង int f(int a);',
          'void f(char c); និង void f(int i);',
        ],
        answerIndex: 1,
        hints_km: ['ខុសគ្នាតែ return type មិនគ្រប់គ្រាន់ទេ។'],
        explanation_km: 'ជម្រើសទី ២ ខុសគ្នាតែ return type — compiler មិនអាចជ្រើសរើសតាមនោះទេ។',
      },
      {
        id: 'l5-overloading-ex3',
        type: 'multiple_choice',
        prompt_km: 'បើហៅ twice(2.0f) (float) តែមានតែ overload int និង double តើអ្វីកើតឡើង?',
        options_km: [
          'float ត្រូវបានបំលែងទៅ double ហើយ overload double ត្រូវបានជ្រើស',
          'compile error ព្រោះគ្មាន overload float',
          'overload int ត្រូវបានជ្រើស',
          'កម្មវិធីគាំង',
        ],
        answerIndex: 0,
        hints_km: ['C++ អនុញ្ញាតការបំលែងប្រភេទស្វ័យប្រវត្តិ float → double។'],
        explanation_km: 'float បំលែងទៅ double ដោយស្វ័យប្រវត្តិ (ការបំលែងដែលមិនបាត់បង់) ហើយ overload double ត្រូវបានជ្រើស។',
      },
    ],
    summary_km:
      'Overloading = ឈ្មោះដូចគ្នា parameters ខុសគ្នា។ Compiler ជ្រើសរើសតាម argument; ការខុសគ្នាតែ return type មិនអនុញ្ញាតទេ។',
    next: 'l5-recursion',
  },
  {
    id: 'l5-recursion',
    level_id: 5,
    unit_id: 2,
    title_km: 'Recursion មូលដ្ឋាន',
    title_en: 'Basic recursion',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 20,
    prerequisites: ['l5-overloading'],
    objectives_km: [
      'យល់ពីគោលគំនិត recursion (មុខងារហៅខ្លួនឯង)',
      'សរសេរ base case និង recursive case',
      'តាមដានការហៅជាបន្តបន្ទាប់ (call stack)',
    ],
    explanation_km: `**Recursion** គឺពេលមុខងារហៅ **ខ្លួនឯង** ដើម្បីដោះស្រាយបញ្ហាតូចជាង។ រាល់ recursion ត្រឹមត្រូវត្រូវមាន៖
- **Base case** — ករណីដែលឈប់ហៅខ្លួនឯង (ចម្លើយភ្លាម)
- **Recursive case** — បំបែកបញ្ហា ហើយហៅខ្លួនឯងជាមួយទិន្នន័យតូចជាង

បើខ្វះ base case ការហៅនឹងបន្តគ្មានទីបញ្ចប់ រហូតដល់ call stack ពេញ (stack overflow)។

ឧទាហរណ៍គណិតវិទ្យា៖ factorial n! = n × (n-1)! ដោយ 0! = 1 និង 1! = 1។`,
    examples: [
      {
        title_km: 'Factorial',
        code: `#include <iostream>

int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}

int main() {
    std::cout << fact(5) << std::endl;
    return 0;
}`,
        expectedOutput: '120\n',
      },
    ],
    diagrams: [
      {
        type: 'pipeline',
        title_km: 'ការហៅជាបន្តបន្ទាប់ និងការត្រឡប់តម្លៃ',
        steps: [
          { label_km: 'fact(5)', sub: '5 × fact(4)' },
          { label_km: 'fact(4)', sub: '4 × fact(3)' },
          { label_km: 'fact(3)', sub: '3 × fact(2)' },
          { label_km: 'fact(2)', sub: '2 × fact(1)' },
          { label_km: 'fact(1)', sub: 'base: 1' },
        ],
        note_km: 'តម្លៃត្រឡប់ឡើងវិញ៖ 1 → 2 → 6 → 24 → 120។',
      },
    ],
    commonMistake: {
      wrongCode: `int fact(int n) {
    return n * fact(n - 1);   // គ្មាន base case → មិនឈប់ទេ!
}`,
      rightCode: `int fact(int n) {
    if (n <= 1) {
        return 1;             // base case
    }
    return n * fact(n - 1);
}`,
      note_km: 'រាល់ recursion ត្រូវតែមាន base case ដែលឈប់ការហៅខ្លួនឯង — បើទេ stack overflow។',
    },
    exercises: [
      {
        id: 'l5-recursion-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}

int main() {
    std::cout << fact(4) << std::endl;
    return 0;
}`,
        expectedOutput: '24\n',
        hints_km: ['4 × 3 × 2 × 1 = ?'],
        explanation_km: 'fact(4) = 4 × fact(3) = 4 × 3 × 2 × 1 = 24។',
      },
      {
        id: 'l5-recursion-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ base case មានតួនាទីអ្វី?',
        options_km: [
          'ឈប់ការហៅខ្លួនឯង និងផ្តល់ចម្លើយចុងក្រោយ',
          'ធ្វើឲ្យកម្មវិធីលឿនជាងមុន',
          'បង្កើតអថេរថ្មី',
          'ជំនួសរង្វិលជុំទាំងអស់',
        ],
        answerIndex: 0,
        hints_km: ['បើគ្មានវា ការហៅនឹងបន្តរហូត។'],
        explanation_km: 'Base case គឺជាលក្ខខណ្ឌឈប់ — គ្មានវា recursion មិនអាចបញ្ចប់បានទេ។',
      },
      {
        id: 'l5-recursion-ex3',
        type: 'code_challenge',
        prompt_km: 'សរសេរមុខងារ recursive int sumTo(int n) = n + (n-1) + … + 0 ដោយ sumTo(0) = 0។ អាន n ហើយបញ្ចេញលទ្ធផល។',
        starterCode: `#include <iostream>

// សរសេរ sumTo នៅទីនេះ

int main() {
    int n = 0;
    std::cin >> n;
    // បញ្ចេញ sumTo(n)

    return 0;
}`,
        solutionCode: `#include <iostream>

int sumTo(int n) {
    if (n <= 0) {
        return 0;
    }
    return n + sumTo(n - 1);
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << sumTo(n) << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '4\n', expectedOutput: '10\n' },
          { stdin: '1\n', expectedOutput: '1\n' },
          { stdin: '0\n', expectedOutput: '0\n' },
        ],
        hints_km: ['Base case៖ n <= 0 → return 0។', 'Recursive case៖ return n + sumTo(n - 1);'],
        explanation_km:
          'Recursion បំបែកបញ្ហា៖ ផលបូកដល់ n គឺ n បូកនឹងផលបូកដល់ n-1 រហូតដល់ base case 0។',
      },
    ],
    summary_km:
      'Recursion = មុខងារហៅខ្លួនឯងជាមួយបញ្ហាតូចជាង។ ត្រូវមាន base case ជានិច្ច។ ការតាមដានការហៅ និងតម្លៃត្រឡប់ជួយឲ្យយល់ដំណើរការ។',
    next: 'l6-arrays',
  },
];
