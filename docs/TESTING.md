# ការធ្វើតេស្ត (TESTING)

## ពាក្យបញ្ជា

| ពាក្យបញ្ជា | អ្វីដែលវាធ្វើ |
| --- | --- |
| `npm test` | តេស្តទាំងអស់ (unit + curriculum + integration + security) ដោយ vitest |
| `npm run validate` | តែ curriculum validation (`tests/curriculum/`) |
| `npm run typecheck` | TypeScript strict ពេញ project |
| `npm run check:cpp` | compile + run ឧទាហរណ៍ C++ ទាំងអស់ដោយ g++ ពិត (skip បើគ្មាន g++) |
| `npm run build` | typecheck + vite build |

## លទ្ធផលជាក់ស្តែង (រត់ក្នុង sandbox ឆ្នាំ ២០២៦-១០-២៥)

```
Test Files  7 passed (7)
     Tests  90 passed | 20 skipped (110)
```

- 20 skipped = តេស្ត compile C++ (គ្មាន g++ ក្នុង sandbox នោះ) — **រត់ពេញក្នុង CI** (ubuntu-latest មាន g++ 13)។
- typecheck: 0 errors · build: សំណេចដោយជោគជ័យ (main 135KB raw / 48KB gzip; codemirror chunk 522KB / 170KB gzip lazy)។

## ការគ្របដណ្តប់តាមប្រភេទ

### Unit (`tests/unit/`)
- **grading-markdown.test.ts** — ការប្រៀបធៀប output (whitespace/CRLF-tolerant), ចម្លើយ code/blank (variants, case-insensitive), markdown renderer គ្មាន XSS (escape មុន render, inline code, fenced blocks)
- **storage.test.ts** — load/save/round-trip, storage មិនអាចប្រើ, QuotaExceeded, JSON ខូច, migration v0→v1, clamping, oversized snippets, export/import ( hostile payloads ), reset
- **diagnostics.test.ts** — redaction (GitHub PAT, bearer, api_key/password), មិន redact កូដ C++ ធម្មតា, source location ពី stack trace ពិតតែប៉ុណ្ណោះ (node_modules frames ត្រូវរំលង), report shape + ISO timestamp, "usability report" vs "runtime error"

### Curriculum (`tests/curriculum/`)
- **validate.test.ts** (27 tests) — unique IDs, unit↔lesson consistency, status values, semver, prerequisite integrity (existing, published-only, no cycles), next chain, content quality (titles/explanation/objectives/summary lengths), exercise schema validity គ្រប់ប្រភេទ (answerIndex range, placeholder counts, permutations, errorLine range…), planned lessons មិនមានមាតិកាក្លែង
- **cpp-examples.test.ts** — ឧទាហរណ៍ published ទាំងអស់ដែលមាន expectedOutput ត្រូវ compile+run ដោយ g++ `-std=c++17 -Wall -Wextra -Werror` ហើយ stdout ត្រូវនឹង fixture ពិតប្រាកដ; code_challenge solutions ត្រូវឆ្លង test cases របស់វា

### Integration (`tests/integration/`, happy-dom)
- លំហាត់គ្រប់ប្រភេទ (លើកលែង code_challenge ដែលត្រូវការ network — មើលខាងក្រោម)៖ grade, retry, review queue add/remove, progressive hints, XP persistence
- Lesson route៖ published render, planned → "កំពុងរៀបចំ", locked → prerequisite list, unlock ក្រោយបញ្ចប់ prerequisite, 404
- Lesson completion flow ពេញលេញ៖ ដោះស្រាយលំហាត់ទាំងអស់តាម DOM → completedLessons + achievement + localStorage persistence → "អបអរសាទរ" + មេរៀនបន្ទាប់
- Progress រស់រានឆ្លងកាត់ simulated refresh (initProgress ពី localStorage)
- Level detail pages (published + planned)

### Security (`tests/security/`)
- Prototype pollution (`__proto__` payloads) — Object.prototype នៅស្អាត
- រចនាសម្ព័ន្ធ weird/cyclic, oversized strings, non-array collections
- Redaction edge cases
- Execution limits បដិសេធ oversized code/stdin **មុន** network call

## អ្វីដែលមិនទាន់មាន (ដោយស្មោះត្រង់)

- **E2E លើ browser ពិត** (Playwright) — មិនទាន់; integration tests ក្នុង happy-dom គ្របដណ្តប់ flows ចម្បង។ Browser-stack ពិត (mobile viewport testing) គឺជាការងារ manual ឥឡូវនេះ។
- **តេស្ត code_challenge ជាមួយ network ពិត** — មិនរត់ក្នុង CI (ពឹងផ្អែកសេវាខាងក្រៅមិនសមនឹង deterministic CI)។ បានផ្ទៀងផ្ទាត់ដោយដៃម្តងរួចហើយ (Wandbox g++ 13.2, ២០២៦-១០-២៥)។
- **Contrast/axe automated checks** — tokens បានរចនាដោយដៃសម្រាប់ contrast; ការស្កេនដោយឧបករណ៍ស្វ័យប្រវត្តិនៅឡើយ។
