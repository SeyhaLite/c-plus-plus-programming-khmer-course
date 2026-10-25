# មុខងារ (FEATURES)

> គ្រប់មុខងារខាងក្រោម **បានអនុវត្ត និងផ្ទៀងផ្ទាត់ហើយ** (មើល [TESTING.md](./TESTING.md))។ ដែនកំណត់៖ [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md)។

## ១. ការរៀនតាមកម្រិត (Levels ០–១២)

- កម្រិត ០–២៖ ១៣ មេរៀន published ពេញលេញ (ការពន្យល់ ឧទាហរណ៍ compile-verified លំហាត់ សង្ខេប)
- កម្រិត ៣–១២៖ ៥៨ មេរៀន planned — បង្ហាញជា "កំពុងរៀបចំ" ដោយស្មោះត្រង់ មិនអាចចូលបាន
- ការដោះសោតាមលំដាប់ (prerequisites) — មិនអាចចូលមេរៀនដែលមិនទាន់ដោះសោ
- ជ្រើសរើស "កម្រិតសិក្សារបស់ខ្ញុំ" + ការណែនាំមេរៀនបន្ទាប់ស្វ័យប្រវត្តិ
- Placement test (សំណួរ ៨) ណែនាំកម្រិតចាប់ផ្តើម — អាចធ្វើឡើងវិញបាន មិនប៉ះពាល់វឌ្ឍនភាពមេរៀន

## ២. ម៉ាស៊ីនមេរៀន (Lesson engine)

រាល់មេរៀន published មាន៖ គោលបំណង · ការពន្យល់ខ្មែរ (ពាក្យបច្ចេកទេសអង់គ្លេសនៅតែត្រឹមត្រូវ) · ឧទាហរណ៍កូដ + លទ្ធផលរំពឹងទុក (ផ្ទៀងផ្ទាត់ដោយ g++ ក្នុង CI) · កំហុសទូទៅ · លំហាត់ ៣–៤ · សង្ខេប · មេរៀនបន្ទាប់។

**ការបញ្ចប់មេរៀន** ទាមទារឆ្លើយលំហាត់ចាំបាច់ (required) ទាំងអស់ត្រឹមត្រូវ — មិនមែនគ្រាន់តែចុចប៊ូតុង។

## ៣. លំហាត់អន្តរកម្ម ៧ ប្រភេទ

| ប្រភេទ | ការពិពណ៌នា |
| --- | --- |
| multiple_choice | ជ្រើសរើសចម្លើយ |
| fill_blank | បំពេញចន្លោះក្នុងកូដ/អត្ថបទ (accept variants) |
| predict_output | ទាយលទ្ធផលកម្មវិធី (whitespace-tolerant grading) |
| arrange | តម្រៀបបន្ទាត់កូដឡើងវិញ (↑↓ buttons — keyboard accessible) |
| find_error | ចុចបន្ទាត់ដែលមានកំហុស |
| match | ផ្គូផ្គងគោលគំនិត ↔ កូដ |
| code_challenge | សរសេរកម្មវិធីពេញលេញ ផ្ទៀងផ្ទាត់ដោយ test cases ពិត (ត្រូវការ execution consent) |

- **Hints បង្ហាញជាបណ្តើរៗ** (មិនបង្ហាញចម្លើយភ្លាម) · ការណាត់ត្រូវ hints ដែលបានប្រើ
- **មតិភ្លាមៗ** + ការពន្យល់ក្រោយឆ្លើយ · សាកល្បងម្តងទៀតគ្មានដែនកំណត់
- **Review queue** — ចម្លើយខុសត្រូវបានកត់ត្រា; ឆ្លើយត្រូវវិញ → ដកចេញ។ បង្ហាញក្នុង dashboard និងផែនការសិក្សា។

## ៣ប. រូបភាពសិក្សា (Diagrams)

មេរៀន published ទាំង ១៣ មាន **ដ្យាក្រាម SVG ដើម** (បង្កើតដោយកូដ គ្មានទ្រព្យខាងក្រៅ គ្មានអាជ្ញាបណ្ណ)៖
- `pipeline` — ដំណើរការជាជំហាន (compile flow, លំហូរមេរៀន)
- `boxes` — អថេរជាប្រអប់ memory (ឈ្មោះ/តម្លៃ/ប្រភេទ, const សម្គាល់ពណ៌)
- `ioflow` — stdin → អថេរ → stdout
- `table` — តារាង trace/ប្រៀបធៀប (លទ្ធផល operators, = vs ==)

ដ្យាករាមប្ើ CSS variables → ត្រូវនឹង light/dark theme ស្វ័យប្រវត្តិ និង scroll ផ្ដេកលើអេក្រង់តូច។ របៀបបន្ថែម៖ [CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md)។
ទំព័រ បណ្ណាល័យ មានតំណវីដេអូ/ធនធានខាងក្រៅ (សម្គាល់ច្បាស់ថាខាងក្រៅ និងជាអង់គ្លេសភាគច្រើន)។

## ៤. កន្លែងហាត់សរសេរកូដ (Playground)

- CodeMirror 6 (C++ syntax highlighting) + textarea fallback បើ CodeMirror ផ្ទុកមិនបាន
- ដំណើរការកូដពិត៖ **Wandbox API, g++ 13.2, -std=c++17 -Wall -Wextra** — compile errors, stderr, exit codes, timeout (137), ពេលវេលាដំណើរការ បង្ហាញពិត
- **Consent gate** — ផ្ញើកូដតែក្រោយការយល់ព្រមច្បាស់លាស់; ដកបានគ្រប់ពេលក្នុងការកំណត់
- បញ្ចូល stdin · ពិនិត្យ test cases របស់ code challenges · ប៊ូតុង Run/Reset/Copy/Save snippet/Clear output
- Snippets រក្សាទុកក្នុង browser (អតិបរមា ៥០)
- Limits៖ កូដ ≤32KB, output ≤16KB, timeout 20s — មិនក្លែងលទ្ធផលពេលសេវាមិនឆ្លើយតប

## ៥. វឌ្ឍនភាព និងការលើកទឹកចិត្ត

- **XP** ក្បួនច្បាស់លាស់៖ លំហាត់ត្រូវលើកដំបូង +5, បញ្ចប់មេរៀន +25, placement test +15
- **Streak**៖ រៀន ១ ដង/ថ្ងៃ → +1; ខកខាន → ចាប់ពី 1
- **សមិទ្ធផល ១០** មានលក្ខខណ្ឌច្បាស់លាស់ (មើល `src/data/achievements.ts`) — គ្មាន mechanics ដែលពិន័យ ឬរំខានការរៀន
- វឌ្ឍនភាពតាមកម្រិត + សរុប · សកម្មភាពថ្មីៗ · localStorage ជាមួយ schema v1 + migration + sanitization
- **Export/Import JSON** + reset ជាមួយការបញ្ជាក់ពីរដង

## ៦. ការកំណត់ និង accessibility

- Dark/light theme (រក្សាទុក, អនុវត្តមុន render ដើម្បីគ្មាន flash)
- សំឡេង **បិទជាលំនាំដើម** (opt-in) — បង្កើតដោយ WebAudio ភ្លាមៗ គ្មានឯកសារ audio
- Reduced motion setting + គោរព `prefers-reduced-motion`
- Keyboard navigation, focus rings, ARIA labels, live regions, មិនពឹងពាក់តែលើពណ៌ (✓/✗ អក្សរផង)
- អក្សរខ្មែរ Noto Sans Khmer self-hosted, line-height 1.9 សម្រាប់ combining marks

## ៧. រាយការណ៍បញ្ហា (Bug reports)

- ប៊ូតុងនៅគ្រប់ទំព័រ → dialog បង្កើតរបាយការណ៍ diagnostic (app version, route, lesson ID, browser, timestamp ISO 8601)
- **មិនបង្កើត source path/line ក្លែង** — មានតែពី stack trace ពិត; ក្រៅពីនោះ "Not available in production"
- **Redact សម្ងាត់ស្វ័យប្រវត្តិ** (GitHub PAT patterns, bearer/api_key/password values)
- Preview អាចកែបានមុន copy → paste ទៅ GitHub Issue (template `bug_report.yml`)
- គ្មានការ upload ស្វ័យប្រវត្តិ គ្មាន IP

## ៨. បណ្ណាល័យ C++

ឯកសារយោងរហ័សជាភាសាខ្មែរ៖ ប្រភេទទិន្នន័យ, operators, iostream/string, ពាក្យបញ្ជា compile, វចនានុក្រម អង់គ្លេស–ខ្មែរ។
