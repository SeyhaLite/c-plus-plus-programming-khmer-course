# កំណត់ហេតុវឌ្ឍនភាព (PROGRESS / Development Log)

ស្ថានភាពបច្ចុប្បន្ន៖ **v1.0.0 — បាន push ទៅ GitHub; CI ឆ្លងជោគជ័យ; រង់ចាំបើក GitHub Pages (មើលខាងក្រោម)** · តេស្ត ៩០ ឆ្លងក្នុង sandbox + CI រត់តេស្ត g++ ពេញលេញជោគជ័យ

## ស្ថានភាពដាក់ពង្រាយ (ផ្ទៀងផ្ទាត់ ២០២៦-១០-២៥)

- Repository បានប្តូរទៅ **public** (តាមសំណើម្ចាស់គម្រោង) ក្រោយការស្កេនសម្ងាត់ពេញ git history — ស្អាត ០ លទ្ធផល។
- CI run (attempt 2): **success** — typecheck, 110 tests (g++ compile tests រត់ពេញ), build។
- Deploy run (attempt 2): ជំហាន ១–៨ success; **"Setup Pages" បរាជ័យព្រោះ GitHub Pages មិនទាន់បានបើក** (token គ្មាន Pages scope)។
- ⚠️ ជំហានដែលម្ចាស់ repo ត្រូវធ្វើម្តង៖ **Settings → Pages → Source: GitHub Actions** រួច re-run workflow "Deploy to GitHub Pages" (ឬ push commit ថ្មី)។ URL នឹងជា `https://seyhalite.github.io/c-plus-plus-programming-khmer-course/`។

## ២០២៦-១០-២៥ — Milestones 0–12 (ការចាប់ផ្តើមគម្រោងពេញលេញ)

| ដំណាក់កាល | លទ្ធផល |
| --- | --- |
| M0 Discovery | Repo ទទេ (README ១ បន្ទាត់, initial commit d534927)។ គ្មានហានិភ័យបំផ្លាញទិន្នន័យ។ Token ដែល user ផ្តល់ត្រូវបានដកចេញពី `.git/config` ភ្លាមៗ ហើយប្រើតែតាម header ពេល push។ |
| M1 Plan | ស្ថាបត្យកម្ម Vite+TS vanilla SPA; docs ទាំង ១០ ឯកសារ។ |
| M2 Design system | tokens.css (ពណ៌ light/dark, typography ខ្មែរ, spacing, focus), base.css, components.css; icons SVG ដើម; ម៉ាស្កុត "តារា"។ Noto Sans Khmer self-hosted តាម @fontsource (OFL)។ |
| M3 Curriculum engine | Schema (`src/types.ts`), ១៣ មេរៀន published (កម្រិត ០–២), ៥៨ planned (កម្រិត ៣–១២), unlock/prerequisite logic, level path UI, validation tests ២៧។ |
| M4 Exercises | ម៉ាស៊ីនលំហាត់ ៧ ប្រភេទ + hints បណ្តើរៗ + review queue + grading tests។ |
| M5 Progress/settings | localStorage schema v1 + migration + sanitization + export/import + reset (confirm ២ ដង); theme/sound/reduced-motion; streak/XP/achievements មានក្បួនច្បាស់។ |
| M6 Code workspace | ការសាកល្បងជាក់ស្តែងរកឃើញ **Piston public API = whitelist-only (២០២៦-០២-១៥)** → ប្តូរទៅ **Wandbox** (ផ្ទៀងផ្ទាត់ដោយការហៅ API ពិត៖ g++ 13.2, C++17, stdin, exit 137 សម្រាប់ infinite loop)។ CodeMirror lazy + textarea fallback; consent gate; limits; សារបរាជ័យពិត។ |
| M7 Character/audio | ម៉ាស្កុត SVG ដើម ៤ states; WebAudio synth (គ្មានឯកសារ audio) opt-in; reduced-motion។ |
| M8 Diagnostics | Bug-report dialog គ្រប់ទំព័រ; redaction (PAT/bearer/api_key/password); source location តែពី stack ពិត; issue template GitHub។ |
| M9 Content | កម្រិត ០–២ ពេញលេញ; ៣–១២ planned ដោយស្មោះត្រង់ (មិនមានមាតិកាក្លែង)។ |
| M10 Testing/perf | ១១០ tests (៩០ pass + ២០ skip-no-g++); build 48KB gzip main; typecheck clean។ Bugs ពិត ៤ ត្រូវបានរកឃើញដោយ tests ហើយកែ (markdown double-escape, redaction pattern, sanitize enum, Array.isArray guards)។ |
| M11 Deploy | ci.yml + deploy.yml (least privilege, pinned actions); base path; 404.html SPA trick; DEPLOYMENT.md ជាភាសាខ្មែរ។ |
| M12 Final review | ឯកសារនេះ + KNOWN_LIMITATIONS.md + README។ |

## Commits សំខាន់ៗ

- `5a47798` feat: platform ពេញលេញ (app shell, curriculum, lesson engine, playground, persistence)
- `f33ba77` test: suites + C++ compiler validation + CI/CD workflows
- (បន្ទាប់) docs: ឯកសារទាំង ១០ + README

## ២០៦-១០-២៥ — Hotfix: CSS tokens បាត់ក្នុង production (post-deploy incident)

- **រោគសញ្ញា** (របាយការណ៍អ្នកប្រើ + screenshot)៖ UI គ្មាន style — អក្សរ serif, hero អក្សរសសលើផ្ទៃស។
- **មូលហេតុ**៖ `src/styles/tokens.css` ចាប់ផ្តើមដោយ `//` comments (មិនត្រឹមត្រូវក្នុង CSS)។ CSS parser ធ្វើ error recovery ហើយលេបយក rule `:root{...}` ទាំងមូល → រាល់ `var(--token)` មិនមានតម្លៃក្នុង browser។
- **ការរកឃើញ**៖ ប្រើ Playwright + Chromium ពិតបង្កើត reproduction (styleSheets 241 rules ប៉ុន្តែ `:root` បាត់, body = Times/transparent)។
- **ការកែ**៖ បតូរ comments ទៅ `/* */`; បន្ថែម regression guards៖ `tests/unit/css-tokens.test.ts` (បដិសេធ `//` comments, braces/comments balanced, :root tokens) + `scripts/check-build-css.mjs` ភ្ជាប់ក្នុង `npm run build` (បរាជ័យបើ bundle បាត់ :root)។
- **ផ្ទៀងផ្ទាត់**៖ Chromium ពិតលើ build ថ្មី — :root 51 declarations, body bg #f6f8fc, font Noto Sans Khmer, hero gradient, 0 console errors; screenshots ក្នុង reports/e2e-*.png។

## ២០៦-០-៥ — Hotfix #2 + រូបភាពសិក្សា (តបតាមមតិអ្នកប្រើ)

- **Bug (របាយការណ៍អ្កប្រើ)**៖ កនុង dark theme ប៊ូតុងជម្រើសក្នុងទំព័រពិនិត្យចំណេះដឹងមានអក្សរខ្មៅលើផ្ទៃងងឹត។ មូលហេតុ៖ base rule របស់ `button` មិនបានកំណត់ `color` → browser ប្រើពណ៌លំនាំដើម (ខ្មៅ) លើផ្ទៃ dark។ កែ៖ `button { color: inherit }` + regression test ក្នុង css-tokens.test.ts។ ផ្ទៀងផ្ទាត់ដោយ Chromium៖ option button dark = អក្សរ #e8edf7 លើផ្ទៃ #1a2743។
- **Feature (តាមសំណើ)**៖ បន្ថែម **ដ្យាក្រាម SVG ដើម** ក្នុងមេរៀន published ទាំង ១៣ (៤ ប្រភេទ៖ pipeline, boxes, ioflow, table) — រូបភាពសិក្សាដែលបង្កើតដោយកូដ គ្មានអាជ្ញាបណ្ណខាងក្រៅ ដំណើរការទាំង light/dark និង mobile (scroll ផ្ដេក)។ Schema ថ្មី `diagrams` ក្នុង Lesson + validation tests។
- បន្ថែមតំណ **វីដេអូ/ធនធានខាងក្រៅ** (freeCodeCamp full course, LearnCpp, cppreference, ការស្វែងរកវីដេអូខ្មែរ) ក្នុងទំព័រ បណ្ណាល័យ — សម្គាល់ច្បាស់ថាជាតំណខាងក្រៅ។
- `scripts/visual-qa.mjs` — ស្ក្រីបថត screenshot light/dark សម្រាប់ QA។

## ២០-០- — UX polish តបតាមមតិអ្នកប្រើ #3

- **Run button feedback**៖ ពេលដំណើរការកូដ ឥឡូវមាន spinner ក្នុងប៊ូតុង + ក្នុងផ្ទាំងលទ្ធផល + តួលេខពេលវេលារស់ (0.1s ម្តង) ក្នុង status line; ប៊ូតុងទាំងអស់ freeze រហូតដល់លទ្ធផលមកដល់; លទ្ធផលបង្ហាញពេលវេលាពិត (ឧ. 5.6s)។ ប្រើ `utils/status-timer.ts`។
- **Syntax highlighting ក្នុងមេរៀន**៖ tokenizer C++ ដើម (`utils/highlight.ts`, គ្មាន dependency) — ពណ៌ keyword/type/string/number/comment/preprocessor តាម light/dark tokens; អនុវត្តលើឧទាហរណ៍មេរៀន, ប្រអប់កំហុស, លំហាត់ predict/arrange/find-error/match។
- **ពាក្យលើកទឹកចិត្ត ៦១** (`data/encouragement.ts`)៖ ៤ ក្រុម (ត្រូវ/ខុស/បញ្ចប់/ណែនាំ) — តារា និយាយឃ្លាផ្សេងៗរាល់លើក ក្នុង feedback លំហាត់, បង្ហាញមេរៀន, និងផ្ទាំងបញ្ចប់។
- Tests ថ្មី៖ highlighter (XSS, block comments, division vs comment), phrase bank (≥50, unique, Khmer)។ សរុប 118 ឆ្លង។

## ២-០- — Security upgrade + MIT + fill-blank UX (តបតាមមតិ #4)

- **Security/Dependabot**៖ upgrade ដោយផ្ទាល់ `vite 5→8.3.5` និង `vitest 2→5.0.5` (កំណែមាន patch សម្រាប់ vulnerabilities ដែល Dependabot ចង្អុល) + `@types/node` explicit។ Lockfile ថ្មី។ Dependabot PRs #3/#4/#5 ត្រូវបានបិទថា "superseded"។
- **MIT License**៖ បន្ថែមឯកសារ LICENSE + field `license` ក្នុង package.json + ផ្នែកក្នុង README។
- **Fill-in-the-blank UX** (អ្នកប្រើជាប់គាំង មិនដឹងវាយនៅឯណា)៖ បន្ថែមប្រអប់ណែនាំពណ៌ខៀវដាច់ៗពីលើ template, លេខរៀងគ្រប់ចន្លោះ, placeholder «ចម្លើយ N…», គែម dashed ខៀវច្បាស់ + focus ring។ Regression test បន្ថែម។

## ២-០- — Fill-blank verifier upgrade (តបតាមមតិ #5)

- មុន៖ ឆ្លើយខុស → សារទូទៅមួយ (អ្នកប្រើមិនដឹងថាខុសត្រង់ណា/ហេតុអ្វី)។
- ឥឡូវ៖ (១) វិនិច្ឆ័យតាមចន្លោះ «ចន្លោះទី N: …» (២) រកឃើញកំហុសអក្សរតែមួយ (fuzzy close, Levenshtein ≤1) → ស្ថានភាពពណ៌ទឹកក្រូច «ស្ទើរតែត្រូវហើយ!» (៣) បរាជ័យលើកទី ២ → បង្ហាញគន្លឹះស្វ័យប្រវត្តិ (៤) បរាជ័យលើកទី ៣ → បង្ហាញចម្លើយត្រឹមត្រូវ ដើម្បីកុំឲយអ្នករៀនជាប់គាំង (នៅតែត្រូវវាដើម្បីជាប់)។
- កែឃ្លាខ្មែរខូចមួយ («ធ្វើ្យ» → «ធ្វើឲ្យ»)។ Tests ថ្មីគ្របដណ្តប់ flows ទាំង ៤។ 118 ឆ្លង។

## ការងារបន្ទាប់ (អាទិភាព)

1. សរសេរមាតិកាពិតកម្រិត ៣ (លក្ខខណ្ឌ) — ៦ មេរៀន តាមគោលការណ៍ [CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md)
2. Playwright e2e + cross-browser/mobile manual pass
3. ពិនិត្យ Dependabot alerts ក្នុង GitHub settings
4. សាកល្បងផលិតកម្មលើ URL GitHub Pages ជាក់ស្តែង (deep links, fonts, execution)
