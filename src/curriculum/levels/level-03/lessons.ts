import type { Lesson } from '../../../types';

// ============================================================
// កម្រិត ៣ — លក្ខខណ្ឌ និងតក្កវិជ្ជា (Level 3 — Conditionals and Logic)
// ============================================================

export const level03Lessons: Lesson[] = [
  {
    id: 'l3-if-else',
    level_id: 3,
    unit_id: 1,
    title_km: 'if និង else',
    title_en: 'if and else',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l2-type-conversion'],
    objectives_km: [
      'ប្រើ if ដើម្បីដំណើរការកូដតែពេលលក្ខខណ្ឌពិត',
      'ប្រើ else សម្រាប់ករណីផ្ទុយ',
      'យល់ថាលក្ខខណ្ឌត្រូវតែជាប្រភេទ bool',
    ],
    explanation_km: `**if** អនុញ្ញាត្យកម្មវិធីសម្រេចចិត្ត៖ ដំណើរការកូដមួយក្រុម លុះត្រាតែ **លក្ខខណ្ឌ (condition)** មានតម្លៃ \`true\`។

រចនាសម្ព័ន្ធ៖
- \`if (លក្ខខណ្ឌ) { ... }\` — កូដក្នុងវង់ក្រចកដំណើរការតែពេលលក្ខខណ្ឌពិត
- \`else { ... }\` — កូដជំនួស ពេលលក្ខខណ្ឌមិនពិត

លក្ខខណ្ឌច្រើនតែជាការប្រៀបធៀបដែលត្រឡប់ជា \`bool\`៖ \`age >= 18\`, \`score == 100\`, \`n % 2 == 0\`។

ចំណាំសំខាន់៖
- លក្ខខណ្ឌត្រូវដាក់ក្នុងវង់ក្រចក \`( )\` ជានិច្ច
- បើក្នុង if ឬ else មានច្រើន statement ត្រូវដាក់ក្នុងវង់ក្រចកទៀប \`{ }\` — បើមិនដាក់ទេ មានតែបន្ទាត់ទី ១ ប៉ុណ្ណោះដែលស្ថិតក្រោម if`,
    examples: [
      {
        title_km: 'ពិនិត្យអាយុបោះឆ្នោត',
        code: `#include <iostream>

int main() {
    int age = 20;
    if (age >= 18) {
        std::cout << "គ្រប់គ្រាន់សម្រាប់បោះឆ្នោត" << std::endl;
    } else {
        std::cout << "មិនទាន់គ្រប់គ្រាន់ទេ" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'គ្រប់គ្រាន់សម្រាប់បោះឆ្នោត\n',
      },
      {
        title_km: 'អានអាយុពីអ្នកប្រើ',
        code: `#include <iostream>

int main() {
    int age = 0;
    std::cin >> age;
    if (age >= 18) {
        std::cout << "គ្រប់គ្រាន់សម្រាប់បោះឆ្នោត" << std::endl;
    } else {
        std::cout << "មិនទាន់គ្រប់គ្រាន់ទេ" << std::endl;
    }
    return 0;
}`,
        stdin: '15\n',
        expectedOutput: 'មិនទាន់គ្រប់គ្រាន់ទេ\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'លក្ខខណ្ឌដូចគ្នា លទ្ធផលខុសគ្នាតាមតម្លៃ',
        columns: ['age', 'age >= 18', 'branch ដែលដំណើរការ'],
        rows: [
          ['20', 'true', 'if'],
          ['18', 'true', 'if'],
          ['15', 'false', 'else'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `if (x > 5)
    std::cout << "A";
    std::cout << "B";   // បន្ទាត់នេះដំណើរការជានិច្ច!`,
      rightCode: `if (x > 5) {
    std::cout << "A";
    std::cout << "B";   // ទើបស្ថិតក្នុង if ទាំងពីរ
}`,
      note_km:
        'បើមិនដាក់វង់ក្រចកទៀប { } មានតែ statement ទី ១ ទេដែលស្ថិតក្រោម if។ នេះជាប្រភពនៃ logic bug ដែលរកពិបាក។',
    },
    exercises: [
      {
        id: 'l3-if-else-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    int age = 15;
    if (age >= 18) {
        std::cout << "A" << std::endl;
    } else {
        std::cout << "B" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'B\n',
        hints_km: ['ពិនិត្យលក្ខខណ្ឌមុន៖ 15 >= 18 ពិត ឬមិនពិត?', 'បើលក្ខខណ្ឌមិនពិត គឺ else ដែលដំណើរការ។'],
        explanation_km: '15 >= 18 ជា false ដូច្នេះ branch else ដំណើរការ ហើយបញ្ចេញ B។',
      },
      {
        id: 'l3-if-else-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើបន្ទាត់ណាជាទម្រង់ if ត្រឹមត្រូវតាម C++?',
        options_km: [
          'if (x > 5) { std::cout << "A"; }',
          'if x > 5 { std::cout << "A"; }',
          'if (x > 5) then { std::cout << "A"; }',
          'if {x > 5} ( std::cout << "A"; )',
        ],
        answerIndex: 0,
        hints_km: ['លក្ខខណ្ឌត្រូវការវង់ក្រចក ( ) ហើយ C++ គ្មានពាក្យ then ទេ។'],
        explanation_km: 'ទម្រង់ត្រឹមត្រូវគឺ if (លក្ខខណ្ឌ) { ... } — វង់ក្រចកជុំវិញលក្ខខណ្ឌ ហើយគ្មានពាក្យ then ទេ។',
      },
      {
        id: 'l3-if-else-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញពាក្យគន្លឹះខ្វះ ដើម្បីឲ្យកូដបញ្ចេញ "ធ្លាក់" ពេល score < 50៖',
        template: `if (score >= 50) {
    std::cout << "ជាប់";
} {{0}} {
    std::cout << "ធ្លាក់";
}`,
        acceptedAnswers: [['else']],
        hints_km: ['ពាក្យគន្លឹះសម្រាប់ "ករណីផ្ទុយ" មាន ៤ អក្សរ។'],
        explanation_km: 'else គ្របដណ្តប់ករណីដែលលក្ខខណ្ឌរបស់ if មិនពិត (score < 50)។',
      },
      {
        id: 'l3-if-else-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីអានពិន្ទុ n រួចបញ្ចេញ "ជាប់" បើ n >= 50 ឬ "ធ្លាក់" បើមិនដូច្នោះទេ។',
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    // សរសេរ if / else នៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    if (n >= 50) {
        std::cout << "ជាប់" << std::endl;
    } else {
        std::cout << "ធ្លាក់" << std::endl;
    }
    return 0;
}`,
        testCases: [
          { stdin: '60\n', expectedOutput: 'ជាប់\n' },
          { stdin: '40\n', expectedOutput: 'ធ្លាក់\n' },
          { stdin: '50\n', expectedOutput: 'ជាប់\n' },
        ],
        hints_km: [
          'លក្ខខណ្ឌគឺ n >= 50 (ចំណាំ 50 ត្រូវរាប់បញ្ចូលជា "ជាប់")។',
          'ប្រើ else សម្រាប់ករណីធ្លាក់ — កុំសរសេរ if ពីរដាច់ដោយឡែក។',
          'កុំភ្លេច std::endl ឬ \\n នៅចុងបន្ទាត់។',
        ],
        explanation_km:
          'if (n >= 50) គ្របដណ្តប់ទាំងតម្លៃ 50 ខ្លួនឯង (>= មានន័យ "ធំជាង ឬស្មើ") ហើយ else គ្របដណ្តប់តម្លៃនៅសល់ទាំងអស់។',
      },
    ],
    summary_km:
      'if (លក្ខខណ្ឌ) ដំណើរការកូដតែពេលលក្ខខណ្ឌពិត; else គ្របដណ្តប់ករណីផ្ទុយ។ លក្ខខណ្ឌត្រូវជា bool ហើយគួរដាក់កូដក្នុង { } ជានិច្ច។',
    next: 'l3-else-if',
  },
  {
    id: 'l3-else-if',
    level_id: 3,
    unit_id: 1,
    title_km: 'else if និងលក្ខខណ្ឌច្រើន',
    title_en: 'else if chains',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l3-if-else'],
    objectives_km: [
      'ប្រើខ្សែសង្វាក់ else if សម្រាប់លក្ខខណ្ឌច្រើន',
      'យល់ថាលក្ខខណឌត្រូវបានពិនិត្យតាមលំដាប់ ហើយឈប់នៅទីដែលត្រូវដំបូង',
      'ជ្រើសរើសលំដាប់លក្ខខណ្ឌបានត្រឹមត្រូវ',
    ],
    explanation_km: `ពេលលក្ខខណ្ឌមានច្រើនជាងពីរ យើងប្រើ **else if** ជាខ្សែសង្វាក់៖

ចំណុចសំខាន់បំផុត៖ **លំដាប់**។ C++ ពិនិត្យលក្ខខណ្ឌពីលើចុះក្រោម ហើយដំណើរការតែ branch ដំបូងដែលត្រូវ រួចរំលងផ្នែកដែលនៅសល់ទាំងអស់។ ដូច្នេះត្រូវចាប់ផ្តើមពីលក្ខខណ្ឌ "ខ្ពស់បំផុត" ឬ "ជាក់លាក់បំផុត" មុន។

គំរូពិន្ទុជាអក្សរ៖
- \`score >= 90\` → A
- \`score >= 80\` → B
- \`score >= 70\` → C
- ផ្សេងនោះ → D

បើ score = 85 នោះ លក្ខខណ្ឌទី ១ (>= 90) មិនពិត លក្ខខណ្ឌទី ២ (>= 80) ពិត → បាន B ហើយមិនពិនិត្យ >= 70 ទៀតទេ។`,
    examples: [
      {
        title_km: 'ខ្សែសង្វាក់ពិន្ទុជាអក្សរ',
        code: `#include <iostream>

int main() {
    int score = 85;
    if (score >= 90) {
        std::cout << "A" << std::endl;
    } else if (score >= 80) {
        std::cout << "B" << std::endl;
    } else if (score >= 70) {
        std::cout << "C" << std::endl;
    } else {
        std::cout << "D" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'B\n',
        note_km: '85 មិនដល់ 90 ប៉ុន្តែដល់ 80 — លក្ខខណ្ឌដំបូងដែលពិតគឺ >= 80 → B តែមួយគត់។',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'លក្ខខណ្ឌដំបូងដែលពិត កំណត់លទ្ធផល',
        columns: ['score', 'លក្ខខណ្ឌដំបូងដែលពិត', 'លទ្ធផល'],
        rows: [
          ['92', 'score >= 90', 'A'],
          ['85', 'score >= 80', 'B'],
          ['73', 'score >= 70', 'C'],
          ['60', 'គ្មាន (else)', 'D'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `if (score >= 70) {
    std::cout << "C";      // 85 ក៏ជាប់ទីនេះដែរ → ខុស!
} else if (score >= 80) {
    std::cout << "B";      // មិនដល់ទីនេះទេ
}`,
      rightCode: `if (score >= 80) {
    std::cout << "B";
} else if (score >= 70) {
    std::cout << "C";
}`,
      note_km:
        'លំដាប់ខុសធ្វើឲ្យលក្ខខណ្ឌទូលាយជាង "ស៊ី" ករណីដែលគួរជារបស់លក្ខខណ្ឌតឹងជាង។ ចាប់ផ្តើមពីតឹងបំផុត/ខ្ពស់បំផុតជានិច្ច។',
    },
    exercises: [
      {
        id: 'l3-else-if-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    int score = 92;
    if (score >= 90) {
        std::cout << "A" << std::endl;
    } else if (score >= 80) {
        std::cout << "B" << std::endl;
    } else {
        std::cout << "C" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'A\n',
        hints_km: ['ពិនិត្យលក្ខខណ្ឌតាមលំដាប់ — តើអ្វីជាលក្ខខណ្ឌដំបូងដែលពិត?'],
        explanation_km: '92 >= 90 ពិតភ្លាមដំបូង → A ហើយលក្ខខណ្ឌផ្សេងទៀតមិនត្រូវបានពិនិត្យទេ។',
      },
      {
        id: 'l3-else-if-ex2',
        type: 'multiple_choice',
        prompt_km: 'ក្នុងខ្សែសង្វាក់ខាងលើ តើលក្ខខណ្ឌណាជាអ្នក "ចាប់យក" ពិន្ទុ 85?',
        options_km: ['score >= 80', 'score >= 90', 'score >= 70', 'else'],
        answerIndex: 0,
        hints_km: ['85 មិនដល់ 90 ទេ ប៉ុន្តែដល់ 80។'],
        explanation_km: '85 < 90 ដូច្នេះលក្ខខណ្ឌទី ១ មិនពិត; 85 >= 80 ពិត → branch នេះដំណើរការ។',
      },
      {
        id: 'l3-else-if-ex3',
        type: 'arrange',
        prompt_km: 'តម្រៀបជំហានពិនិត្យលក្ខខណ្ឌតាមលំដាប់ (តឹងបំផុតមុន)៖',
        lines: [
          'ពិនិត្យ score >= 90 (A)',
          'ពិនិត្យ score >= 80 (B)',
          'ពិនិត្យ score >= 70 (C)',
          'else → D',
        ],
        shuffledOrder: [2, 0, 3, 1],
        hints_km: ['ចាប់ផ្តើមពីពិន្ទុខ្ពស់បំផុត ចុះមកទាប ហើយ else ចុងក្រោយ។'],
        explanation_km: 'លំដាប់ពីខ្ពស់ទៅទាបធានាថាពិន្ទុនីមួយៗធ្លាក់ចូលកម្រិតត្រឹមត្រូវមួយគត់។',
      },
      {
        id: 'l3-else-if-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីអានពិន្ទុ score រួចបញ្ចេញអក្សរ A (>=90), B (>=80), C (>=70) ឬ D (ក្រៅពីនោះ)។',
        starterCode: `#include <iostream>

int main() {
    int score = 0;
    std::cin >> score;
    // សរសេរខ្សែសង្វាក់ if / else if នៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int score = 0;
    std::cin >> score;
    if (score >= 90) {
        std::cout << "A" << std::endl;
    } else if (score >= 80) {
        std::cout << "B" << std::endl;
    } else if (score >= 70) {
        std::cout << "C" << std::endl;
    } else {
        std::cout << "D" << std::endl;
    }
    return 0;
}`,
        testCases: [
          { stdin: '95\n', expectedOutput: 'A\n' },
          { stdin: '85\n', expectedOutput: 'B\n' },
          { stdin: '75\n', expectedOutput: 'C\n' },
          { stdin: '60\n', expectedOutput: 'D\n' },
        ],
        hints_km: [
          'ចាប់ផ្តើមពី >= 90 មុនគេ។',
          'រាល់ else if ត្រូវមានលក្ខខណ្ឌក្នុងវង់ក្រចក។',
          'else ចុងក្រោយគ្មានលក្ខខណ្ឌទេ — វាគ្របដណ្តប់អ្វីដែលនៅសល់។',
        ],
        explanation_km:
          'ខ្សែសង្វាក់ត្រឹមត្រូវធានាថាពិន្ទុនីមួយៗទទួលបានអក្សរតែមួយ ព្រោះ branch ដំបូងដែលពិតនឹងបញ្ចប់ខ្សែសង្វាក់ភ្លាម។',
      },
    ],
    summary_km:
      'else if ភ្ជាប់លក្ខខណ្ឌច្រើនជាខ្សែសង្វាក់។ លក្ខខណ្ឌត្រូវបានពិនិត្យតាមលំដាប់ ហើយមានតែ branch ដំបូងដែលពិតប៉ុណ្ណោះដែលដំណើរការ — ដូច្នេះលំដាប់ត្រូវចាប់ផ្តើមពីតឹងបំផុត។',
    next: 'l3-switch',
  },
  {
    id: 'l3-switch',
    level_id: 3,
    unit_id: 1,
    title_km: 'switch',
    title_en: 'switch statement',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l3-else-if'],
    objectives_km: [
      'ប្រើ switch/case ជំនួស else if ពេលប្រៀបធៀបតម្លៃជាក់លាក់',
      'យល់ពីតួនាទីរបស់ break និង default',
      'ដឹងពីហានិភ័យ fallthrough',
    ],
    explanation_km: `**switch** ជាជម្រើសស្អាតជាង else if ពេលយើងប្របធៀបតម្លៃ **ជាក់លាក់** (int, char ឬ enum) ជាមួយតម្លៃជាច្រើន៖

រចនាសម្ព័ន្ធ៖
- \`switch (តម្លៃ)\` ហើយ \`case X:\` សម្រាប់តម្លៃនីមួយៗ
- \`break;\` បញ្ចប់ case — បើភ្លេច កម្មវិធីនឹង **fallthrough** ទៅ case បន្ទាប់ដោយស្វ័យប្រវត្តិ!
- \`default:\` ដំណើរការពេលគ្មាន case ណាត្រូវ

ដែនកំណត់៖ switch ប្រៀបធៀបបានតែតម្លៃពិតប្រាកដ (==) ប៉ុណ្ណោះ — មិនអាចប្រើជួរ (>=, <=) ឬប្រភេទ double/string ទេ។`,
    examples: [
      {
        title_km: 'ជ្រើសរើសភេសជ្ជៈ',
        code: `#include <iostream>

int main() {
    int choice = 2;
    switch (choice) {
        case 1:
            std::cout << "កាហ្វេ" << std::endl;
            break;
        case 2:
            std::cout << "តែ" << std::endl;
            break;
        default:
            std::cout << "ទឹក" << std::endl;
            break;
    }
    return 0;
}`,
        expectedOutput: 'តែ\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'តម្លៃ choice → branch',
        columns: ['choice', 'branch', 'លទ្ធផល'],
        rows: [
          ['1', 'case 1', 'កាហ្វេ'],
          ['2', 'case 2', 'តែ'],
          ['9', 'default', 'ទឹក'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `case 1:
    std::cout << "កាហ្វេ";   // ភ្លេច break!
case 2:
    std::cout << "តែ";      // fallthrough → បញ្ចេញទាំងពីរ`,
      rightCode: `case 1:
    std::cout << "កាហ្វេ";
    break;               // ឈប់នៅទីនេះ`,
      note_km:
        'ភ្លេច break គឺជាកំហុស switch ទូទៅបំផុត — កម្មវិធី "ធ្លាក់" ទៅ case បន្ទាប់ ហើយដំណើរការវាបន្ថែមដោយអ្នកមិនចង់។',
    },
    exercises: [
      {
        id: 'l3-switch-ex1',
        type: 'predict_output',
        prompt_km: 'កូដនេះភ្លេច break មួយកន្លែង។ តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    int n = 1;
    switch (n) {
        case 1:
            std::cout << "One" << std::endl;
        case 2:
            std::cout << "Two" << std::endl;
            break;
        default:
            std::cout << "Other" << std::endl;
            break;
    }
    return 0;
}`,
        expectedOutput: 'One\nTwo\n',
        hints_km: ['case 1 គ្មាន break — តើរឿងអ្វីកើតឡើងបន្ទាប់ពីវាបញ្ចេញ One?', 'fallthrough មានន័យថាដំណើរការ case បន្ទាប់ភ្លាម។'],
        explanation_km: 'case 1 បញ្ចេញ One រួច fallthrough ទៅ case 2 បញ្ចេញ Two ទើបឈប់នៅ break។',
      },
      {
        id: 'l3-switch-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើប្រភេទទិន្នន័យណាអាចប្រើក្នុង switch បាន?',
        options_km: ['int និង char', 'double', 'std::string', 'គ្រប់ប្រភេទ'],
        answerIndex: 0,
        hints_km: ['switch ត្រូវការតម្លៃគត់/អក្សរដែលប្រៀបធៀបបានត្រឹមតែដោយ == ប៉ុណ្ណោះ។'],
        explanation_km: 'switch ធ្វើការជាមួយប្រភេទគត់ (int, char, enum)។ double និង string មិនអាចប្រើបានទេ។',
      },
      {
        id: 'l3-switch-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញពាក្យគន្លឹះខ្វះ ដើម្បីឈប់នៅចុង case នីមួយៗ',
        template: `case 1:
    std::cout << "កាហ្វេ";
    {{0}};`,
        acceptedAnswers: [['break']],
        hints_km: ['ពាក្យគន្លឹះ ៥ អក្សរដែលមានន័យថា "ឈប់"។'],
        explanation_km: 'break; បញ្ចប់ case ហើយចាកចេញពី switch — ការពារ fallthrough។',
      },
      {
        id: 'l3-switch-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីអានលេខ 1–3 ហើយបញ្ចេញឈ្មោះភេសជ្ជៈដោយប្រើ switch៖ 1 → "កាហ្វេ", 2 → "តែ", 3 → "ទឹកដោះគោ"។ លេខផ្សេងទាំងអស់ → "ទឹក"។',
        starterCode: `#include <iostream>

int main() {
    int choice = 0;
    std::cin >> choice;
    // សរសេរ switch នៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int choice = 0;
    std::cin >> choice;
    switch (choice) {
        case 1:
            std::cout << "កាហ្វេ" << std::endl;
            break;
        case 2:
            std::cout << "តែ" << std::endl;
            break;
        case 3:
            std::cout << "ទឹកដោះគោ" << std::endl;
            break;
        default:
            std::cout << "ទឹក" << std::endl;
            break;
    }
    return 0;
}`,
        testCases: [
          { stdin: '1\n', expectedOutput: 'កាហ្វេ\n' },
          { stdin: '2\n', expectedOutput: 'តែ\n' },
          { stdin: '9\n', expectedOutput: 'ទឹក\n' },
        ],
        hints_km: ['រាល់ case ត្រូវការ break; បន្ទាប់ពី cout។', 'default គ្របដណ្តប់លេខដែលមិនមែន 1–3។'],
        explanation_km:
          'switch ប្រៀបធៀប choice ជាមួយ case នីមួយៗ; break ធានាថាមានតែជម្រើសមួយប៉ុណ្ណោះដែលបញ្ចេញ; default ជាសុវត្ថិភាពសម្រាប់តម្លៃមិនរំពឹងទុក។',
      },
    ],
    summary_km:
      'switch សម្រាប់ប្រៀបធៀបតម្លៃជាក់លាក់ (int/char)។ រាល់ case ត្រូវការ break ដើម្បីទប់ fallthrough ហើយ default គ្របដណ្តប់ករណីនៅសល់។',
    next: 'l3-logical-ops',
  },
  {
    id: 'l3-logical-ops',
    level_id: 3,
    unit_id: 2,
    title_km: 'Logical operators (&& || !)',
    title_en: 'Logical operators',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 18,
    prerequisites: ['l3-switch'],
    objectives_km: [
      'ប្រើ && (និង), || (ឬ), ! (មិន) ដើម្បីផ្សំលក្ខខណឌ',
      'យល់ពី short-circuit evaluation',
      'ជៀសវាងកំហុស chained comparison',
    ],
    explanation_km: `Logical operators ផ្សំលក្ខខណ្ឌ bool ច្រើនជាមួយគ្នា៖
- \`a && b\` — ពិតលុះត្រាតែ **ទាំងពីរ** ពិត
- \`a || b\` — ពិតបើ **យ៉ាងតិចមួយ** ពិត
- \`!a\` — ផ្ទុយពី a

**Short-circuit**៖ ក្នុង \`a && b\` បើ a មិនពិតទេ b មិនត្រូវបានពិនិត្យសោះ (ព្រោះលទ្ធផលកំណត់រួច)។ ក្នុង \`a || b\` បើ a ពិត b ត្រូវបានរំលង។ នេះមានប្រយោជន៍សម្រាប់ការពារកំហុស ឧ. \`if (ptr != nullptr && *ptr > 0)\`។

កំហុសល្បីល្បាញ៖ **chained comparison** ដូចជា \`5 < x < 10\` មិនធ្វើការដូចគណិតវិទ្យាទេ — C++ គណនា \`(5 < x)\` ជា bool (0 ឬ 1) រួចយកវាទៅប្រៀបធៀបជាមួយ 10 ដែលស្ទើរតែពិតជានិច្ច។ ត្រូវសរសេរ \`x > 5 && x < 10\`។`,
    examples: [
      {
        title_km: 'លក្ខខណ្ឌផ្សំសម្រាប់ជិះកង់ហ្វីធី',
        code: `#include <iostream>

int main() {
    int height = 130;
    int age = 10;
    bool canRide = (height >= 140) || (height >= 120 && age >= 8);
    if (canRide) {
        std::cout << "ជិះបាន" << std::endl;
    } else {
        std::cout << "មិនអាចជិះទេ" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'ជិះបាន\n',
        note_km: '130 < 140 ប៉ុន្តែ 130 >= 120 && 10 >= 8 ពិត → || ធ្វើឲ្យលទ្ធផលពិត។',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'តារាងពិត (truth table)',
        columns: ['a', 'b', 'a && b', 'a || b'],
        rows: [
          ['true', 'true', 'true', 'true'],
          ['true', 'false', 'false', 'true'],
          ['false', 'false', 'false', 'false'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `if (5 < x < 10) { ... }   // ស្ទើរតែពិតជានិច្ច!`,
      rightCode: `if (x > 5 && x < 10) { ... }   // ត្រឹមត្រូវ`,
      note_km:
        '(5 < x) ត្រឡប់ជា 0 ឬ 1 រួចត្រូវបានប្រៀបធៀបជាមួយ 10 — 0 < 10 និង 1 < 10 សុទ្ធតែពិត។ ត្រូវបំបែកជាលក្ខខណ្ឌពីរភ្ជាប់ដោយ &&។',
    },
    exercises: [
      {
        id: 'l3-logical-ops-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    bool a = true;
    bool b = false;
    std::cout << (a && b) << std::endl;
    std::cout << (a || b) << std::endl;
    std::cout << !a << std::endl;
    return 0;
}`,
        expectedOutput: '0\n1\n0\n',
        hints_km: ['bool បញ្ចេញជា 1/0។', '&& ត្រូវការទាំងពីរពិត; || ត្រូវការមួយ; ! ផ្ទុយ។'],
        explanation_km: 'true && false = false (0); true || false = true (1); !true = false (0)។',
      },
      {
        id: 'l3-logical-ops-ex2',
        type: 'multiple_choice',
        prompt_km: 'បើ x = 3 តើ (5 < x < 10) វាយតម្លៃជាអ្វី ហើយហេតុអ្វី?',
        options_km: [
          'true ព្រោះ (5 < 3) = false = 0 ហើយ 0 < 10 ជា true',
          'false ព្រោះ 3 ស្ថិតក្រៅជួរ 5–10',
          'true ព្រោះ 3 ស្ថិតក្នុងជួរ 5–10',
          'compiler error',
        ],
        answerIndex: 0,
        hints_km: ['ចងចាំថា C++ គណនា (5 < x) មុន ជា bool។', '5 < 3 ជា false ដែលស្មើ 0 ហើយ 0 < 10 ពិត។'],
        explanation_km:
          'នេះហើយជាមូលហេតុ chained comparison គ្រោះថ្នាក់៖ លទ្ធផល true ទាំងដែល x មិនស្ថិតក្នុងជួរ។ ប្រើ x > 5 && x < 10 ជំនួស។',
      },
      {
        id: 'l3-logical-ops-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញ operator ដើម្បីទាមទារលក្ខខណ្ឌទាំងពីរពិត៖',
        template: `if (age >= 12 {{0}} hasTicket) {
    std::cout << "ចូលបាន";
}`,
        // `and` ជា alternative token ផ្លូវការរបស់ C++ (ISO 646) — សមមូល ១០០% ជាមួយ &&
        acceptedAnswers: [['&&', 'and']],
        hints_km: [
          'operator "និង" មានសញ្ញាពីរជាប់គ្នា។',
          'ជម្រើសមួយទៀត៖ ពាក្យអង់គ្លេស ៣ អក្សរដែលមានន័យថា "និង"។',
        ],
        explanation_km: '&& ទាមទារឲយលក្ខខណ្ឌទាំងសងខាងពិតទើប if ដំណើរការ។',
      },
      {
        id: 'l3-logical-ops-ex4',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីអាន age និង ticket (0 ឬ 1) រួចបញ្ចេញ "ចូលបាន" លុះត្រាតែ age >= 12 និង ticket == 1; ករណីផ្សេងទេបញ្ចេញ "មិនអាចចូល"។',
        starterCode: `#include <iostream>

int main() {
    int age = 0;
    int ticket = 0;
    std::cin >> age >> ticket;
    // សរសេរលក្ខខណ្ឌផ្សំនៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int age = 0;
    int ticket = 0;
    std::cin >> age >> ticket;
    if (age >= 12 && ticket == 1) {
        std::cout << "ចូលបាន" << std::endl;
    } else {
        std::cout << "មិនអាចចូល" << std::endl;
    }
    return 0;
}`,
        testCases: [
          { stdin: '15 1\n', expectedOutput: 'ចូលបាន\n' },
          { stdin: '10 1\n', expectedOutput: 'មិនអាចចូល\n' },
          { stdin: '20 0\n', expectedOutput: 'មិនអាចចូល\n' },
        ],
        hints_km: ['ប្រើ && រវាងលក្ខខណ្ឌទាំងពីរ។', 'ticket ត្រូវប្រៀបធៀបជាមួយ 1 ដោយ ==។'],
        explanation_km:
          'age >= 12 && ticket == 1 ពិតលុះត្រាតែលក្ខខណ្ឌទាំងពីរពិតនៅពេលតែមួយ — នេះជាអត្ថន័យពិតប្រាកដនៃ "និង"។',
      },
    ],
    summary_km:
      '&& ទាមទារទាំងពីរពិត || ទាមទារមួយពិត ! ផ្ទុយ។ Short-circuit ធ្វើឲ្យការវាយតម្លៃឈប់ភ្លាមពេលលទ្ធផលកំណត់បាន។ កុំសរសេរ chained comparison — ប្រើ && ភ្ជាប់លក្ខខណ្ឌពីរ។',
    next: 'l3-nested-conditions',
  },
  {
    id: 'l3-nested-conditions',
    level_id: 3,
    unit_id: 2,
    title_km: 'លក្ខខណ្ឌបង្កប់ (nested)',
    title_en: 'Nested conditions',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 15,
    prerequisites: ['l3-logical-ops'],
    objectives_km: [
      'ប្រើ if ក្នុង if ដោយសុវត្ថិភាព',
      'យល់ពី dangling else (else ជាប់នឹង if ដែលនៅជិតបំផុត)',
      'ដឹងពេលគួរប្រើ logical operators ជំនួសការបង្កប់',
    ],
    explanation_km: `**Nested conditions** គឺជា if ដែលស្ថិតនៅក្នុង if មួយទៀត។ វាមានប្រយោជន៍ពេលការសម្រេចចិត្តមានជាដំណាក់កាល៖

ក្បួនសំខាន់៖
- **dangling else**៖ \`else\` តែងតែជាប់នឹង \`if\` ដែលនៅ **ជិតបំផុត** ហើយមិនទាន់មាន else — មិនមែន if ខាងក្រៅដែលអ្នកមើលឃើញដំបូងទេ
- ការបង្កប់ជ្រៅពេក (> ២–៣ កម្រិត) ធ្វើឲ្យកូដពិបាកអាន — ច្រើនករណី \`&&\` អាចជំនួសបាន
- វង់ក្រចកទៀប { } ជួយបញ្ជាក់ថា else ជាប់នឹង if ណា`,
    examples: [
      {
        title_km: 'ពិនិត្យឈ្មោះអ្នកប្រើ រួចពិនិត្យពាក្យសម្ងាត់',
        code: `#include <iostream>

int main() {
    bool userOk = true;
    bool passOk = false;
    if (userOk) {
        if (passOk) {
            std::cout << "ស្វាគមន៍" << std::endl;
        } else {
            std::cout << "ពាក្យសម្ងាត់ខុស" << std::endl;
        }
    } else {
        std::cout << "អ្នកប្រើមិនស្គាល់" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'ពាក្យសម្ងាត់ខុស\n',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'ដំណាក់កាលនៃការពិនិត្យ',
        columns: ['userOk', 'passOk', 'លទ្ធផល'],
        rows: [
          ['true', 'true', 'ស្វាគមន៍'],
          ['true', 'false', 'ពាក្យសម្ងាត់ខុស'],
          ['false', '(មិនពិនិត្យ)', 'អ្នកប្រើមិនស្គាល់'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `if (a)
    if (b)
        std::cout << "both";
else                 // else នេះជាប់នឹង if (b) មិនមែន if (a) ទេ!
    std::cout << "not a";`,
      rightCode: `if (a) {
    if (b) {
        std::cout << "both";
    }
} else {
    std::cout << "not a";
}`,
      note_km:
        'Dangling else៖ គ្មានវង់ក្រចកទៀបទេ else ជាប់នឹង if ខាងក្នុង។ ដាក់វង់ក្រចកទៀបឲ្យចបាស់ ដើម្បីបញ្ជាក់អត្ថន័យ។',
    },
    exercises: [
      {
        id: 'l3-nested-conditions-ex1',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី?',
        code: `#include <iostream>

int main() {
    bool outer = true;
    bool inner = true;
    if (outer) {
        if (inner) {
            std::cout << "X" << std::endl;
        } else {
            std::cout << "Y" << std::endl;
        }
    } else {
        std::cout << "Z" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'X\n',
        hints_km: ['ដើរតាមដំណាក់កាល៖ outer ពិត → ចូលក្នុង; inner ពិត → branch ណា?'],
        explanation_km: 'outer និង inner សុទ្ធតែពិត ដូច្នេះ branch ខាងក្នុងបំផុត (X) ដំណើរការ។',
      },
      {
        id: 'l3-nested-conditions-ex2',
        type: 'multiple_choice',
        prompt_km: 'ក្នុងកូដគ្មានវង់ក្រចកទៀបខាងលើ តើ else ជាប់នឹង if ណា?',
        options_km: ['if ខាងក្នុង (ដែលនៅជិតបំផុត)', 'if ខាងក្រៅ', 'if ដែលមានលក្ខខណ្ឌពិត', 'មិនជាប់នឹង if ណាទេ'],
        answerIndex: 0,
        hints_km: ['ច្បាប់ dangling else៖ ជាប់នឹង if ដែលនៅជិតបំផុតដែលមិនទាន់មាន else។'],
        explanation_km: 'C++ ភ្ជាប់ else ទៅនឹង if ជិតបំផុតដែលនៅទំនេរ — នេះហើយជាមូលហេតុដែលវង់ក្រចកទៀបសំខាន់។',
      },
      {
        id: 'l3-nested-conditions-ex3',
        type: 'code_challenge',
        prompt_km:
          'សរសេរកម្មវិធីអាន height និង age។ បើ height >= 140 បញ្ចេញ "ជិះបាន"; ផ្ទុយទេ បើ height >= 120 និង age >= 8 បញ្ចេញ "ជិះជាមួយមនុស្សធំ"; ករណីផ្សេងទៀត "មិនអាចជិះ"។',
        starterCode: `#include <iostream>

int main() {
    int height = 0;
    int age = 0;
    std::cin >> height >> age;
    // សរសេរលក្ខខណ្ឌបង្កប់ / else if នៅទីនេះ

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int height = 0;
    int age = 0;
    std::cin >> height >> age;
    if (height >= 140) {
        std::cout << "ជិះបាន" << std::endl;
    } else if (height >= 120 && age >= 8) {
        std::cout << "ជិះជាមួយមនុស្សធំ" << std::endl;
    } else {
        std::cout << "មិនអាចជិះ" << std::endl;
    }
    return 0;
}`,
        testCases: [
          { stdin: '150 20\n', expectedOutput: 'ជិះបាន\n' },
          { stdin: '130 9\n', expectedOutput: 'ជិះជាមួយមនុស្សធំ\n' },
          { stdin: '110 9\n', expectedOutput: 'មិនអាចជិះ\n' },
        ],
        hints_km: [
          'លក្ខខណ្ឌទី ២ ត្រូវការ && រវាងកម្ពស់ និងអាយុ។',
          'else if ធ្វើឲ្យលក្ខខណ្ឌទី ២ ត្រូវបានពិនិត្យតែពេលលក្ខខណ្ឌទី ១ មិនពិត។',
        ],
        explanation_km:
          'ខ្សែសង្វាក់ if / else if / else គឺជាទម្រង់ស្អាតនៃការបង្កប់ — វាធានាថាករណីនីមួយៗត្រូវបានគ្របដណ្តប់តែម្តងគត់។',
      },
    ],
    summary_km:
      'លក្ខខណឌបង្កប់មានប្រយោជន៍សម្រាប់ការសម្រេចចិត្តជាដំណាក់កាល ប៉ុន្តែត្រូវចងចាំ dangling else និងកុំបង្កប់ជ្រៅពេក។ វង់ក្រចកទៀប { } ធ្វើឲ្យអត្ថន័យច្បាស់។',
    next: 'l3-logic-mistakes',
  },
  {
    id: 'l3-logic-mistakes',
    level_id: 3,
    unit_id: 2,
    title_km: 'កំហុស logic ទូទៅ',
    title_en: 'Common logic mistakes',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 12,
    prerequisites: ['l3-nested-conditions'],
    objectives_km: [
      'ស្គាល់កំហុស logic ដែលកើតឡើងញឹកញាប់បំផុត',
      'ដឹងពីរបៀបប្រៀបធៀបចំនួនទសភាគដោយសុវត្ថិភាព',
      'អនុវត្តការត្រួតពិនិត្យលក្ខខណ្ឌមុនពេល submit',
    ],
    explanation_km: `កំហុស logic គឺជាកំហុសដែល compiler មិនប្រាប់យើងទេ — កម្មវិធីដំណើរការ ប៉ុន្តែលទ្ធផលខុស។ អ្នកត្រូវរៀនស្គាល់វា៖

- **= ជំនួស ==** ក្នុង if — ដាក់តម្លៃជំនួសឲ្យការប្រៀបធៀប
- **ចំណុចព្រំដែនខុស** — \`>\` ជំនួស \`>=\` (បាត់តម្លៃព្រំដែន)
- **លំដាប់លក្ខខណ្ឌខុស** ក្នុងខ្សែសង្វាក់ else if
- **ភ្លេច break** ក្នុង switch
- **ប្រៀបធៀប double ដោយ ==** — ចំនួនទសភាគមានកំហុសបង្គត់ខាងក្នុង ដូច្នេះ \`0.1 + 0.2 == 0.3\` ជា **false**! ប្រើគម្លាតតូចមួយ (tolerance) ជំនួស៖ \`std::abs(a - b) < 1e-9\``,
    examples: [
      {
        title_km: 'ហេតុអ្វី 0.1 + 0.2 មិនស្មើ 0.3',
        code: `#include <iostream>

int main() {
    double a = 0.1 + 0.2;
    if (a == 0.3) {
        std::cout << "ស្មើ" << std::endl;
    } else {
        std::cout << "មិនស្មើទេ" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'មិនស្មើទេ\n',
        note_km: '0.1 + 0.2 = 0.30000000000000004 ក្នុង binary floating-point — កុំប្រៀបធៀប double ដោយ == ទេ។',
      },
    ],
    diagrams: [
      {
        type: 'table',
        title_km: 'កំហុស → ការកែ',
        columns: ['កំហុស', 'ការកែត្រឹមត្រូវ'],
        rows: [
          ['if (x = 5)', 'if (x == 5)'],
          ['5 < x < 10', 'x > 5 && x < 10'],
          ['a == b (double)', 'std::abs(a - b) < 1e-9'],
          ['ភ្លេច break', 'ដាក់ break; រាល់ case'],
        ],
      },
    ],
    commonMistake: {
      wrongCode: `if (score = 100) {   // ដាក់ 100 ចូល score ហើយ if ពិតជានិច្ច
    std::cout << "Perfect";
}`,
      rightCode: `if (score == 100) {  // ប្រៀបធៀបពិតប្រាកដ
    std::cout << "Perfect";
}`,
      note_km: 'កំហុសនេះ compile ឆ្លងផង! ដូច្នេះត្រូវបើក -Wall ដែលព្រមានអំពីវា ហើយអានព្រមានទាំងអស់។',
    },
    exercises: [
      {
        id: 'l3-logic-mistakes-ex1',
        type: 'find_error',
        prompt_km: 'កូដនេះមានកំហុស logic មួយ (compile ឆ្លង ប៉ុន្តែខុសន័យ)។ ចុចបន្ទាត់ខុស៖',
        code: `#include <iostream>

int main() {
    int x = 0;
    if (x = 5) {
        std::cout << "x is five" << std::endl;
    }
    return 0;
}`,
        errorLine: 5,
        fixedLine: '    if (x == 5) {',
        hints_km: ['មើលសញ្ញា = ក្នុងលក្ខខណ្ឌ if។', '= ដាក់តម្លៃ == ប្រៀបធៀប។'],
        explanation_km:
          'if (x = 5) ដាក់ 5 ចូល x ហើយតម្លៃ 5 ជា "ពិត" ក្នុង C++ — ដូច្នេះ branch នេះដំណើរការជានិច្ច។ ត្រូវការ ==។',
      },
      {
        id: 'l3-logic-mistakes-ex2',
        type: 'predict_output',
        prompt_km: 'តើលទ្ធផលជាអ្វី? (ចងចាំគំនិត floating-point)',
        code: `#include <iostream>

int main() {
    double a = 0.1 + 0.2;
    double b = 0.3;
    if (a == b) {
        std::cout << "equal" << std::endl;
    } else {
        std::cout << "not equal" << std::endl;
    }
    return 0;
}`,
        expectedOutput: 'not equal\n',
        hints_km: ['0.1 និង 0.2 មិនអាចតំណាងឲ្យបានត្រឹមត្រូវក្នុង binary ទេ។'],
        explanation_km:
          'a = 0.30000000000000004 ខណៈ b = 0.29999999999999998890... — ខុសគ្នាតិចតួច ប៉ុន្តែ == ទាមទារត្រូវគ្នាទាំងស្រុង។',
      },
      {
        id: 'l3-logic-mistakes-ex3',
        type: 'multiple_choice',
        prompt_km: 'តើរបៀបណាត្រឹមត្រូវសម្រាប់ពិនិត្យថា double ពីរ "ស្មើគ្នា"?',
        options_km: [
          'std::abs(a - b) < 1e-9',
          'a == b',
          'a = b',
          'a.equals(b)',
        ],
        answerIndex: 0,
        hints_km: ['យើងត្រូវការគម្លាតតូចមួយ (tolerance) ជំនួសឲ្យការប្រៀបធៀបត្រឹមត្រូវ។'],
        explanation_km:
          'ការប្រៀបធៀបដោយគម្លាត (tolerance) ទទួលយកភាពខុសគ្នាតិចតួចបំផុតដែលកើតពីការបង្គត់ binary។',
      },
      {
        id: 'l3-logic-mistakes-ex4',
        type: 'multiple_choice',
        prompt_km: 'លក្ខខណ្ឌណាដែលរាប់បញ្ចូលតម្លៃព្រំដែន 50 ខ្លួនឯង?',
        options_km: ['score >= 50', 'score > 50', 'score <= 50 តែមួយគត់', 'score != 50'],
        answerIndex: 0,
        hints_km: ['>= មានន័យថា "ធំជាង ឬស្មើ"។'],
        explanation_km: '>= រាប់បញ្ចូលតម្លៃព្រំដែន; > មិនរាប់ទេ។ កំហុសព្រំដែនបែបនេះគឺជា off-by-one ទូទៅ។',
      },
    ],
    summary_km:
      'កំហុស logic លាក់ខ្លួនពី compiler៖ = ជំនួស ==, ព្រំដែន > vs >=, លំដាប់ else if, ភ្លេច break, និងការប្រៀបធៀប double ដោយ ==។ អានកូដរបស់អ្នកម្តងទៀតដោយភ្នែករបស់អ្នកពិនិត្យ។',
    next: 'l4-for',
  },
];
