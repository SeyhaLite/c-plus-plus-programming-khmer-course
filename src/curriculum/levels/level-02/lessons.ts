import type { Lesson } from '../../../types';

// ============================================================
// កម្រិត ២ — អថេរ និងទិន្នន័យ (Level 2 — Variables and Data)
// ============================================================

export const level02Lessons: Lesson[] = [
  {
    id: 'l2-variables',
    level_id: 2,
    unit_id: 1,
    title_km: 'អថេរ (Variables) និងថេរ (Constants)',
    title_en: 'Variables and Constants',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 18,
    prerequisites: ['l1-cin-input'],
    objectives_km: [
      'បង្កើតអថេរ និងផ្តល់តម្លៃដំបូង (initialization)',
      'ប្តូរតម្លៃអថេរបាន',
      'ប្រើ const សម្រាប់តម្លៃថេរ',
      'ដឹងពីក្បួនដាក់ឈ្មោះអថេរ',
    ],
    explanation_km: `**អថេរ (variable)** គឺជាកន្លែងផ្ទុកទិន្នន័យដែលមានឈ្មោះ។ ការបង្កើតអថេរត្រូវបញ្ជាក់ **ប្រភេទ (type)** និង **ឈ្មោះ**៖

ការប្រកាសអថេរ៖ \`int age = 20;\` — ប្រភេទ int (ចំនួនគត់) ឈ្មោះ age តម្លៃដំបូង 20។

យើងអាចប្តូរតម្លៃអថេរបានគ្រប់ពេល៖ \`age = 21;\`។ នេះហើយជាមូលហេតុដែលគេហៅថា "អថេរ"។

**ថេរ (constant)** បង្កើតដោយពាក្យ \`const\` មុនប្រភេទ៖ \`const double PI = 3.14159;\` — តម្លៃនេះមិនអាចប្តូរបានទៀតទេ។ បើព្យាយាមប្តូរ compiler នឹងបង្ហាញកំហុស។

ក្បួនដាក់ឈ្មោះអថេរ៖
- ចាប់ផ្តើមដោយអក្សរ ឬសញ្ញា _ (មិនអាចចាប់ផ្តើមដោយលេខ)
- ប្រើបានតែអក្សរ លេខ និង _
- មិនអាចប្រើពាក្យគន្លឹះ (keyword) ដូចជា int, return
- អនុវត្តតាមទម្រង់ **camelCase** ដូចជា studentAge, totalScore`,
    examples: [
      {
        title_km: 'បង្កើត ប្រើ និងប្តូរតម្លៃអថេរ',
        code: `#include <iostream>

int main() {
    int age = 20;              // អថេរ
    const double PI = 3.14;    // ថេរ
    std::cout << age << std::endl;
    age = 21;                  // ប្តូរតម្លៃបាន
    std::cout << age << std::endl;
    std::cout << PI << std::endl;
    return 0;
}`,
        expectedOutput: '20\n21\n3.14\n',
      },
    ],
    commonMistake: {
      wrongCode: `int score;
std::cout << score;   // ប្រើមុនផ្តល់តម្លៃ — តម្លៃមិនអាចទាយបាន!`,
      rightCode: `int score = 0;      // ផ្តល់តម្លៃដំបូងជានិច្ច
std::cout << score;`,
      note_km:
        'អថេរដែលមិនទាន់ initialize មានតម្លៃ "កំធុកស" (garbage) ពី memory ចាស់។ តែងតែផ្តល់តម្លៃដំបូងពេលបង្កើត។',
    },
    diagrams: [
      {
        type: 'boxes',
        title_km: 'អថេរ និងថេរក្នុង memory',
        boxes: [
          { name: 'age', value: '20 → 21', kind: 'int (ប្តូរបាន)' },
          { name: 'PI', value: '3.14', kind: 'const double', constant: true },
        ],
        note_km: 'ប្រអប់ពណ៌លង = const — តម្លៃមិនអាចប្តូរបានទៀតទេ។',
      },
    ],
    exercises: [
      {
        id: 'l2-variables-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    int x = 5;
    x = x + 3;
    std::cout << x << std::endl;
    return 0;
}`,
        expectedOutput: '8\n',
        hints_km: ['x = x + 3 មានន័យថា យកតម្លៃចាស់របស់ x បូក 3 ហើយទុកចូល x វិញ។'],
        explanation_km: 'x ចាប់ផ្តើម 5 រួច x = x + 3 ធ្វើឲ្យ x = 8។',
      },
      {
        id: 'l2-variables-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើបន្ទាត់ណាបង្កើតថេរ (constant) បានត្រឹមត្រូវ?',
        options_km: [
          'const int MAX_USERS = 100;',
          'int const = MAX_USERS;',
          'constant int MAX_USERS = 100;',
          'int MAX_USERS = const 100;',
        ],
        answerIndex: 0,
        hints_km: ['ពាក្យគន្លឹះគឺ const ដាក់មុនប្រភេទ។'],
        explanation_km: 'ទម្រង់ត្រឹមត្រូវគឺ const <type> <name> = <value>;។ C++ មិនមានពាក្យ constant ទេ។',
      },
      {
        id: 'l2-variables-ex3',
        type: 'multiple_choice',
        prompt_km: 'តើឈ្មោះអថេរមួយណា មិនត្រឹមត្រូវតាមក្បួន C++?',
        options_km: ['2ndPlace', '_temp', 'totalScore', 'max_value'],
        answerIndex: 0,
        hints_km: ['ឈ្មោះអថេរមិនអាចចាប់ផ្តើមដោយលេខ។'],
        explanation_km: '2ndPlace ចាប់ផ្តើមដោយលេខ ដូច្នេះមិនត្រឹមត្រូវ។ ឈ្មោះផ្សេងទៀតសុទ្ធតែត្រឹមត្រូវ។',
      },
      {
        id: 'l2-variables-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធី៖ បង្កើតអថេរ int ឈ្មោះ price មានតម្លៃ 500 និង const int TAX = 50 រួចបញ្ចេញផលបូក price + TAX។ បើបញ្ចូលគ្មាន លទ្ធផលត្រូវជា 550។',
        starterCode: `#include <iostream>

int main() {
    // បង្កើត price = 500 និង const TAX = 50

    // បញ្ចេញ price + TAX

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int price = 500;
    const int TAX = 50;
    std::cout << price + TAX << std::endl;
    return 0;
}`,
        testCases: [{ stdin: '', expectedOutput: '550\n' }],
        hints_km: ['ទម្រង់៖ int price = 500; និង const int TAX = 50;', 'cout << price + TAX << std::endl;'],
        explanation_km:
          'អថេរ price អាចប្តូរតម្លៃបាន ឯ const TAX មិនអាច។ ការប្រើ const សម្រាប់តម្លៃមិនគួរប្តូរ ជាការអនុវត្តល្អ។',
      },
    ],
    summary_km:
      'អថេរផ្ទុកទិន្នន័យដែលប្តូរបាន ថេរ (const) មិនប្តូរ។ តែងតែ initialize អថេរ។ ឈ្មោះចាប់ផ្តើមដោយអក្សរ ឬ _ ហើយប្រើ camelCase។',
    next: 'l2-data-types',
  },
  {
    id: 'l2-data-types',
    level_id: 2,
    unit_id: 1,
    title_km: 'ប្រភេទទិន្នន័យមូលដ្ឋាន (int, double, char, bool, string)',
    title_en: 'Basic Data Types',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 20,
    prerequisites: ['l2-variables'],
    objectives_km: [
      'ជ្រើសរើសប្រភេទទិន្នន័យត្រឹមត្រូវសម្រាប់ទិន្នន័យនីមួយៗ',
      'ដឹងពីភាពខុសគ្នារវាង int និង double',
      'ប្រើ char, bool និង std::string',
    ],
    explanation_km: `C++ មានប្រភេទទិន្នន័យមូលដ្ឋានសំខាន់ៗ៖

- **int** — ចំនួនគត់ (គ្មានទសភាគ) ឧ. 42, -7, 0
- **double** — ចំនួនទសភាគ (floating-point) ឧ. 3.14, -0.5
- **char** — អក្សរមួយ ដាក់ក្នុងសញ្ញាសម្រង់មួយ 'a', 'K'
- **bool** — តម្លៃពិត/មិនពិត true ឬ false
- **std::string** — អក្សរជាខ្សែ ដាក់ក្នុងសញ្ញាសម្រង់ពីរ "Hello" (ត្រូវ #include <string>)

ចំណាំសំខាន់៖
- ការចែក int និង int បានលទ្ធផលជា int (កាត់ទសភាគចោល!)៖ \`7 / 2\` = 3 មិនមែន 3.5
- បើចង់បានលទ្ធផលទសភាគ ត្រូវមាន double យ៉ាងតិចម្ខាង៖ \`7.0 / 2\` = 3.5
- bool បញ្ចេញជាលេខ 1 (true) និង 0 (false) តាមលំនាំដើម`,
    examples: [
      {
        title_km: 'ប្រភេទទិន្នន័យទាំងអស់ក្នុងឧទាហរណ៍មួយ',
        code: `#include <iostream>
#include <string>

int main() {
    int count = 42;
    double price = 3.5;
    char grade = 'A';
    bool passed = true;
    std::string name = "Dara";

    std::cout << count << std::endl;
    std::cout << price << std::endl;
    std::cout << grade << std::endl;
    std::cout << passed << std::endl;
    std::cout << name << std::endl;
    return 0;
}`,
        expectedOutput: '42\n3.5\nA\n1\nDara\n',
        note_km: 'passed (bool) បញ្ចេញជាលេខ 1 ព្រោះ true = 1។',
      },
      {
        title_km: 'ការចែក int និង int',
        code: `#include <iostream>

int main() {
    std::cout << 7 / 2 << std::endl;
    std::cout << 7.0 / 2 << std::endl;
    return 0;
}`,
        expectedOutput: '3\n3.5\n',
      },
    ],
    commonMistake: {
      wrongCode: `char c = "A";   // សញ្ញាសម្រង់ពីរ — ខុស! នេះជា string`,
      rightCode: `char c = 'A';   // សញ្ញាសម្រង់មួយ — ត្រឹមត្រូវ`,
      note_km: 'char ប្រើសញ្ញាសម្រង់មួយ \' \' ឯ string ប្រើសញ្ញាសម្រង់ពីរ " "។',
    },
    diagrams: [
      {
        type: 'boxes',
        title_km: 'ប្រភេទទិន្នន័យមូលដ្ឋានទាំង ៥',
        boxes: [
          { name: 'count', value: '42', kind: 'int' },
          { name: 'price', value: '3.5', kind: 'double' },
          { name: 'grade', value: "'A'", kind: 'char' },
          { name: 'passed', value: 'true', kind: 'bool' },
          { name: 'name', value: '"Dara"', kind: 'string' },
        ],
      },
    ],
    exercises: [
      {
        id: 'l2-data-types-ex1',
        type: 'match',
        prompt_km: 'ផ្គូផ្គងតម្លៃទៅនឹងប្រភេទទិន្នន័យត្រឹមត្រូវ៖',
        pairs: [
          { left_km: 'ចំនួនសិស្សក្នុងថ្នាក់ (50)', right: 'int' },
          { left_km: 'តម្លៃទំនិញ (2.75)', right: 'double' },
          { left_km: 'អក្សរពិន្ទុកាត់ (A)', right: 'char' },
          { left_km: 'ឈ្មោះសិស្ស ("Sokha")', right: 'std::string' },
          { left_km: 'បានឆ្លងកាត់ឬអត់ (true)', right: 'bool' },
        ],
        hints_km: ['អក្សរមួយតួប្រើសញ្ញាសម្រង់មួយ។ លេខមានទសភាគប្រើ double។'],
        explanation_km:
          'ចំនួនគត់ → int, ទសភាគ → double, អក្សរមួយ → char, អក្សរជាខ្សែ → std::string, ពិត/មិនពិត → bool។',
      },
      {
        id: 'l2-data-types-ex2',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    std::cout << 9 / 2 << std::endl;
    std::cout << 9 % 2 << std::endl;
    return 0;
}`,
        expectedOutput: '4\n1\n',
        hints_km: [
          'int / int កាត់ទសភាគចោល។',
          '% គឺជា modulo — សំណល់នៃការចែក។ 9 ចែក 2 សំណល់ប៉ុន្មាន?',
        ],
        explanation_km: '9 / 2 = 4.5 ប៉ុន្តែជា int បានត្រឹម 4។ 9 % 2 = 1 (សំណល់)។',
      },
      {
        id: 'l2-data-types-ex3',
        type: 'multiple_choice',
        prompt_km: 'តើ bool ត្រូវបានបញ្ចេញដោយ cout ជាលំនាំដើមយ៉ាងដូចម្តេច?',
        options_km: ['ជាលេខ 1 សម្រាប់ true និង 0 សម្រាប់ false', 'ជាពាក្យ "true" និង "false"', 'ជាអក្សរ T និង F', 'មិនអាចបញ្ចេញបាន'],
        answerIndex: 0,
        hints_km: ['មើលឧទាហរណ៍ខាងលើ — passed បញ្ចេញជាអ្វី?'],
        explanation_km:
          'តាមលំនាំដើម cout បញ្ចេញ bool ជា 1/0។ បើចង់បានពាក្យ true/false ត្រូវប្រើ std::boolalpha។',
      },
      {
        id: 'l2-data-types-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីអានចំនួនគត់ពីរ n និង m ហើយបញ្ចេញផលចែកជាទសភាគ n/m។ ឧ. បើបញ្ចូល "7 2" ត្រូវបញ្ចេញ 3.5។ (គន្លឹះ៖ បំលែងទៅ double មុនចែក)',
        starterCode: `#include <iostream>

int main() {
    int n, m;
    std::cin >> n >> m;
    // បញ្ចេញ n/m ជាទសភាគ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n, m;
    std::cin >> n >> m;
    std::cout << static_cast<double>(n) / m << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '7 2\n', expectedOutput: '3.5\n' },
          { stdin: '10 4\n', expectedOutput: '2.5\n' },
        ],
        hints_km: [
          '7 / 2 ជា int បានត្រឹម 3 — ត្រូវបំលែងទៅ double សិន។',
          'ប្រើ static_cast<double>(n) / m។',
          'ឬគុណនឹង 1.0៖ n * 1.0 / m ក៏ដំណើរការដែរ។',
        ],
        explanation_km:
          'static_cast<double>(n) បំលែង n ទៅ double មុនចែក ធ្វើឲ្យលទ្ធផលជាទសភាគ។ នេះជា type casting ដែលនឹងរៀនលម្អិតក្នុងមេរៀនបន្ទាប់។',
      },
    ],
    summary_km:
      'ប្រភេទមូលដ្ឋាន៖ int (ចំនួនគត់) double (ទសភាគ) char (អក្សរមួយ) bool (ពិត/មិនពិត) std::string (អក្សរជាខ្សែ)។ int/int កាត់ទសភាគចោល។ bool បញ្ចេញជា 1/0។',
    next: 'l2-operators',
  },
  {
    id: 'l2-operators',
    level_id: 2,
    unit_id: 1,
    title_km: 'គណនាការ (Arithmetic Operators)',
    title_en: 'Arithmetic Operators',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 18,
    prerequisites: ['l2-data-types'],
    objectives_km: [
      'ប្រើ + - * / % បានត្រឹមត្រូវ',
      'យល់ពីផលចែក int និង modulo',
      'ប្រើ ++ និង -- បាន',
    ],
    explanation_km: `Operators សម្រាប់គណនា៖
- \`+\` បូក, \`-\` ដក, \`*\` គុណ
- \`/\` ចែក — បើអ្នកទាំងពីរជា int លទ្ធផលកាត់ទសភាគចោល
- \`%\` **modulo** — សំណល់នៃការចែក (មានប្រយោជន៍ខ្លាំង៖ ពិនិត្យលេខគូ/សេស ដកយកខ្ទង់ចុងក្រោយ)
- \`++\` បន្ថែម 1, \`--\` បន្ថយ 1

លំដាប់ប្រតិបត្តិការ (precedence) ដូចគណិតវិទ្យា៖ គុណ/ចែក មុន បូក/ដក។ ប្រើវង់ក្រចក \`( )\` ដើម្បីបញ្ជាក់លំដាប់។

ឧទាហរណ៍ modulo៖
- \`7 % 3\` = 1 (ព្រោះ 7 = 3×2 + 1)
- \`10 % 2\` = 0 → លេខគូ
- \`9 % 2\` = 1 → លេខសេស`,
    examples: [
      {
        title_km: 'Operators ទាំងអស់',
        code: `#include <iostream>

int main() {
    int a = 17, b = 5;
    std::cout << a + b << std::endl;
    std::cout << a - b << std::endl;
    std::cout << a * b << std::endl;
    std::cout << a / b << std::endl;
    std::cout << a % b << std::endl;
    a++;
    std::cout << a << std::endl;
    return 0;
}`,
        expectedOutput: '22\n12\n85\n3\n2\n18\n',
      },
    ],
    commonMistake: {
      wrongCode: `std::cout << 2 + 3 * 4 << std::endl;   // អ្នកខ្លះគិតថា = 20`,
      rightCode: `std::cout << 2 + 3 * 4 << std::endl;   // ត្រឹមត្រូវ = 14 (គុណមុន)`,
      note_km: 'គុណ/ចែក មានអាទិភាពមុន បូក/ដក។ បើចង់បូកមុន ត្រូវដាក់វង់ក្រចក (2 + 3) * 4 = 20។',
    },
    diagrams: [
      {
        type: 'table',
        title_km: 'លទ្ធផលនៃ operators សំខាន់ៗ',
        columns: ['កន្សោម', 'លទ្ធផល', 'ចំណាំ'],
        rows: [
          ['7 / 2', '3', 'int / int កាត់ទសភាគ'],
          ['7 % 2', '1', 'សំណល់ (modulo)'],
          ['7.0 / 2', '3.5', 'មាន double ម្ខាង'],
          ['2 + 3 * 4', '14', 'គុណមុន បូកក្រោយ'],
        ],
      },
    ],
    exercises: [
      {
        id: 'l2-operators-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    std::cout << 10 % 4 << std::endl;
    std::cout << 10 / 4 << std::endl;
    std::cout << (10 + 2) / 4 << std::endl;
    return 0;
}`,
        expectedOutput: '2\n2\n3\n',
        hints_km: ['% ជាសំណល់។ / ជា int កាត់ទសភាគ។ វង់ក្រចកគណនាមុនគេ។'],
        explanation_km: '10 % 4 = 2 (សំណល់), 10 / 4 = 2 (2.5 កាត់ចោល), (10+2)/4 = 12/4 = 3។',
      },
      {
        id: 'l2-operators-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើរបៀបណាពិនិត្យថាចំនួន n ជាលេខសេស?',
        options_km: ['n % 2 == 1', 'n / 2 == 1', 'n % 2 == 0', 'n * 2 == 1'],
        answerIndex: 0,
        hints_km: ['លេខសេសចែក 2 ហើយមានសំណល់។'],
        explanation_km: 'លេខសេសចែកនឹង 2 សល់ 1 ដូច្នេះ n % 2 == 1។ ចំណែក n % 2 == 0 ជាលក្ខខណ្ឌលេខគូ។',
      },
      {
        id: 'l2-operators-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញ operator ដើម្បីយកសំណល់នៃការចែក៖',
        template: `int remainder = 13 {{0}} 4;   // លទ្ធផលគួរតែជា 1`,
        acceptedAnswers: [['%']],
        hints_km: ['សញ្ញាមួយដែលហៅថា modulo។'],
        explanation_km: '% (modulo) ត្រឡប់សំណល់៖ 13 = 4×3 + 1 ដូច្នេះ 13 % 4 = 1។',
      },
      {
        id: 'l2-operators-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីអានចំនួនគត់ n ហើយបញ្ចេញ 1 បើ n ជាលេខគូ ឬ 0 បើ n ជាលេខសេស។ ឧ. បញ្ចូល 4 → បញ្ចេញ 1។',
        starterCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    // បញ្ចេញ 1 បើគូ 0 បើសេស

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    std::cout << (n % 2 == 0) << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '4\n', expectedOutput: '1\n' },
          { stdin: '7\n', expectedOutput: '0\n' },
          { stdin: '0\n', expectedOutput: '1\n' },
        ],
        hints_km: ['n % 2 == 0 ជា bool — cout បញ្ចេញ bool ជា 1/0 ស្រាប់!'],
        explanation_km:
          'ដំណោះស្រាយខ្លី៖ cout << (n % 2 == 0) — bool បញ្ចេញជា 1/0 ដោយស្វ័យប្រវត្តិ។ ចំណាំ 0 ជាលេខគូ។',
      },
    ],
    summary_km:
      '+ - * / % និង ++ --។ int/int កាត់ទសភាគ។ % ជាសំណល់ សំខាន់សម្រាប់ពិនិត្យគូ/សេស។ គុណចែកមុនបូកដក ប្រើ ( ) បញ្ជាក់លំដាប់។',
    next: 'l2-assignment-comparison',
  },
  {
    id: 'l2-assignment-comparison',
    level_id: 2,
    unit_id: 1,
    title_km: 'ការផ្តល់តម្លៃ និងការប្រៀបធៀប',
    title_en: 'Assignment and Comparison',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l2-operators'],
    objectives_km: [
      'ប្រើ = ខុសពី ==',
      'ប្រើ operators ប្រៀបធៀប == != < > <= >=',
      'ប្រើ shorthand += -= *= /=',
    ],
    explanation_km: `**Assignment (=)** ដាក់តម្លៃចូលអថេរ៖ \`x = 5;\`

**Comparison** ប្រៀបធៀបតម្លៃពីរ ហើយត្រឡប់ bool៖
- \`==\` ស្មើ, \`!=\` មិនស្មើ
- \`<\` \`>\` តូចជាង/ធំជាង, \`<=\` \`>=\` តូចជាងឬស្មើ/ធំជាងឬស្មើ

កំហុសដែលកើតឡើងញឹកញាប់បំផុតក្នុង C++៖ ប្រើ \`=\` ជំនួស \`==\` ពេលប្រៀបធៀប។ \`if (x = 5)\` មិនមែនជា "បើ x ស្មើ 5" ទេ — វា **ដាក់** 5 ចូល x!

**Shorthand assignment**៖
- \`x += 3;\` ស្មើនឹង \`x = x + 3;\`
- \`x -= 2;\` \`x *= 4;\` \`x /= 2;\` សុទ្ធតែដូចគ្នា`,
    examples: [
      {
        title_km: 'ប្រៀបធៀបត្រឡប់ជា bool',
        code: `#include <iostream>

int main() {
    int a = 10, b = 20;
    std::cout << (a == b) << std::endl;
    std::cout << (a != b) << std::endl;
    std::cout << (a < b) << std::endl;
    a += 5;
    std::cout << a << std::endl;
    return 0;
}`,
        expectedOutput: '0\n1\n1\n15\n',
        note_km: 'វង់ក្រចកជុំវិញ (a == b) ចាំបាច់ពេលលាយជាមួយ <<។',
      },
    ],
    commonMistake: {
      wrongCode: `if (x = 5) { ... }   // ដាក់ 5 ចូល x — មិនមែនប្រៀបធៀប!`,
      rightCode: `if (x == 5) { ... }  // ប្រៀបធៀប x ជាមួយ 5`,
      note_km: '= ដាក់តម្លៃ == ប្រៀបធៀប។ ចងចាំ៖ "សញ្ញាស្មើពីរ សម្រាប់សួរសំណួរ"។',
    },
    diagrams: [
      {
        type: 'table',
        title_km: '= និង == ខុសគ្នាដាច់ស្រឡះ',
        columns: ['កូដ', 'ន័យ', 'ប្រភេទលទ្ធផល'],
        rows: [
          ['x = 5', 'ដាក់តម្លៃ 5 ចូល x', 'int'],
          ['x == 5', 'សួរ៖ x ស្មើ 5 ទេ?', 'bool'],
          ['x += 3', 'x = x + 3', 'int'],
        ],
        note_km: 'កំហុសល្បីល្បាញ៖ ប្រើ = ក្នុង if (...) ជំនួស ==។',
      },
    ],
    exercises: [
      {
        id: 'l2-assignment-comparison-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    int x = 4;
    x *= 3;
    x -= 2;
    std::cout << x << std::endl;
    std::cout << (x > 9) << std::endl;
    return 0;
}`,
        expectedOutput: '10\n1\n',
        hints_km: ['x *= 3 គឺ x = x * 3។ គណនាម្តងមួយជំហាន។'],
        explanation_km: 'x: 4 → ×3 = 12 → −2 = 10។ 10 > 9 ជា true បញ្ចេញជា 1។',
      },
      {
        id: 'l2-assignment-comparison-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើបន្ទាត់ x = 5; ធ្វើអ្វី?',
        options_km: [
          'ដាក់តម្លៃ 5 ចូលអថេរ x',
          'ពិនិត្យថា x ស្មើ 5 ឬអត់',
          'បញ្ចេញលេខ 5 ទៅអេក្រង់',
          'បង្កើត compiler error',
        ],
        answerIndex: 0,
        hints_km: ['សញ្ញាស្មើមួយ = assignment។'],
        explanation_km: '= ជា assignment operator។ ការប្រៀបធៀបត្រូវប្រើ ==។',
      },
      {
        id: 'l2-assignment-comparison-ex3',
        type: 'find_error',
        prompt_km: 'អ្នកសរសេរកូដចង់ពិនិត្យថា score ស្មើ 100 ប៉ុន្តែមានកំហុស។ ចុចបន្ទាត់ខុស៖',
        code: `#include <iostream>

int main() {
    int score = 100;
    if (score = 100) {
        std::cout << "Perfect!" << std::endl;
    }
    return 0;
}`,
        errorLine: 5,
        fixedLine: '    if (score == 100) {',
        hints_km: ['ប្រៀបធៀបត្រូវការសញ្ញាស្មើពីរ។'],
        explanation_km:
          'បន្ទាត់ 5 ប្រើ = (assignment) ជំនួស == (comparison)។ ក្នុងករណីនេះវា "ដំណើរការ" ប៉ុន្តែវាដាក់ 100 ចូល score ហើយលទ្ធផល if ជា true ជានិច្ច — ជា logic bug ដ៏ល្បី។',
      },
    ],
    summary_km:
      '= ដាក់តម្លៃ == ប្រៀបធៀប។ Operators ប្រៀបធៀបត្រឡប់ជា bool។ += -= *= /= ជា shorthand សម្រាប់គណនាហើយដាក់តម្លៃវិញ។',
    next: 'l2-type-conversion',
  },
  {
    id: 'l2-type-conversion',
    level_id: 2,
    unit_id: 1,
    title_km: 'ការបំលែងប្រភេទទិន្នន័យ (Type Conversion)',
    title_en: 'Type Conversion',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l2-assignment-comparison'],
    objectives_km: [
      'យល់ពី implicit conversion និងហានិភ័យរបស់វា',
      'ប្រើ static_cast ដើម្បីបំលែងប្រភេទដោយចេតនា',
      'ដឹងពេល int ត្រូវកាត់ទសភាគចោល',
    ],
    explanation_km: `**Implicit conversion** កើតឡើងស្វ័យប្រវត្តិពេលលាយប្រភេទផ្សេងគ្នា៖
- \`int\` + \`double\` → លទ្ធផលជា double (int ត្រូវបានបំលែងស្វ័យប្រវត្តិ)
- \`double\` → \`int\` (ពេលដាក់តម្លៃចូល int) → **កាត់ទសភាគចោល** មិនមែនបង្គត់ទេ! ឧ. 3.9 ក្លាយជា 3

**Explicit conversion** ធ្វើដោយចេតនា ដោយប្រើ \`static_cast\`៖

\`static_cast\` ល្អជាងទម្រង់ចាស់ \`(int)x\` (C-style cast) ព្រោះវាងាយស្វែងរក និងពិនិត្យដោយ compiler។

គន្លឹះសំខាន់៖ បើអ្នកចែក int ពីរ ហើយចង់បានទសភាគ ត្រូវ cast ម្ខាងជាមុន៖
\`double result = static_cast<double>(a) / b;\``,
    examples: [
      {
        title_km: 'Implicit និង explicit conversion',
        code: `#include <iostream>

int main() {
    int i = 7;
    double d = 2.0;
    std::cout << i / d << std::endl;
    double x = 3.9;
    int truncated = x;
    std::cout << truncated << std::endl;
    std::cout << static_cast<double>(7) / 2 << std::endl;
    return 0;
}`,
        expectedOutput: '3.5\n3\n3.5\n',
        note_km: '3.9 ក្លាយជា 3 (កាត់ចោល មិនមែនបង្គត់ជា 4)។',
      },
    ],
    commonMistake: {
      wrongCode: `int a = 7, b = 2;
double r = a / b;   // r = 3.0 មិនមែន 3.5 — ចែកជា int មុន!`,
      rightCode: `int a = 7, b = 2;
double r = static_cast<double>(a) / b;   // r = 3.5`,
      note_km: 'ការចែកកើតឡើងមុនការដាក់តម្លៃចូល double។ a/b ជា int/int = 3 រួចទើបបំលែងជា 3.0។ ត្រូវ cast មុនចែក។',
    },
    diagrams: [
      {
        type: 'pipeline',
        title_km: 'double → int កាត់ទសភាគចោល (មិនបង្គត់ទេ)',
        steps: [
          { label_km: 'តម្លៃដើម', sub: 'double 3.9' },
          { label_km: 'បំលែង', sub: 'static_cast<int>' },
          { label_km: 'លទ្ធផល', sub: 'int 3' },
        ],
        note_km: 'ចំណាំ៖ 3.9 ក្លាយជា 3 — កាត់ចោល មិនមែនបង្គត់ជា 4 ទេ។',
      },
    ],
    exercises: [
      {
        id: 'l2-type-conversion-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    double d = 9.7;
    int i = d;
    std::cout << i << std::endl;
    return 0;
}`,
        expectedOutput: '9\n',
        hints_km: ['double → int កាត់ទសភាគចោល មិនមែនបង្គត់ទេ។'],
        explanation_km: '9.7 កាត់ទសភាគចោលបាន 9។ C++ មិនបង្គត់ (round) ស្វ័យប្រវត្តិទេ។',
      },
      {
        id: 'l2-type-conversion-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ static_cast<double>(a) / b ខុសពី a / b យ៉ាងដូចម្តេច (a និង b ជា int)?',
        options_km: [
          'static_cast បំលែង a ទៅ double មុនចែក ដូច្នេះលទ្ធផលមានទសភាគ',
          'លទ្ធផលដូចគ្នាទាំងស្រុង',
          'static_cast បង្គត់លទ្ធផល',
          'a / b លឿនជាងតែត្រឹមត្រូវជាង',
        ],
        answerIndex: 0,
        hints_km: ['គិតអំពីពេលវេលាដែលការចែកកើតឡើង — មុន ឬក្រោយការបំលែង?'],
        explanation_km:
          'Cast ធ្វើឲ្យការចែកកើតឡើងជា double (7.0/2 = 3.5)។ បើគ្មាន cast ការចែក int/int កាត់ទសភាគចោលមុន (7/2 = 3)។',
      },
      {
        id: 'l2-type-conversion-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញពាក្យខ្វះដើម្បីចែកបានលទ្ធផលទសភាគ៖',
        template: `int a = 5, b = 2;
double r = {{0}}<double>(a) / b;`,
        acceptedAnswers: [['static_cast']],
        hints_km: ['ឈ្មោះ cast ស្តង់ដាររបស់ C++ មានពាក្យ static។'],
        explanation_km: 'static_cast<double>(a) ជាវិធីស្តង់ដារក្នុង C++ សម្រាប់បំលែងប្រភេទដោយចេតនា។',
      },
    ],
    summary_km:
      'double → int កាត់ទសភាគចោល។ int/int ចែកជា int។ ប្រើ static_cast ដើម្បីបំលែងដោយចេតនា ជាពិសេសមុនការចែក។',
    next: undefined,
  },
];
