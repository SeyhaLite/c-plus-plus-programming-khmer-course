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
- multiple_choice: ជម្រើសខុសត្រូវតែ "ជឿជាក់បាន" (plausible misconceptions) មិនមែនជម្រើសល្ងង់។
- predict_output: expectedOutput ត្រូវគ្នានឹង normalization (trim បន្ទាត់/ចុង)។
- code_challenge: ត្រូវមាន test cases ≥ ១ (ណែនាំ ២+ រួមទាំង edge case ឧ. ចំនួនអវិជ្ជមាន) និង `solutionCode` ដែល CI ផ្ទៀងផ្ទាត់។
- hints ត្រូវបង្ហាញជាបណ្តើរៗ៖ ជំនួយទី ១ = ទិសដៅ ជំនួយចុង = ជិតចម្លើយ ប៉ុន្តែ **មិនដែលបង្ហាញចម្លើយពេញ**។

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

- ស្តង់ដារគោលដៅ៖ **C++17** (ឧទាហរណ៍កម្រិត ០–២ ប្រើតែលក្ខណៈដែលដំណើរការលើ gnu++14 ផងដែរ ដើម្បីធានាភាពឆបគ្នា)។
- Compiler យោង៖ g++ 13 (CI + Wandbox)។ កត់ត្រាកំណែនៅគ្រប់កន្លែងដែលប្រើ។
