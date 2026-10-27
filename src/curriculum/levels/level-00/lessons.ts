import type { Lesson } from '../../../types';

// ============================================================
// កម្រិត ០ — ការត្រៀមខ្លួន (Level 0 — Getting Ready)
// ============================================================

export const level00Lessons: Lesson[] = [
  {
    id: 'l0-what-is-cpp',
    level_id: 0,
    unit_id: 1,
    title_km: 'តើ C++ ជាអ្វី?',
    title_en: 'What is C++?',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 10,
    prerequisites: [],
    objectives_km: [
      'ពន្យល់បានថា C++ ជាភាសាកម្មវិធី (programming language) ប្រភេទ compiled',
      'ដឹងពីកន្លែងដែលគេប្រើ C++ ក្នុងពិភពពិត',
      'យល់ពីគោលគំនិត "កម្មវិធី (program)" និង "កូដប្រភព (source code)"',
    ],
    explanation_km: `**C++** គឺជាភាសាកម្មវិធី (programming language) មួយដែលត្រូវបានបង្កើតឡើងដោយលោក Bjarne Stroustrup នៅឆ្នាំ 1979។ វាជាភាសាប្រភេទ *compiled language* មានន័យថា កូដដែលយើងសរសេរ ត្រូវបានកម្មវិធីមួយឈ្មោះ **compiler** បកប្រែទៅជាភាសាម៉ាស៊ីន (machine code) ដែលកុំព្យូទ័រអាចដំណើរការបាន។

C++ ត្រូវបានគេប្រើយ៉ាងទូលំទូលាយក្នុង៖
- ហ្គេម (game engines ដូចជា Unreal Engine)
- ប្រព័ន្ធប្រតិបត្តិការ និងកម្មវិធីបញ្ចាប់ (drivers)
- កម្មវិធីដែលត្រូវការល្បឿនលឿន ដូចជា browser (Chrome, Firefox) និង database

**កម្មវិធី (program)** គឺជាសំណុំនៃការណែនាំ (instructions) ដែលប្រាប់កុំព្យូទ័រថាត្រូវធ្វើអ្វី។ យើងសរសេរការណែនាំទាំងនោះជា **កូដប្រភព (source code)** ក្នុងឯកសារអត្ថបទ ដែលច្រើនមានកន្ទុយឯកសារ \`.cpp\`។

ដំណើរការសង្ខេប៖
- យើងសរសេរកូដក្នុងឯកសារ \`hello.cpp\`
- Compiler បកប្រែវាទៅជាឯកសារប្រតិបត្តិ (executable) ដូចជា \`hello.exe\` (Windows) ឬ \`hello\` (Linux/macOS)
- យើងដំណើរការឯកសារ executable នោះ ហើយកុំព្យូទ័របំពេញតាមការណែនាំ`,
    examples: [
      {
        title_km: 'ឯកសារកូដប្រភពដំបូងរបស់អ្នក (គ្រាន់តែមើល — មេរៀនក្រោយនឹងសរសេរវា)',
        code: `#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}`,
        expectedOutput: 'Hello, C++!\n',
        note_km: 'កុំបារម្ភបើអ្នកមិនទាន់យល់ — មេរៀនកម្រិត ១ នឹងពន្យល់បន្ទាត់នីមួយៗ។',
      },
    ],
    commonMistake: {
      wrongCode: 'program.cpp',
      rightCode: 'program.cpp → compile → program (executable)',
      note_km:
        'កំហុសទូទៅ៖ ស្មានថាឯកសារ .cpp ដំណើរការបានដោយផ្ទាល់។ តាមពិត កុំព្យូទ័រមិនអាចដំណើរការ source code បានទេ លុះត្រាតែ compiler បកប្រែវាជា executable ជាមុនសិន។',
    },
    diagrams: [
      {
        type: 'pipeline',
        title_km: 'ដំណើរការពីកូដទៅលទ្ធផល',
        steps: [
          { label_km: 'កូដប្រភព', sub: 'hello.cpp' },
          { label_km: 'Compiler', sub: 'g++' },
          { label_km: 'Executable', sub: 'hello' },
          { label_km: 'ដំណើរការ', sub: './hello' },
        ],
        note_km: 'Compiler បកប្រែកូដទាំងមូលជាមុនសិន ទើបយើងដំណើរការបាន។',
      },
    ],
    exercises: [
      {
        id: 'l0-what-is-cpp-ex1',
        type: 'multiple_choice',
        prompt_km: 'តើ C++ ជាភាសាប្រភេទណា?',
        options_km: [
          'Compiled language — ត្រូវការ compiler បកប្រែទៅជា machine code',
          'ភាសាសម្រាប់តែធ្វើគេហទំព័រ',
          'ភាសាដែលកុំព្យូទ័រដំណើរការដោយផ្ទាល់ដោយមិនត្រូវការអ្វីទាំងអស់',
          'ឈ្មោះកម្មវិធី spreadsheet',
        ],
        answerIndex: 0,
        hints_km: [
          'គិតអំពីពាក្យ "compiler" ដែលបានលើកឡើងក្នុងការពន្យល់។',
          'កូដ C++ ត្រូវបានបកប្រែជាមុន រួចទើបដំណើរការ — មិនមែនបកប្រែម្តងមួយបន្ទាត់ពេលដំណើរការទេ។',
        ],
        explanation_km:
          'C++ ជា compiled language៖ compiler (ឧ. g++) បកប្រែ source code ទាំងមូលទៅជា executable ជាមុន ទើបយើងដំណើរការវាបាន។',
      },
      {
        id: 'l0-what-is-cpp-ex2',
        type: 'match',
        prompt_km: 'ផ្គូផ្គងពាក្យបច្ចេកទេសទៅនឹងនិយមន័យរបស់វា៖',
        pairs: [
          { left_km: 'កូដប្រភព (source code)', right: 'program.cpp' },
          { left_km: 'Compiler', right: 'g++' },
          { left_km: 'ឯកសារប្រតិបត្តិ (executable)', right: 'program.exe' },
          { left_km: 'កន្ទុយឯកសារ C++ ទូទៅ', right: '.cpp' },
        ],
        hints_km: ['ឈ្មោះឯកសារ .cpp គឺជាកូដប្រភព ឯ .exe គឺជាលទ្ធផលក្រោយ compile។'],
        explanation_km:
          'source code (.cpp) → ត្រូវបានបកប្រែដោយ compiler (g++) → ទទួលបាន executable (.exe ឬឯកសារគ្មានកន្ទុយលើ Linux)។',
      },
      {
        id: 'l0-what-is-cpp-ex3',
        type: 'multiple_choice',
        prompt_km: 'តើកម្មវិធីមួយណាខាងក្រោម មិនមែនជាឧទាហរណ៍នៃការប្រើ C++ ក្នុងពិភពពិត?',
        options_km: [
          'Game engine (Unreal Engine)',
          'Web browser (Chrome, Firefox)',
          'Database systems',
          'ការបោះពុម្ពឯកសារលើក្រដាសដោយមិនប្រើកុំព្យូទ័រ',
        ],
        answerIndex: 3,
        hints_km: ['ជម្រើសត្រឹមត្រូវគឺអ្វីដែលមិនពាក់ព័ន្ធនឹងកម្មវិធីកុំព្យូទ័រសោះ។'],
        explanation_km:
          'Game engines, browsers និង databases សុទ្ធតែមានផ្នែកសំខាន់ៗសរសេរដោយ C++ ព្រោះវាត្រូវការល្បឿនខ្ពស់។',
      },
    ],
    summary_km:
      'C++ ជា compiled programming language ដែលមានល្បឿនលឿន និងប្រើក្នុងហ្គេម ប្រព័ន្ធប្រតិបត្តិការ និងកម្មវិធីធំៗ។ យើងសរសេរ source code ក្នុងឯកសារ .cpp ហើយ compiler បកប្រែវាទៅជា executable។',
    next: 'l0-compiler',
  },
  {
    id: 'l0-compiler',
    level_id: 0,
    unit_id: 1,
    title_km: 'តើ Compiler ធ្វើអ្វី?',
    title_en: 'What a Compiler Does',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 12,
    prerequisites: ['l0-what-is-cpp'],
    objectives_km: [
      'ពន្យល់ដំណើរការ compile៖ source code → machine code',
      'ស្គាល់កំហុស syntax និងអានសារ compiler error ជាមូលដ្ឋាន',
      'ដឹងពីជម្រើសសាកល្បងកូដដោយមិនត្រូវដំឡើងអ្វី (online compiler / កន្លែងហាត់សរសេរកូដរបស់គេហទំព័រនេះ)',
    ],
    explanation_km: `**Compiler** គឺជាកម្មវិធីដែលអាន source code របស់យើង ហើយបកប្រែវាទៅជា machine code ដែល CPU យល់។ Compiler ដែលពេញនិយមសម្រាប់ C++ មានដូចជា **g++** (GCC), **clang++**, និង **MSVC** (Visual Studio)។

ដំណើរការសង្ខេប៖
- **Preprocessing** — ដោះស្រាយបន្ទាត់ដែលចាប់ផ្តើមដោយ \`#\` ដូចជា \`#include\`
- **Compilation** — ពិនិត្យ syntax និងបកប្រែកូដ
- **Linking** — ភ្ជាប់កូដរបស់យើងជាមួយ library (ឧ. iostream)

បើកូដមានកំហុស syntax compiler នឹងបញ្ឈរ ហើយបង្ហាញ **compiler error** ជាមួយលេខបន្ទាត់ ដូចជា៖

\`\`\`text
hello.cpp:5:5: error: expected ';' before 'return'
\`\`\`

សារនេះប្រាប់យើងថា៖ ឯកសារ hello.cpp បន្ទាត់ទី 5 ជួរទី 5 ខ្វះសញ្ញា \`;\`។ ការអាន compiler error ឲ្យចេះ គឺជាជំនាញសំខាន់បំផុតមួយរបស់អ្នកសរសេរកូដ។

នៅលើគេហទំព័រនេះ អ្នកអាចហាត់សរសេរ និងដំណើរការកូដបានភ្លាមៗតាមទំព័រ **ហាត់សរសេរកូដ** ដោយមិនចាំបាច់ដំឡើងអ្វីនៅលើម៉ាស៊ីនរបស់អ្នកទេ។`,
    examples: [
      {
        title_km: 'ឧទាហរណ៍ពាក្យបញ្ជា compile នៅលើ terminal',
        code: `g++ -std=c++17 -Wall hello.cpp -o hello
./hello`,
        note_km:
          'បន្ទាត់ទី ១ compile ឯកសារ hello.cpp ទៅជា executable ឈ្មោះ hello។ បន្ទាត់ទី ២ ដំណើរការវា។ -Wall បើកការព្រមាន (warnings) ទាំងអស់។',
      },
      {
        title_km: 'កម្មវិធីដំបូង — មើលលទ្ធផលនៅផ្នែកខាងក្រោម',
        code: `#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}`,
        expectedOutput: 'Hello, C++!\n',
      },
    ],
    diagrams: [
      {
        type: 'pipeline',
        title_km: 'ដំណាក់កាលរបស់ compiler',
        steps: [
          { label_km: 'សរសេរកូដ', sub: '.cpp' },
          { label_km: 'Preprocess', sub: '#include' },
          { label_km: 'Compile', sub: 'ពិនិត្យ syntax' },
          { label_km: 'Link', sub: 'library' },
          { label_km: 'Executable', sub: 'ដំណើរការបាន' },
        ],
        note_km: 'បើមានកំហុស syntax ដំណាក់កាល Compile នឹងបញ្ឈរ ហើយបង្ហាញសារកំហុស។',
      },
    ],
    exercises: [
      {
        id: 'l0-compiler-ex1',
        type: 'multiple_choice',
        prompt_km: 'តើ compiler ធ្វើអ្វី?',
        options_km: [
          'បកប្រែ source code ទៅជា machine code ដែលកុំព្យូទ័រដំណើរការបាន',
          'បង្ហាញគេហទំព័រនៅលើ browser',
          'លុបកំហុសទាំងអស់ចេញពីកូដដោយស្វ័យប្រវត្តិ',
          'ភ្ជាប់អ៊ីនធឺណិតឲ្យកម្មវិធី',
        ],
        answerIndex: 0,
        hints_km: ['Compiler មិនកែកូដឲ្យយើងទេ — វាគ្រាន់តែបកប្រែ និងរាយការណ៍កំហុស។'],
        explanation_km:
          'Compiler បកប្រែកូដ និងរាយការណ៍កំហុស syntax។ វាមិនកែកំហុសឲ្យយើងដោយស្វ័យប្រវត្តិទេ។',
      },
      {
        id: 'l0-compiler-ex2',
        type: 'arrange',
        prompt_km: 'តម្រៀបជំហាននៃដំណើរការពី source code ទៅលទ្ធផល ឲ្យបានត្រូវលំដាប់៖',
        lines: [
          'សរសេរ source code ក្នុងឯកសារ hello.cpp',
          'ដំណើរការ compiler (g++ hello.cpp -o hello)',
          'Compiler ពិនិត្យ syntax និងបកប្រែកូដ',
          'ដំណើរការ executable (./hello) ដើម្បីមើលលទ្ធផល',
        ],
        shuffledOrder: [2, 0, 3, 1],
        hints_km: ['ជំហានដំបូងតែងតែជាការសរសេរកូដ។ ជំហានចុងក្រោយគឺមើលលទ្ធផល។'],
        explanation_km:
          'លំដាប់ត្រឹមត្រូវ៖ សរសេរកូដ → បញ្ជាឲ្យ compiler ធ្វើការ → compiler បកប្រែ → ដំណើរការ executable។',
      },
      {
        id: 'l0-compiler-ex3',
        type: 'multiple_choice',
        prompt_km:
          'Compiler បង្ហាញសារ៖ "hello.cpp:5:5: error: expected \';\' before \'return\'"។ តើសារនេះប្រាប់អ្នកពីអ្វី?',
        options_km: [
          'ឯកសារ hello.cpp បន្ទាត់ទី 5 ខ្វះសញ្ញា ; មុនពាក្យ return',
          'កុំព្យូទ័ររបស់អ្នកខូចហើយ',
          'ត្រូវដំឡើងកម្មវិធីថ្មី',
          'កូដត្រឹមត្រូវហើយ គ្រាន់តែជាការព្រមាន',
        ],
        answerIndex: 0,
        hints_km: ['ទម្រង់សារគឺ៖ ឯកសារ:បន្ទាត់:ជួរ: error: ការពិពណ៌នា។'],
        explanation_km:
          'Compiler error មានទម្រង់ file:line:column។ នៅទីនេះវាប្រាប់ថានៅបន្ទាត់ទី 5 ខ្វះសញ្ញា ; មុនពាក្យ return។',
      },
    ],
    summary_km:
      'Compiler បកប្រែ source code ទៅជា executable។ ពេលមានកំហុស syntax វាបង្ហាញសារជាមួយឈ្មោះឯកសារ លេខបន្ទាត់ និងការពិពណ៌នា។ ការចេះអានសារទាំងនេះជួយឲ្យយើងកែកូដបានលឿន។',
    next: 'l0-how-to-use',
  },
  {
    id: 'l0-how-to-use',
    level_id: 0,
    unit_id: 1,
    title_km: 'របៀបប្រើគេហទំព័រនេះ',
    title_en: 'How to Use This Website',
    status: 'published',
    version: '1.0.0',
    estimated_minutes: 8,
    prerequisites: ['l0-compiler'],
    objectives_km: [
      'ស្គាល់ផ្នែកសំខាន់ៗនៃគេហទំព័រ៖ ផែនការសិក្សា កម្រិតសិក្សា ហាត់សរសេរកូដ និងការកំណត់',
      'យល់ពីរបៀបដែលវឌ្ឍនភាពរបស់អ្នកត្រូវបានរក្សាទុក (ក្នុង browser របស់អ្នកផ្ទាល់)',
      'ដឹងពីរបៀបរាយការណ៍បញ្ហា',
    ],
    explanation_km: `គេហទំព័រនេះរៀបចំជា **កម្រិត (levels)** ពី ០ ដល់ ១២។ កម្រិតនីមួយៗមាន **ខ្នាត (units)** និង **មេរៀន (lessons)**។

របៀបរៀនដែលណែនាំ៖
- ចាប់ផ្តើមពី **មេរៀន** — អានការពន្យល់ មើលឧទាហរណ៍ និងលទ្ធផលរំពឹងទុក
- ធ្វើ **លំហាត់** នៅចុងមេរៀន — ត្រូវឆ្លើយត្រូវទើបមេរៀនចាត់ទុកថាបញ្ចប់
- បើចង់សាកល្បងកូដដោយខ្លួនឯង ទៅកាន់ទំព័រ **ហាត់សរសេរកូដ**
- មិនច្បាស់ថាគួរចាប់ផ្តើមពីកម្រិតណា? ធ្វើ **ពិនិត្យចំណេះដឹង** (placement test)

ចំណាំសំខាន់អំពីទិន្នន័យ៖
- វឌ្ឍនភាពរបស់អ្នក (មេរៀនដែលបញ្ចប់ XP ការកំណត់) ត្រូវបានរក្សាទុកក្នុង **browser របស់អ្នកផ្ទាល់** (localStorage) — មិនមានផ្ញើទៅ server ណាទេ
- បើអ្នកសម្អាត browser data ឬប្តូរឧបករណ៍ វឌ្ឍនភាពអាចបាត់។ អ្នកអាច **នាំចេញ (export)** វឌ្ឍនភាពជាឯកសារ JSON ពីទំព័រការកំណត់ ដើម្បីរក្សាទុក
- កូដដែលអ្នកដំណើរការក្នុងទំព័រ "ហាត់សរសេរកូដ" អាចត្រូវផ្ញើទៅសេវាដំណើរការកូដ (Piston API) — ប៉ុន្តែ **មានសួរការយល់ព្រមជាមុន** និងអ្នកអាចបិទបានគ្រប់ពេល

បើអ្នកជួបបញ្ហា សូមប្រើប៊ូតុង **រាយការណ៍បញ្ហា** នៅគ្រប់ទំព័រ — វាបង្កើតរបាយការណ៍ស្វ័យប្រវត្តិដែលអ្នកអាច copy ទៅដាក់ក្នុង GitHub Issue។`,
    examples: [],
    diagrams: [
      {
        type: 'pipeline',
        title_km: 'រង្វង់នៃការរៀន (Learn → Practice → Feedback)',
        steps: [
          { label_km: 'រៀន', sub: 'អានការពន្យល់' },
          { label_km: 'ហាត់', sub: 'ធ្វើលំហាត់' },
          { label_km: 'មតិ', sub: 'ត្រូវ/ខុសភ្លាមៗ' },
          { label_km: 'ពិនិត្យ', sub: 'កែកំហុស' },
          { label_km: 'ជាប់', sub: 'បញ្ចប់មេរៀន' },
          { label_km: 'បន្ត', sub: 'មេរៀនបន្ទាប់' },
        ],
      },
    ],
    exercises: [
      {
        id: 'l0-how-to-use-ex1',
        type: 'multiple_choice',
        prompt_km: 'តើវឌ្ឍនភាពសិក្សារបស់អ្នកត្រូវបានរក្សាទុកនៅឯណា?',
        options_km: [
          'ក្នុង browser របស់អ្នកផ្ទាល់ (localStorage) — មិនផ្ញើទៅ server',
          'ក្នុងគណនី Google របស់អ្នក',
          'ក្នុង email របស់អ្នក',
          'វាមិនត្រូវបានរក្សាទុកទេ',
        ],
        answerIndex: 0,
        hints_km: ['អានផ្នែក "ចំណាំសំខាន់អំពីទិន្នន័យ" ម្តងទៀត។'],
        explanation_km:
          'វឌ្ឍនភាពទាំងអស់ស្ថិតក្នុង browser របស់អ្នក។ បើសម្អាត browser data វាអាចបាត់ ដូច្នេះគួរ export ទុកជា JSON ពីទំព័រការកំណត់។',
      },
      {
        id: 'l0-how-to-use-ex2',
        type: 'multiple_choice',
        prompt_km: 'តើលក្ខខណ្ឌដើម្បីបញ្ចប់មេរៀនមួយគឺអ្វី?',
        options_km: [
          'ចុចប៊ូតុង "បញ្ចប់" តែមួយដង',
          'ឆ្លើយលំហាត់ចាំបាច់ទាំងអស់បានត្រឹមត្រូវ',
          'អានការពន្យល់ឲ្យចប់',
          'ចំណាយពេលយ៉ាងតិច ៣០ នាទី',
        ],
        answerIndex: 1,
        hints_km: ['ការរៀនពិតប្រាកដទាមទារការអនុវត្ត មិនមែនគ្រាន់តែចុចប៊ូតុងទេ។'],
        explanation_km:
          'មេរៀនចាត់ទុកថាបញ្ចប់ លុះត្រាតែអ្នកឆ្លើយលំហាត់ចាំបាច់ (required) ទាំងអស់បានត្រឹមត្រូវ។ អ្នកអាចសាកល្បងម្តងទៀតបានគ្មានដែនកំណត់។',
      },
      {
        id: 'l0-how-to-use-ex3',
        type: 'fill_blank',
        prompt_km: 'បំពេញពាក្យខ្វះ៖',
        template:
          'បើអ្នកមិនច្បាស់ថាគួរចាប់ផ្តើមពីកម្រិតណា សូមធ្វើ {{0}} ដើម្បីទទួលបានការណែនាំ។ បើជួបបញ្ហាបច្ចេកទេស សូមប្រើប៊ូតុង {{1}}។',
        acceptedAnswers: [
          ['ពិនិត្យចំណេះដឹង', 'placement test', 'តេស្ត'],
          ['រាយការណ៍បញ្ហា', 'bug report', 'រាយការណ៍'],
        ],
        // ចន្លោះនេះជាអត្ថបទខ្មែរ (មិនមែនកូដ C++) — ការវិនិច្ឆ័យត្រូវអត់ឱន
        // ដូចមនុស្ស៖ ទទួលយកពាក្យខ្លីដែលសំដៅធាតុ UI ដូចគ្នា។
        prose: true,
        hints_km: ['ទំព័រមួយមានឈ្មោះថា "ពិនិត្យចំណេះដឹង"។'],
        explanation_km:
          'ពិនិត្យចំណេះដឹង (placement test) ជួយណែនាំកម្រិតចាប់ផ្តើម ហើយប៊ូតុងរាយការណ៍បញ្ហាមាននៅគ្រប់ទំព័រ។',
      },
    ],
    summary_km:
      'រៀនតាមលំដាប់៖ មេរៀន → លំហាត់ → ហាត់សរសេរកូដ។ វឌ្ឍនភាពរក្សាទុកក្នុង browser របស់អ្នក — ចាំ export ទុកពេលចាំបាច់។ មានបញ្ហា? ប្រើប៊ូតុងរាយការណ៍បញ្ហា។',
    next: 'l1-hello-world',
  },
];
