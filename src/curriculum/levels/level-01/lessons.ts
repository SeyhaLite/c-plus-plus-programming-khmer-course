import type { Lesson } from '../../../types';

// ============================================================
// កម្រិត ១ — មូលដ្ឋាន C++ (Level 1 — C++ Basics)
// ============================================================

export const level01Lessons: Lesson[] = [
  {
    id: 'l1-hello-world',
    level_id: 1,
    unit_id: 1,
    title_km: 'Hello World — កម្មវិធីដំបូងរបស់អ្នក',
    title_en: 'Hello World',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l0-how-to-use'],
    objectives_km: [
      'សរសេរ និងដំណើរការកម្មវិធី C++ ដំបូងបាន',
      'យល់ពីតួនាទីរបស់ #include <iostream> និង std::cout',
      'ដឹងពីសារៈសំខាន់នៃសញ្ញា ; (semicolon)',
    ],
    explanation_km: `កម្មវិធី C++ ដំបូងដែលអ្នកសរសេរ គឺបង្ហាញអក្សរទៅកាន់អេក្រង់។ ចូរមើលកូដខាងក្រោម៖

បន្ទាត់នីមួយៗមានន័យដូចខាងក្រោម៖
- \`#include <iostream>\` — ប្រាប់ compiler ឲ្យនាំចូល **header file** ឈ្មោះ iostream ដែលមានឧបករណ៍សម្រាប់ input/output (ការបញ្ចេញ និងការទទួលទិន្នន័យ)
- \`int main() { ... }\` — **មុខងារ main** គឺជាចំណុចចាប់ផ្តើមនៃរាល់កម្មវិធី C++។ កុំព្យូទ័រចាប់ផ្តើមដំណើរការពីទីនេះ
- \`std::cout << "Hello, World!" << std::endl;\` — បញ្ចេញអក្សរ \`Hello, World!\` ទៅអេក្រង់។ \`std::cout\` មានន័យថា "standard output" ហើយ \`std::endl\` ចុះបន្ទាត់ថ្មី
- \`return 0;\` — ប្រាប់ប្រព័ន្ធថាកម្មវិធីបញ្ចប់ដោយជោគជ័យ

សញ្ញា \`;\` (semicolon) បញ្ចប់ **statement** (សេចក្តីណែនាំ) នីមួយៗ។ បើភ្លេចដាក់វា compiler នឹងបង្ហាញកំហុស។`,
    examples: [
      {
        title_km: 'កម្មវិធី Hello World ពេញលេញ',
        code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
        expectedOutput: 'Hello, World!\n',
        note_km: 'ដំណើរការកូដនេះក្នុងទំព័រ "ហាត់សរសេរកូដ" ដើម្បីមើលលទ្ធផលផ្ទាល់។',
      },
    ],
    commonMistake: {
      wrongCode: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl   // ខ្វះ ;
    return 0;
}`,
      rightCode: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
      note_km:
        'កំហុសទូទៅបំផុតរបស់អ្នកចាប់ផ្តើម៖ ភ្លេចសញ្ញា ; នៅចុង statement។ Compiler នឹងបង្ហាញ "expected \';\' ..." — អានសារនេះឲ្យបានម៉ត់ចត់។',
    },
    exercises: [
      {
        id: 'l1-hello-world-ex1',
        type: 'predict_output',
        prompt_km: 'តើកូដខាងក្រោមបញ្ចេញលទ្ធផលអ្វី?',
        code: `#include <iostream>

int main() {
    std::cout << "Hello, Khmer!" << std::endl;
    return 0;
}`,
        expectedOutput: 'Hello, Khmer!\n',
        hints_km: [
          'std::cout បញ្ចេញអ្វីដែលនៅក្នុងសញ្ញា " "។',
          'ចម្លើយគឺអក្សរនៅក្នុងសញ្ញាសម្រង់ ដោយគ្មានសញ្ញាសម្រង់។',
        ],
        explanation_km:
          'std::cout << "Hello, Khmer!" បញ្ចេញអក្សរ Hello, Khmer! ទៅអេក្រង់ ហើយ std::endl ចុះបន្ទាត់ថ្មី។',
      },
      {
        id: 'l1-hello-world-ex2',
        type: 'fill_blank',
        prompt_km: 'បំពេញកូដខាងក្រោមឲ្យបញ្ចេញ "Hello, World!"៖',
        template: `#include <iostream>

int main() {
    {{0}} << "Hello, World!" << std::endl;
    return 0;
}`,
        acceptedAnswers: [['std::cout']],
        hints_km: ['ឈ្មោះពេញរបស់ "cout" គឺ standard output ហើយវាស្ថិតក្នុង namespace ឈ្មោះ std។'],
        explanation_km:
          'std::cout ជាឧបករណ៍ស្តង់ដារសម្រាប់បញ្ចេញទិន្នន័យទៅអេក្រង់។ std:: ប្រាប់ថា cout ស្ថិតក្នុង namespace std។',
      },
      {
        id: 'l1-hello-world-ex3',
        type: 'multiple_choice',
        prompt_km: 'តើបន្ទាត់ #include <iostream> មានតួនាទីអ្វី?',
        options_km: [
          'នាំចូល header file ដែលមាន std::cout និង std::cin សម្រាប់ input/output',
          'បង្កើតអថេរថ្មីឈ្មោះ iostream',
          'បញ្ចប់កម្មវិធី',
          'បង្ហាញអក្សរ "iostream" ទៅអេក្រង់',
        ],
        answerIndex: 0,
        hints_km: ['ពាក្យ iostream មកពី input + output + stream។'],
        explanation_km:
          'iostream (input output stream) ជា header ដែលផ្តល់ std::cout (បញ្ចេញ) និង std::cin (ទទួល)។ បើមិន include ទេ ការប្រើ cout នឹងបង្កើត compiler error។',
      },
      {
        id: 'l1-hello-world-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីដែលបញ្ចេញអក្សរ "សួស្តី C++" ទៅអេក្រង់ (មួយបន្ទាត់)។ ប្រើ std::cout និង std::endl។',
        starterCode: `#include <iostream>

int main() {
    // សរសេរកូដរបស់អ្នកនៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    std::cout << "សួស្តី C++" << std::endl;
    return 0;
}`,
        testCases: [{ stdin: '', expectedOutput: 'សួស្តី C++\n' }],
        hints_km: [
          'ទម្រង់គឺ៖ std::cout << "អក្សរ" << std::endl;',
          'កុំភ្លេចសញ្ញា ; នៅចុងបន្ទាត់។',
          'ចម្លងឧទាហរណ៍ Hello World ហើយប្តូរតែអក្សរក្នុងសញ្ញាសម្រង់។',
        ],
        explanation_km:
          'អ្នកគ្រាន់តែប្រើ std::cout << "សួស្តី C++" << std::endl; ជាការសរសេរអក្សរខ្មែរក៏ដំណើរការបានដែរ ព្រោះកូដសរសេរជា UTF-8។',
        required: true,
      },
    ],
    summary_km:
      'កម្មវិធី C++ ចាប់ផ្តើមពី int main()។ ប្រើ #include <iostream> ដើម្បីទទួលបាន std::cout សម្រាប់បញ្ចេញអក្សរ។ រាល់ statement ត្រូវបញ្ចប់ដោយសញ្ញា ;។',
    next: 'l1-main-function',
  },
  {
    id: 'l1-main-function',
    level_id: 1,
    unit_id: 1,
    title_km: 'មុខងារ main() និងរចនាសម្ព័ន្ធកម្មវិធី',
    title_en: 'The main() Function',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 12,
    prerequisites: ['l1-hello-world'],
    objectives_km: [
      'យល់ថា main() ជាចំណុចចាប់ផ្តើមនៃកម្មវិធី',
      'ដឹងពីអត្ថន័យរបស់ return 0 និង exit code',
      'ស្គាល់រចនាសម្ព័ន្ធ { } (block)',
    ],
    explanation_km: `រាល់កម្មវិធី C++ ត្រូវមានមុខងារ **main** មួយគត់ជាចំណុចចាប់ផ្តើម។ នៅពេលអ្នកដំណើរការ executable ប្រព័ន្ធចាប់ផ្តើមដំណើរការកូដក្នុង \`main()\` ពីលើចុះក្រោម។

ផ្នែកសំខាន់ៗ៖
- \`int\` មុនឈ្មោះ main មានន័យថា មុខងារនេះ **ត្រឡប់ចំនួនគត់ (int)** មកវិញនៅពេលបញ្ចប់
- \`return 0;\` បញ្ចប់ main ហើយត្រឡប់លេខ 0 — លេខនេះហៅថា **exit code**។ លេខ 0 មានន័យថា "ជោគជ័យ" ចំណែកលេខផ្សេង មានន័យថាមានបញ្ហា
- សញ្ញា \`{ }\` គូបកំណត់ **block** ជាក្រុមនៃ statements។ កូដក្នុង main ត្រូវបានដំណើរការតាមលំដាប់ពីលើចុះក្រោម

ឧទាហរណ៍៖ បើអ្នកដំណើរការកម្មវិធីក្នុង terminal អ្នកអាចពិនិត្យ exit code បាន (លើ Linux/macOS ប្រើ \`echo $?\` ក្រោយដំណើរការ)។`,
    examples: [
      {
        title_km: 'Statements ដំណើរការតាមលំដាប់',
        code: `#include <iostream>

int main() {
    std::cout << "ទី ១" << std::endl;
    std::cout << "ទី ២" << std::endl;
    std::cout << "ទី ៣" << std::endl;
    return 0;
}`,
        expectedOutput: 'ទី ១\nទី ២\nទី ៣\n',
      },
    ],
    exercises: [
      {
        id: 'l1-main-function-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលចេញតាមលំដាប់ណា?',
        code: `#include <iostream>

int main() {
    std::cout << "B" << std::endl;
    std::cout << "A" << std::endl;
    std::cout << "C" << std::endl;
    return 0;
}`,
        expectedOutput: 'B\nA\nC\n',
        hints_km: ['កូដដំណើរការពីបន្ទាត់លើ ចុះក្រោមតាមលំដាប់។'],
        explanation_km: 'Statements ដំណើរការតាមលំដាប់ដែលសរសេរ៖ B មុន A រួច C។',
      },
      {
        id: 'l1-main-function-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ return 0; នៅចុង main មានន័យដូចម្តេច?',
        options_km: [
          'កម្មវិធីបញ្ចប់ដោយជោគជ័យ (exit code 0)',
          'បង្ហាញលេខ 0 ទៅអេក្រង់',
          'បញ្ចប់តែបន្ទាត់នោះ កម្មវិធីនៅដំណើរការបន្ត',
          'កំហុសក្នុងកម្មវិធី',
        ],
        answerIndex: 0,
        hints_km: ['exit code 0 ជាសញ្ញាស្តង់ដារនៃភាពជោគជ័យក្នុងប្រព័ន្ធ Unix/Windows។'],
        explanation_km:
          'return 0 បញ្ចប់ main ហើយប្រាប់ប្រព័ន្ធថាកម្មវិធីជោគជ័យ។ វាមិនបង្ហាញអ្វីទៅអេក្រង់ទេ។',
      },
      {
        id: 'l1-main-function-ex3',
        type: 'find_error',
        prompt_km: 'កូដខាងក្រោមមានកំហុស ១ កន្លែង។ ចុចបន្ទាត់ដែលមានកំហុស៖',
        code: `#include <iostream>

int main() {
    std::cout << "Hello" << std::endl;
    return 0;
}}`,
        errorLine: 6,
        fixedLine: '}',
        hints_km: ['រាប់សញ្ញា { និង } ឲ្យស្មើគ្នា។'],
        explanation_km:
          'បន្ទាត់ទី 6 មាន }} ពីរ — main() ត្រូវការតែមួយ { គូគត់។ សញ្ញា } លើសធ្វើឲ្យ compiler error។',
      },
    ],
    summary_km:
      'main() ជាចំណុចចាប់ផ្តើមនៃកម្មវិធី។ Statements ដំណើរការពីលើចុះក្រោម។ return 0 បញ្ចប់កម្មវិធីដោយជោគជ័យ។',
    next: 'l1-statements-comments',
  },
  {
    id: 'l1-statements-comments',
    level_id: 1,
    unit_id: 1,
    title_km: 'Statements, Semicolons និង Comments',
    title_en: 'Statements and Comments',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 12,
    prerequisites: ['l1-main-function'],
    objectives_km: [
      'សរសេរ comment ដោយប្រើ // និង /* */',
      'យល់ថា compiler មិនអាន comment ទេ',
      'ប្រើសញ្ញា ; បានត្រឹមត្រូវ',
    ],
    explanation_km: `**Comment** គឺជាអត្ថបទដែលយើងសរសេរសម្រាប់មនុស្សអាន — compiler រំលងវាទាំងស្រុង។ Comment មានពីរប្រភេទ៖
- \`// អត្ថបទ\` — comment មួយបន្ទាត់ រហូតដល់ចុងបន្ទាត់
- \`/* អត្ថបទ */\` — comment ច្រើនបន្ទាត់ ចាប់ពី /* ដល់ */

Comment មានប្រយោជន៍សម្រាប់៖
- ពន្យល់ហេតុអ្វីកូដធ្វើអ្វីមួយ (មិនមែនគ្រាន់តែ "ធ្វើអ្វី")
- "បិទ" កូដជាបណ្តោះអាសន្នពេល debug (comment out)

ចំណាំ៖ comment ល្អពន្យល់ **ហេតុផល** មិនមែនគ្រាន់តែបកប្រែកូដទេ។`,
    examples: [
      {
        title_km: 'ប្រភេទ comment ទាំងពីរ',
        code: `#include <iostream>

int main() {
    // នេះជា comment មួយបន្ទាត់
    /* នេះជា
       comment ច្រើនបន្ទាត់ */
    std::cout << "Comments do not run" << std::endl;
    return 0;
}`,
        expectedOutput: 'Comments do not run\n',
        note_km: 'អ្វីៗក្នុង comment មិនត្រូវបានដំណើរការទេ។',
      },
    ],
    commonMistake: {
      wrongCode: `/* បើក comment តែមិនបិទ
std::cout << "This will not compile" << std::endl;`,
      rightCode: `/* បើក comment ហើយបិទ */
std::cout << "This will compile" << std::endl;`,
      note_km: 'បើភ្លេចសញ្ញា */ compiler នឹងស្មានថាកូដបន្ទាប់ស្ថិតក្នុង comment ទាំងអស់ ហើយអាចបង្កើតកំហុសចម្លែក។',
    },
    exercises: [
      {
        id: 'l1-statements-comments-ex1',
        type: 'predict_output',
        prompt_km: 'តើអ្វីដែលបញ្ចេញទៅអេក្រង់?',
        code: `#include <iostream>

int main() {
    // std::cout << "A" << std::endl;
    std::cout << "B" << std::endl;
    /* std::cout << "C" << std::endl; */
    return 0;
}`,
        expectedOutput: 'B\n',
        hints_km: ['បន្ទាត់ណាស្ថិតក្នុង comment នឹងមិនដំណើរការទេ។'],
        explanation_km: 'បន្ទាត់ A និង C ស្ថិតក្នុង comment ដូច្នេះមានតែ B ប៉ុណ្ណោះដែលបញ្ចេញ។',
      },
      {
        id: 'l1-statements-comments-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើ comment មានតួនាទីអ្វី?',
        options_km: [
          'ជួយអ្នកសរសេរកូដ និងក្រុមការងារយល់កូដ — compiler រំលងវា',
          'បង្កើនល្បឿនកម្មវិធី',
          'ធ្វើឲ្យកម្មវិធីបញ្ចេញអក្សរនោះទៅអេក្រង់',
          'ការពារកូដមិនឲ្យអ្នកដទៃមើលឃើញ',
        ],
        answerIndex: 0,
        hints_km: ['Comment គ្មានឥទ្ធិពលលើការដំណើរការនៃកម្មវិធីទេ។'],
        explanation_km: 'Comment សម្រាប់មនុស្សអាន។ វាមិនប៉ះពាល់លទ្ធផល ឬល្បឿនកម្មវិធីទេ។',
      },
      {
        id: 'l1-statements-comments-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញសញ្ញាខ្វះដើម្បីបើក comment មួយបន្ទាត់៖',
        template: `int main() {
    {{0}} នេះជា comment
    return 0;
}`,
        acceptedAnswers: [['//']],
        hints_km: ['សញ្ញា slash ពីរ។'],
        explanation_km: '// បើក comment មួយបន្ទាត់។ អ្វីៗពីក្រោយវារហូតដល់ចុងបន្ទាត់ត្រូវបានរំលង។',
      },
    ],
    summary_km:
      '// សម្រាប់ comment មួយបន្ទាត់ និង /* */ សម្រាប់ច្រើនបន្ទាត់។ Compiler រំលង comment ទាំងស្រុង។ សរសេរ comment ដើម្បីពន្យល់ហេតុផល។',
    next: 'l1-cout-output',
  },
  {
    id: 'l1-cout-output',
    level_id: 1,
    unit_id: 1,
    title_km: 'ការបញ្ចេញទិន្នន័យដោយ std::cout',
    title_en: 'Output with std::cout',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l1-statements-comments'],
    objectives_km: [
      'ប្រើ operator << ដើម្បីភ្ជាប់ទិន្នន័យច្រើនក្នុងបន្ទាត់តែមួយ',
      'ប្រើ std::endl និង "\\n" សម្រាប់ចុះបន្ទាត់',
      'បញ្ចេញលេខ និងអក្សរចម្រុះគ្នា',
    ],
    explanation_km: `\`std::cout\` បញ្ចេញទិន្នន័យទៅអេក្រង់ (standard output)។ Operator \`<<\` អាចភ្ជាប់ទិន្នន័យច្រើនបន្តបន្ទាប់គ្នា៖

សម្រាប់ចុះបន្ទាត់ មានជម្រើសពីរ៖
- \`std::endl\` — ចុះបន្ទាត់ថ្មី (newline)
- \`"\\n"\` — អក្សរ newline ក្នុង string — សាមញ្ញ និងលឿនជាងបន្តិច

អ្នកអាចលាយអក្សរ និងលេខក្នុង cout តែមួយបាន៖ \`std::cout << "តម្លៃ: " << 42 << std::endl;\`

ចំណាំ៖ អក្សរក្នុងសញ្ញាសម្រង់ពីរ \`"..."\` ហៅថា **string literal**។ cout បញ្ចេញវាដូចដែលបានសរសេរ។ បើចង់បញ្ចេញសញ្ញាសម្រង់ខ្លួនឯង ប្រើ \\"\` ដូចជា \`std::cout << "He said \\\\"hi\\\\"\\" << std::endl;\`។`,
    examples: [
      {
        title_km: 'ភ្ជាប់ទិន្នន័យច្រើន',
        code: `#include <iostream>

int main() {
    std::cout << "Name: " << "Dara" << std::endl;
    std::cout << "Age: " << 20 << std::endl;
    std::cout << "Line 1\\nLine 2\\n";
    return 0;
}`,
        expectedOutput: 'Name: Dara\nAge: 20\nLine 1\nLine 2\n',
      },
    ],
    commonMistake: {
      wrongCode: `std::cout << "5 + 3" << std::endl;   // បញ្ចេញអក្សរ 5 + 3`,
      rightCode: `std::cout << 5 + 3 << std::endl;     // បញ្ចេញលេខ 8`,
      note_km:
        'អ្វីដែលដាក់ក្នុងសញ្ញាសម្រង់ គឺជាអក្សរ (string) — មិនមែនការគណនាទេ។ ដកសញ្ញាសម្រង់ចេញ ទើប C++ គណនា 5 + 3។',
    },
    exercises: [
      {
        id: 'l1-cout-output-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    std::cout << "10" << std::endl;
    std::cout << 10 << std::endl;
    return 0;
}`,
        expectedOutput: '10\n10\n',
        hints_km: ['ប្រៀបធៀបអ្វីដែលនៅក្នុង និងក្រៅសញ្ញាសម្រង់។', 'ទាំងពីរបញ្ចេញដូចគ្នានៅលើអេក្រង់!'],
        explanation_km:
          '"10" (string) និង 10 (លេខ) សុទ្ធតែបញ្ចេញជាអក្សរ 10 នៅលើអេក្រង់ — មើលទៅដូចគ្នា ប៉ុន្តែខាងក្នុងខុសគ្នា។',
      },
      {
        id: 'l1-cout-output-ex2',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    std::cout << "2 + 2 = " << 2 + 2 << std::endl;
    return 0;
}`,
        expectedOutput: '2 + 2 = 4\n',
        hints_km: ['ផ្នែកក្នុងសញ្ញាសម្រង់បញ្ចេញដូចការសរសេរ ឯផ្នែកក្រៅត្រូវបានគណនា។'],
        explanation_km:
          'cout ភ្ជាប់ string "2 + 2 = " ជាមួយលទ្ធផលគណនា 2 + 2 = 4 ចេញជា 2 + 2 = 4។',
      },
      {
        id: 'l1-cout-output-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញកូដឲ្យបញ្ចេញបន្ទាត់ពីរដោយប្រើ \\n តែមួយ statement៖',
        template: `std::cout << "Row 1{{0}}Row 2";`,
        acceptedAnswers: [['\\n']],
        hints_km: ['អក្សរសម្រាប់ newline គឺ backslash តាមពីក្រោយដោយអក្សរ n។'],
        explanation_km: '\\n គឺជា escape sequence សម្រាប់ newline ដែលអាចដាក់ក្នុង string បាន។',
      },
      {
        id: 'l1-cout-output-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីដែលបញ្ចេញបន្ទាត់ពីរ៖ បន្ទាត់ទី ១ "C++ Academy" បន្ទាត់ទី ២ "Level 1"។ អ្នកអាចប្រើ cout ពីរដង ឬ \\n។',
        starterCode: `#include <iostream>

int main() {
    // សរសេរកូដនៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    std::cout << "C++ Academy\\nLevel 1" << std::endl;
    return 0;
}`,
        testCases: [{ stdin: '', expectedOutput: 'C++ Academy\nLevel 1\n' }],
        hints_km: [
          'ប្រើ std::endl បន្ទាប់ពីបន្ទាត់ទីមួយ ឬប្រើ \\n ក្នុង string។',
          'ឧទាហរណ៍៖ std::cout << "C++ Academy" << std::endl; ហើយបន្ទាប់មក statement មួយទៀត។',
        ],
        explanation_km: 'អ្នកអាចប្រើ cout ពីរបន្ទាត់ ឬលាយ \\n ក្នុង string តែមួយ — សំខាន់គឺលទ្ធផលចេញពីរបន្ទាត់។',
      },
    ],
    summary_km:
      'std::cout << ភ្ជាប់ទិន្នន័យច្រើនបាន។ អ្វីក្នុងសញ្ញាសម្រង់ជាអក្សរ អ្វីក្រៅសញ្ញាសម្រង់អាចជាលេខ ឬការគណនា។ std::endl និង \\n សុទ្ធតែចុះបន្ទាត់។',
    next: 'l1-cin-input',
  },
  {
    id: 'l1-cin-input',
    level_id: 1,
    unit_id: 1,
    title_km: 'ការទទួលទិន្នន័យដោយ std::cin',
    title_en: 'Input with std::cin',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l1-cout-output'],
    objectives_km: [
      'ប្រើ std::cin >> ដើម្បីអានទិន្នន័យពីអ្នកប្រើ',
      'យល់ពីទិសដៅនៃ operator >> ធៀបនឹង <<',
      'សរសេរកម្មវិធីដែលសួរ ហើយឆ្លើយតបទៅនឹងទិន្នន័យ',
    ],
    explanation_km: `\`std::cin\` (standard input) អានទិន្នន័យដែលអ្នកប្រើបញ្ចូល (ក្នុងគេហទំព័រនេះ អ្នកវាយក្នុងប្រអប់ Input ឬ test case)។

Operator \`>>\` មានទិសដៅផ្ទុយពី \`<<\`៖
- \`std::cout << x;\` — បញ្ចេញ x ទៅអេក្រង់
- \`std::cin >> x;\` — អានទិន្នន័យ ហើយដាក់ចូលក្នុង x

ដើម្បីអាន យើងត្រូវមាន **អថេរ (variable)** ដើម្បីទុកទិន្នន័យ។ ក្នុងមេរៀននេះ ចូរប្រើបែបសាមញ្ញបំផុត៖

លក្ខណៈសំខាន់៖ \`>>\` អានតែ token មួយ (អក្សរមិនមានចន្លោះ ឬលេខមួយ) ហើយរំលងចន្លោះ/បន្ទាត់នៅពីមុខ។ មេរៀនកម្រិត ២ នឹងពន្យល់បន្ថែមអំពីប្រភេទទិន្នន័យ។`,
    examples: [
      {
        title_km: 'អានឈ្មោះ ហើយស្វាគមន៍',
        code: `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Enter your name: ";
    std::cin >> name;
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
        stdin: 'Dara\n',
        expectedOutput: 'Enter your name: Hello, Dara!\n',
        note_km:
          'សំណួរ Enter your name: និងចម្លើយ Hello, Dara! បញ្ចេញតាមលំដាប់។ std::string ទុកអក្សរ (មិនមានចន្លោះ)។',
      },
    ],
    commonMistake: {
      wrongCode: `int age;
age << std::cin;   // ទិសខុស!`,
      rightCode: `int age;
std::cin >> age;   // ទិន្នន័យហូរចូល age`,
      note_km:
        'កំហុសទូទៅ៖ ច្រឡំទិស operator។ ចងចាំ៖ cin ប្រើ >> (ហូរចូលអថេរ) cout ប្រើ << (ហូរចេញទៅអេក្រង់)។',
    },
    exercises: [
      {
        id: 'l1-cin-input-ex1',
        type: 'multiple_choice',
        prompt_km: 'តើបន្ទាត់ណាអានលេខពីអ្នកប្រើ ហើយទុកក្នុងអថេរ score បានត្រឹមត្រូវ?',
        options_km: ['std::cin >> score;', 'std::cout >> score;', 'std::cin << score;', 'score >> std::cin;'],
        answerIndex: 0,
        hints_km: ['cin គូជាមួយ >>។ ទិន្នន័យហូរពីអ្នកប្រើ ចូលទៅអថេរ។'],
        explanation_km:
          'std::cin >> score; អាន token មួយពី input ហើយទុកក្នុង score។ cout ប្រើ << ផ្ទុយទិសគ្នា។',
      },
      {
        id: 'l1-cin-input-ex2',
        type: 'predict_output',
        prompt_km:
          'បើអ្នកប្រើបញ្ចូលលេខ 7 តើលទ្ធផលជាអ្វី? (សន្មតថា input គឺ 7)',
        code: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    std::cout << n * 2 << std::endl;
    return 0;
}`,
        expectedOutput: '14\n',
        hints_km: ['n ទទួលតម្លៃ 7 រួច cout បញ្ចេញ n * 2។'],
        explanation_km: 'cin អាន 7 ទុកក្នុង n ហើយ cout បញ្ចេញ 7 * 2 = 14។',
      },
      {
        id: 'l1-cin-input-ex3',
        type: 'find_error',
        prompt_km: 'កូដខាងក្រោមមានកំហុសទិស operator។ ចុចបន្ទាត់ដែលខុស៖',
        code: `#include <iostream>
#include <string>

int main() {
    std::string word;
    word << std::cin;
    std::cout << word << std::endl;
    return 0;
}`,
        errorLine: 6,
        fixedLine: '    std::cin >> word;',
        hints_km: ['cin ត្រូវគូជាមួយ >> ហើយអថេរនៅខាងស្តាំ។'],
        explanation_km:
          'បន្ទាត់ 6 ប្រើទិសខុស (word << std::cin)។ ត្រឹមត្រូវគឺ std::cin >> word;។',
      },
      {
        id: 'l1-cin-input-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីដែលអានចំនួនគត់មួយពីអ្នកប្រើ ហើយបញ្ចេញផលបូករបស់វាជាមួយលេខ 10។ ឧ. បើបញ្ចូល 5 ត្រូវបញ្ចេញ 15។',
        starterCode: `#include <iostream>

int main() {
    int n;
    // អាន n រួចបញ្ចេញ n + 10

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    std::cout << n + 10 << std::endl;
    return 0;
}`,
        testCases: [
          { stdin: '5\n', expectedOutput: '15\n' },
          { stdin: '-3\n', expectedOutput: '7\n' },
        ],
        hints_km: ['ប្រើ std::cin >> n; ដើម្បីអាន។', 'បញ្ចេញដោយ std::cout << n + 10 << std::endl;'],
        explanation_km:
          'std::cin >> n; អានលេខ រួច std::cout << n + 10 << std::endl; បញ្ចេញផលបូក។ Test ទី ២ (-3 + 10 = 7) ពិនិត្យចំនួនអវិជ្ជមាន។',
      },
    ],
    summary_km:
      'std::cin >> x អានទិន្នន័យចូលអថេរ x។ ចងចាំទិស៖ cin ប្រើ >> (ចូល) cout ប្រើ << (ចេញ)។ >> អានម្តងមួយ token។',
    next: 'l2-variables',
  },
];
