# គោលការណ៍មាតិកា (CONTENT GUIDELINES)

គោលការណ៍សម្រាប់អ្នកនិពន្ធមេរៀន — ដើម្បីរក្សាគុណភាព និងភាពស្មោះត្រង់។

## ១. ភាសា

- ការពន្យល់ទាំងអស់ជា **ភាសាខ្មែរធម្មជាតិ** (មិនមែនការបកប្រែម៉ាស៊ីនទន្ទឹម)។
- ពាក្យបច្ចេកទេសសំខាន់ៗ រក្សាជាអង់គ្លេសក្នុងវង់ក្រចក ឬក្បែរការពន្យល់ខ្មែរ៖ "អថេរ (variable)", "រង្វិលជុំ (loop)"។
- **មិនដែលបកប្រែ**៖ កូដ C++, ស្តង់ដារ library (`std::cout`), compiler options (`-std=c++17`), សារ compiler, កន្ទុយឯកសារ (`.cpp`)។
- អក្សរខ្មែរត្រូវជា Unicode ពិត — មិនមែនរូបភាពអក្សរ។

## ២. រចនាសម្ព័ន្ធមេរៀន (មើល `src/types.ts`)

រាល់មេរៀន published ត្រូវមាន៖
1. `objectives_km` ≥ ២ គោលបំណងដែលអាចវាស់បាន
2. `explanation_km` — ការពន្យល់ខ្មែរ (mini-markdown) ជាមួយឧទាហរណ៍
3. ≥ ១ `examples` ដែលមាន `expectedOutput` (លើកលែងមេរៀន orientation) — **expectedOutput ត្រូវតែជា stdout ពិត** (CI ផ្ទៀងផ្ទាត់ដោយ g++; បើខុស build បរាជ័យ)
4. `commonMistake` — កំហុសទូទៅ + កូដខុស/ត្រូវ + ការពន្យល់ (លើកលែងមានហេតុផល)
5. ≥ ៣ `exercises` ជាមួយ `hints_km` ≥ ១ ក្នុងមួយលំហាត់ និង `explanation_km` ក្រោយឆ្លើយ
6. `summary_km` + `next` ទៅមេរៀនបន្ទាប់

## ៣. លំហាត់

- លំហាត់នីមួយៗពិនិត្យគោលគំនិត **មួយ**។
- multiple_choice: ជម្រើសខុសត្រូវតែ "ជឿជាក់បាន" (plausible misconceptions) មិនមែនជម្រើសល្ងង់។ ≥ ៣ ជម្រើស។
  - **កុំពឹងលើទីតាំង** — app ច្របល់ជម្រើសពេល render (`src/utils/shuffle.ts`) ដូច្នេះ `answerIndex` គ្រាន់តែជាសន្ទស្សន៍ក្នុង array។ កំហុសប្រវត្តិសាស្ត្រ៖ ៩២% នៃលំហាត់ និង ១០០% នៃសំណួរ placement មានចម្លើយនៅ index ០។
  - ព្យាយាមធ្វើឲ្យជម្រើសមាន **ប្រវែងប្រហាក់ប្រហែលគ្នា** — បើចម្លើយត្រូវវែងជាងគេដាច់ អ្នកសិក្សាអាចទាយបានដោយមិនចេះ C++។
- predict_output: expectedOutput ត្រូវគ្នានឹង normalization (trim ចន្លោះចុងបន្ទាត់ និង `\n` ចុងក្រោយ)។ **កុំដាក់បន្ទាត់ទទេខាងក្នុង** លើកលែងតែចង់បង្រៀនពីវាពិតៗ — grader រក្សាបន្ទាត់ទទេ។
- **fill_blank (សំខាន់បំផុត — មូលហេតុនៃកំហុសអ្នកប្រើច្រើនបំផុតកន្លងមក)**៖
  - ដាក់ **គ្រប់ទម្រង់ដែលត្រឹមត្រូវដូចគ្នា** ក្នុង `acceptedAnswers`។ ចម្លើយត្រឹមត្រូវដែលត្រូវបានបដិសេធ គឺជាកំហុសធ្ងន់ធ្ងរបំផុតនៃលំហាត់ប្រភេទនេះ។
    ឧទាហរណ៍៖ សម្រាប់ចន្លោះបន្ថែម ១ ក្នុង `for` ត្រូវដាក់ `['++i', 'i++', 'i += 1', 'i+=1', 'i = i + 1', 'i=i+1']`។
  - grader អត់ឱនដោយស្វ័យប្រវត្តិរួចហើយ៖ ចន្លោះខុសគ្នានៅខាងមុខ/ក្រោយ · NBSP · អក្សរលាក់ (ZWSP/BOM) · អក្សរដូច ASCII (Cyrillic/Greek/fullwidth) · សញ្ញាសម្រង់រុំ · ចន្លោះជុំវិញ operator ដូចគ្នា។ ដូច្នេះ **កុំ** ដាក់ទម្រង់ទាំងនេះដោយខ្លួនឯង។
  - កុំពឹងលើការអត់ឱន case៖ C++ case-sensitive ដូច្នេះ grader **បដិសេធ** `STD::COUT` (ហើយប្រាប់អ្នកសិក្សាពីមូលហេតុ)។
  - បើចន្លោះជា **អត្ថបទ/ពាក្យខ្មែរ** (មិនមែនកូដ) ត្រូវដាក់ `prose: true` — grader នឹងអត់ឱន case និងទទួលយកពាក្យខ្លីដែលសំដៅធាតុដូចគ្នា។
  - template កូដ C++ ត្រូវតែជា ASCII សុទ្ធ **ក្រៅពី comment**។ អក្សរខ្មែរក្នុងកូដ (ក្រៅ comment/string) នឹងមិន compile ទេ — CI មាន test ទប់ស្កាត់។
  - រាល់ចម្លើយក្នុង `acceptedAnswers` ត្រូវបាន CI សាកល្បងថា **ជាប់ពិត** (`tests/curriculum/grading-guards.test.ts`)។
- code_challenge: ត្រូវមាន test cases ≥ ១ (ណែនាំ ២+ រួមទាំង edge case ឧ. ចំនួនអវិជ្ជមាន) និង `solutionCode` ដែល CI ផ្ទៀងផ្ទាត់។
- hints ត្រូវបង្ហាញជាបណ្តើរៗ៖ ជំនួយទី ១ = ទិសដៅ ជំនួយចុង = ជិតចម្លើយ ប៉ុន្តែ **មិនដែលបង្ហាញចម្លើយពេញ** (CI មាន test ទប់ស្កាត់ hint ដែលមានចម្លើយវែង ≥ ៨ អក្សរនៅខាងក្នុង)។

## ៣ប. ដ្យាក្រាម (រូបភាពសិក្សា)

រាល់មេរៀន published គួរមានដ្យាក្រាមយ៉ាងតិច ១។ បន្ថែមក្នុង field `diagrams`៖

```ts
diagrams: [
  { type: 'pipeline', title_km: '…', steps: [{ label_km: '…', sub: 'code' }, …] },
  { type: 'boxes',    title_km: '…', boxes: [{ name: 'age', value: '20', kind: 'int', constant?: true }] },
  { type: 'ioflow',   title_km: '…', input?: '5', variable?: 'n', output: '15' },
  { type: 'table',    title_km: '…', columns: ['…','…'], rows: [['…','…'], …] },
]
```

គោលការណ៍៖ ស្លាកខ្លីៗ (≤ ២០ អក្សរ/បន្ទាត់) · ផ្នែកកូដដាក់ក្នុង `sub`/cells (mono) · ពណ៌យកពី tokens ជានិច្ច (កុំ hardcode) · validation test ត្រួតពិនិត្យ schema ស្វ័យប្រវត្តិ។

## ៤. ការដាក់ស្ថានភាព (status)

- `planned` — មានតែ metadata (title, minutes)។ មិនអាចមាន explanation/exercises ទេ (validation test ទាមទារឲ្យទទេ)។
- `draft` — មានមាតិកាខ្លះ មិនបង្ហាញលើ site។
- `published` — ពេញលេញតាមខ្ទង់ ២ ខាងលើ **ហើយ** ឆ្លង validation + g++ checks។ កុំសម្គាល់ published មុនពេលតេស្តឆ្លង។

## ៥. របៀបបន្ថែមមេរៀនថ្មី (ជំហានៗ)

1. បើក (ឬបង្កើត) `src/curriculum/levels/level-XX/lessons.ts`។ បើមេរៀនមាននៅ `planned-levels.ts` ផ្លាស់ប្តូរវាមក level file ពិត ហើយលុប spec ចេញពី planned។
2. សរសេរ lesson object ពេញលេញតាម schema (id ត្រូវចាប់ផ្តើម `lXX-`)។
3. ភ្ជាប់ក្នុង `src/data/curriculum.ts`៖ import + បន្ថែមទៅ `allLessons` និង unit `lessonIds`។
4. រត់ `npm run validate` និង `npm run check:cpp` (បើមាន g++)។
5. កែ `next` chain និង prerequisites ឲ្យត្រូវ។
6. បើ level ទាំងមូលជាប់ validation ដំបូង — ផ្លាស់ប្តូរ `status: 'planned'` → `'published'` ក្នុង level metadata។
7. បន្ថែមឈ្មោះមេរៀនទៅ `docs/PROGRESS.md` changelog + commit។

## ៦. ការផ្ទៀងផ្ទាត់ស្វ័យប្រវត្តិ

- `tests/curriculum/validate.test.ts` — schema, IDs, prerequisites, cycles, content quality
- `tests/curriculum/cpp-examples.test.ts` + `scripts/check-cpp-examples.ts` — g++ `-std=c++17 -Wall -Wextra -Werror`
- `npm run report` — បង្កើត `reports/curriculum-completeness.md` ឡើងវិញក្រោយប្តូរមាតិកា

## ៧. ស្តង់ដារ C++ និងកម្មវិធីបកប្រែ

- ស្តង់ដារគោលដៅ៖ **C++17** (ឧទាហរណ៍កម្រិត ០–៥ ប្រើតែលក្ខណៈដែលដំណើរការលើ gnu++14 ផងដែរ ដើម្បីធានាភាពឆបគ្នា)។
- Compiler យោង៖ g++ 13 (CI + Wandbox)។ កត់ត្រាកំណែនៅគ្រប់កន្លែងដែលប្រើ។
