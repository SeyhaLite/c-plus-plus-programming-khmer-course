# កំណត់ហេតុវឌ្ឍនភាព (PROGRESS / Development Log)

ស្ថានភាពបច្ចុប្បន្ន៖ **v1.0.0 — បាន push ទៅ GitHub; CI ឆ្លងជោគជ័យ; រង់ចាំបើក GitHub Pages (មើលខាងក្រោម)** · តេស្ត **១៦៥ ឆ្លង** ក្នុង sandbox (+៥៤ skip ព្រោះគ្មាន g++ ក្នុង sandbox — CI រត់ពេញ) · typecheck clean · build clean

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

## ២០២៦-១០-២៥ — Hotfix: CSS tokens បាត់ក្នុង production (post-deploy incident)

- **រោគសញ្ញា** (របាយការណ៍អ្នកប្រើ + screenshot)៖ UI គ្មាន style — អក្សរ serif, hero អក្សរសសលើផ្ទៃស។
- **មូលហេតុ**៖ `src/styles/tokens.css` ចាប់ផ្តើមដោយ `//` comments (មិនត្រឹមត្រូវក្នុង CSS)។ CSS parser ធ្វើ error recovery ហើយលេបយក rule `:root{...}` ទាំងមូល → រាល់ `var(--token)` មិនមានតម្លៃក្នុង browser។
- **ការរកឃើញ**៖ ប្រើ Playwright + Chromium ពិតបង្កើត reproduction (styleSheets 241 rules ប៉ុន្តែ `:root` បាត់, body = Times/transparent)។
- **ការកែ**៖ បតូរ comments ទៅ `/* */`; បន្ថែម regression guards៖ `tests/unit/css-tokens.test.ts` (បដិសេធ `//` comments, braces/comments balanced, :root tokens) + `scripts/check-build-css.mjs` ភ្ជាប់ក្នុង `npm run build` (បរាជ័យបើ bundle បាត់ :root)។
- **ផ្ទៀងផ្ទាត់**៖ Chromium ពិតលើ build ថ្មី — :root 51 declarations, body bg #f6f8fc, font Noto Sans Khmer, hero gradient, 0 console errors; screenshots ក្នុង reports/e2e-*.png។

## ២០២៦-១០-២៥ — Hotfix #2 + រូបភាពសិក្សា (តបតាមមតិអ្នកប្រើ)

- **Bug (របាយការណ៍អ្កប្រើ)**៖ កនុង dark theme ប៊ូតុងជម្រើសក្នុងទំព័រពិនិត្យចំណេះដឹងមានអក្សរខ្មៅលើផ្ទៃងងឹត។ មូលហេតុ៖ base rule របស់ `button` មិនបានកំណត់ `color` → browser ប្រើពណ៌លំនាំដើម (ខ្មៅ) លើផ្ទៃ dark។ កែ៖ `button { color: inherit }` + regression test ក្នុង css-tokens.test.ts។ ផ្ទៀងផ្ទាត់ដោយ Chromium៖ option button dark = អក្សរ #e8edf7 លើផ្ទៃ #1a2743។
- **Feature (តាមសំណើ)**៖ បន្ថែម **ដ្យាក្រាម SVG ដើម** ក្នុងមេរៀន published ទាំង ៣១ (៤ ប្រភេទ៖ pipeline, boxes, ioflow, table) — រូបភាពសិក្សាដែលបង្កើតដោយកូដ គ្មានអាជ្ញាបណ្ណខាងក្រៅ ដំណើរការទាំង light/dark និង mobile (scroll ផ្ដេក)។ Schema ថ្មី `diagrams` ក្នុង Lesson + validation tests។
- បន្ថែមតំណ **វីដេអូ/ធនធានខាងក្រៅ** (freeCodeCamp full course, LearnCpp, cppreference, ការស្វែងរកវីដេអូខ្មែរ) ក្នុងទំព័រ បណ្ណាល័យ — សម្គាល់ច្បាស់ថាជាតំណខាងក្រៅ។
- `scripts/visual-qa.mjs` — ស្ក្រីបថត screenshot light/dark សម្រាប់ QA។

## ២០២៦-១០-២៦ — UX polish តបតាមមតិអ្នកប្រើ #3

- **Run button feedback**៖ ពេលដំណើរការកូដ ឥឡូវមាន spinner ក្នុងប៊ូតុង + ក្នុងផ្ទាំងលទ្ធផល + តួលេខពេលវេលារស់ (0.1s ម្តង) ក្នុង status line; ប៊ូតុងទាំងអស់ freeze រហូតដល់លទ្ធផលមកដល់; លទ្ធផលបង្ហាញពេលវេលាពិត (ឧ. 5.6s)។ ប្រើ `utils/status-timer.ts`។
- **Syntax highlighting ក្នុងមេរៀន**៖ tokenizer C++ ដើម (`utils/highlight.ts`, គ្មាន dependency) — ពណ៌ keyword/type/string/number/comment/preprocessor តាម light/dark tokens; អនុវត្តលើឧទាហរណ៍មេរៀន, ប្រអប់កំហុស, លំហាត់ predict/arrange/find-error/match។
- **ពាក្យលើកទឹកចិត្ត ៦១** (`data/encouragement.ts`)៖ ៤ ក្រុម (ត្រូវ/ខុស/បញ្ចប់/ណែនាំ) — តារា និយាយឃ្លាផ្សេងៗរាល់លើក ក្នុង feedback លំហាត់, បង្ហាញមេរៀន, និងផ្ទាំងបញ្ចប់។
- Tests ថ្មី៖ highlighter (XSS, block comments, division vs comment), phrase bank (≥50, unique, Khmer)។ សរុប 118 ឆ្លង។

## ២០២៦-១០-២៦ — Security upgrade + MIT + fill-blank UX (តបតាមមតិ #4)

- **Security/Dependabot**៖ upgrade ដោយផ្ទាល់ `vite 5→8.3.5` និង `vitest 2→5.0.5` (កំណែមាន patch សម្រាប់ vulnerabilities ដែល Dependabot ចង្អុល) + `@types/node` explicit។ Lockfile ថ្មី។ Dependabot PRs #3/#4/#5 ត្រូវបានបិទថា "superseded"។
- **MIT License**៖ បន្ថែមឯកសារ LICENSE + field `license` ក្នុង package.json + ផ្នែកក្នុង README។
- **Fill-in-the-blank UX** (អ្នកប្រើជាប់គាំង មិនដឹងវាយនៅឯណា)៖ បន្ថែមប្រអប់ណែនាំពណ៌ខៀវដាច់ៗពីលើ template, លេខរៀងគ្រប់ចន្លោះ, placeholder «ចម្លើយ N…», គែម dashed ខៀវច្បាស់ + focus ring។ Regression test បន្ថែម។

## ២០២៦-១០-២៦ — Fill-blank verifier upgrade (តបតាមមតិ #5)

- មុន៖ ឆ្លើយខុស → សារទូទៅមួយ (អ្នកប្រើមិនដឹងថាខុសត្រង់ណា/ហេតុអ្វី)។
- ឥឡូវ៖ (១) វិនិច្ឆ័យតាមចន្លោះ «ចន្លោះទី N: …» (២) រកឃើញកំហុសអក្សរតែមួយ (fuzzy close, Levenshtein ≤1) → ស្ថានភាពពណ៌ទឹកក្រូច «ស្ទើរតែត្រូវហើយ!» (៣) បរាជ័យលើកទី ២ → បង្ហាញគន្លឹះស្វ័យប្រវត្តិ (៤) បរាជ័យលើកទី ៣ → បង្ហាញចម្លើយត្រឹមត្រូវ ដើម្បីកុំឲយអ្នករៀនជាប់គាំង (នៅតែត្រូវវាដើម្បីជាប់)។
- កែឃ្លាខ្មែរខូចមួយ («ធ្វើ្យ» → «ធ្វើឲ្យ»)។ Tests ថ្មីគ្របដណ្តប់ flows ទាំង ៤។ 118 ឆ្លង។

## ការងារបន្ទាប់ (អាទិភាព)

1. សរសេរមាតិកាពិតកម្រិត ៦ (Collections និង Strings) — ៦ មេរៀន តាមគោលការណ៍ [CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md)។ កម្រិត ០–៥ ចប់ហើយ (៣១ មេរៀន)។
2. **បន្ថែម acceptedAnswers សម្រាប់លំហាត់ fill_blank នៅសល់** — គោលការណ៍៖ រាល់ចម្លើយដែលដំណើរការពិតក្នុង C++ ត្រូវតែជាប់។ មើល `tests/curriculum/grading-guards.test.ts`។
3. Playwright e2e + cross-browser/mobile manual pass (ជាពិសេស keyboard ខ្មែរលើទូរស័ព្ទ — ប្រអប់ចន្លោះឥឡូវមាន `autocapitalize/autocorrect=off` ហើយ)
4. ពិនិត្យ Dependabot alerts ក្នុង GitHub settings
5. សាកល្បងផលិតកម្មលើ URL GitHub Pages ជាក់ស្តែង (deep links, fonts, execution)

## ២០២៦-១០-២៧ — ការកែទាំងស្រុងនៃការវិនិច្ឆ័យ fill-in-the-blank (តបតាមមតិអ្នកប្រើ #6 — «វាយត្រូវហើយនៅតែមិនជាប់»)

**រោគសញ្ញាដែលអ្នកសិក្សារាយការណ៍**៖ លំហាត់ «បំពេញកូដឲ្យបញ្ចេញ Hello, World!» បង្ហាញសារ «ស្ទើរតែត្រូវហើយ! ពិនិត្យអក្សរ/សញ្ញាម្តងទៀត (ប្រហែលខុសតែ ១ អក្សរ)» ប៉ុន្តែអ្នកសិក្សាមើលមិនឃើញអក្សរខុស ហើយទោះវាយ `std::cout` ត្រឹមត្រូវក៏នៅតែមិនជាប់។ លើកទី ៣ ប្រព័ន្ធបង្ហាញចម្លើយ ប៉ុន្តែនៅតែទាមទារឲ្យវាយចូល — ជាប់គាំង។

**មូលហេតុពិត (ផ្ទៀងផ្ទាត់ដោយការសាកល្បង ២៥ ករណីលើ grader ពិត)**៖

| # | កំហុស | ផលប៉ះពាល់ |
| --- | --- | --- |
| ១ | អក្សរលាក់ (ZWSP/BOM/bidi) និងអក្សរដូច ASCII (Cyrillic `о` `ѕ`, Greek, fullwidth `：`) បង្កើត Levenshtein = ១ | សារ «ខុសតែ ១ អក្សរ» ប៉ុន្តែអក្សរនោះ **មើលមិនឃើញ** → ជាប់គាំងជាអចិន្ត្រៃយ៍ |
| ២ | `acceptedAnswers` មានតែមួយទម្រង់ | ចម្លើយត្រឹមត្រូវសមមូលត្រូវបានបដិសេធ៖ `cout`, `std:: cout`, `i+=1`, `i = i + 1`, `"\n"` (មានសញ្ញាសម្រង់), `and` (alternative token ផ្លូវការរបស់ C++) |
| ៣ | `codeMatches` ប្រៀបធៀបដោយ **មិនខ្វល់ case** | `STD::COUT` ត្រូវបានចាត់ទុកថាត្រូវ — ប៉ុន្តែវា **មិន compile** ក្នុង C++។ បង្រៀនខុស។ (test ចាស់ថែមទាំង assert ថាត្រូវ!) |
| ៤ | `fuzzyClose` មាន gate `length < 4` | ចម្លើយខ្លី (`%` `&&` `//` `&` `\n`) មិនទទួលបានមតិ «ជិតត្រូវ» ឬការណែនាំអ្វីសោះ |
| ៥ | ប្រអប់ចន្លោះគ្មាន `autocapitalize`/`autocorrect`/`enterkeyhint`/`inputmode` ហើយ Enter មិន submit | keyboard ទូរស័ព្ទធ្វើឲ្យកូដខូចដោយស្វ័យប្រវត្តិ (`Std::cout`) — ហេតុផលចម្បងមួយដែលអ្នកសិក្សាខ្មែរជាប់គាំង |
| ៦ | `normalizeForCompare` លុបបន្ទាត់ទទេចោលទាំងអស់ | `predict_output`៖ អ្នកសិក្សាដែលភ្លេចបន្ទាត់ទទេត្រូវបានចាត់ទុកថា **ត្រូវ** (false positive) |
| ៧ | `lockInputs()` មានការច្រោះពីរជាន់ដែលបិទប៊ូតុង «ជំនួយ» ផង | ឆ្លើយត្រូវមួយលំហាត់ → បាត់សិទ្ធិមើលគន្លឹះសម្រាប់លំហាត់ក្រោយ |
| ៨ | សារខូច «សូម**វាវ**ម្តងទៀត» | កំហុសអក្សរក្នុង UI |

**ការកែ**៖

- **`src/utils/grading.ts` (ថ្មី)** — ម៉ាស៊ីនវិនិច្ឆ័យដាច់ដោយឡែកពី DOM helpers។ យកគំរូតាមវេទិកាដែលបានសាកល្បងហើយ៖
  - *Runestone `fillintheblank`*៖ ចម្លើយច្រើនទម្រង់ក្នុងមួយចន្លោះ + មតិជាក់លាក់សម្រាប់ចម្លើយខុសនីមួយៗ + ជម្រើស case-insensitive ដាច់ដោយឡែក (លំនាំដើម **case-sensitive** ព្រោះកូដពិត case-sensitive)។
  - *Runestone «Compare me»*៖ `describeMismatch()` បង្ហាញភាពខុសគ្នា **តួអក្សរម្តងមួយៗ** ក្រោមប្រអប់ចន្លោះ — រួមទាំងឈ្មោះអក្សរលាក់ និង code point របស់អក្សរដូច ASCII។
  - *freeCodeCamp curriculum-helpers*៖ normalize ច្រើនជាន់មុនប្រៀបធៀប (NFKC · អក្សរលាក់ · NBSP · homoglyph · សញ្ញាសម្រង់រុំ · ចន្លោះជុំវិញ operator)។
  - *VS Code `unicode.highlight`*៖ តារាង confusables (Cyrillic/Greek/fullwidth/smart punctuation) ត្រូវបាន **រកឃើញ និងរាយការណ៍ដោយឈ្មោះ** មិនមែនគ្រាន់តែនិយាយ «ស្ទើរតែត្រូវ» ទេ។
- ច្បាប់សំខាន់បំផុតដែលបានអនុវត្ត៖ **បើប្រព័ន្ធប្រាប់ថា «ខុសតែ ១ អក្សរ» ប្រព័ន្ធត្រូវតែអាចប្រាប់បានថាអក្សរណា។** បើមិនដូច្នោះទេ អ្នកសិក្សាជាប់គាំង។
- near-miss threshold ឥឡូវ **មាត្រដ្ឋានតាមប្រវែងចម្លើយ** (≤3 → 1, ≤8 → 2, វែងជាង → ceil(n/4)) ជំនួស gate `length < 4`។
- ប្រអប់ចន្លោះ៖ `autocapitalize="off"`, `autocorrect="off"`, `enterkeyhint="done"`, `inputmode="text"`, `dir="ltr"`, `lang="en"`, `maxlength`, Enter = submit, និងទទឹងស្វ័យប្រវត្តិតាមចំនួនអក្សរ (ចាស់៖ 130px ថេរ → អក្សរលើសក្រៅប្រអប់)។
- មាតិកា៖ បន្ថែមទម្រង់សមមូលក្នុង `acceptedAnswers` (`cout`, `std:: cout`, `std::endl`, `i+=1`, `i = i + 1`, `and`, `រាយការណ៍`) + hints ថ្មី + field `prose` ក្នុង schema សម្រាប់ចន្លោះជាអត្ថបទខ្មែរ។
- `outputsMatch` ឥឡូវ **រក្សាបន្ទាត់ទទេ** (កំហុស #៦)។
- កែ `lockInputs()` (កំហុស #៧) និងសារ «សូម**វាយ**ម្តងទៀត» (កំហុស #៨)។

**ការការពារកុំឲ្យកើតឡើងវិញ**៖ `tests/curriculum/grading-guards.test.ts` (ថ្មី) — រត់ក្នុង CI។ វាផ្ទៀងផ្ទាត់ថា៖
- រាល់ `acceptedAnswers` ដែលបានប្រកាស **ត្រូវតែជាប់** តាម grader ពិត (បើមិនដូច្នោះទេ លំហាត់មិនអាចឆ្លើយបាន)។
- អក្សរលាក់/homoglyph/fullwidth លើចម្លើយត្រឹមត្រូវ → ត្រូវតែជាប់ **ហើយ** ត្រូវតែមានការពន្យល់។
- near-miss feedback មានសម្រាប់ចម្លើយ ១–៣ អក្សរ។
- template កូដ C++ មិនមានអក្សរខ្មែរក្រៅ comment (លើកលែងតែសម្គាល់ `prose: true`)។
- `expectedOutput` គ្មានបន្ទាត់ទទេខាងក្នុង ឬចន្លោះនៅចុងបន្ទាត់។

**សំណល់ repo**៖ លុប folder `"\$ARENA_WORKSPACE"/shots/*.png` ដែលបាន commit ដោយចៃដន្យ (ឈ្មោះ folder ជា shell variable ដែលមិនបាន expand) + ពង្រីក `.gitignore`។

**លទ្ធផល**៖ តេស្ត ១៦៥ ឆ្លង (ពី ១១៨) · typecheck clean · build clean · ការសាកល្បង ២៥ ករណីលើ grader ពិតឆ្លងទាំងអស់ (ពី ១៨/២៥)។

**កំណត់ចំណាំដោយស្មោះត្រង់**៖ ការផ្ទៀងផ្ទាត់ឧទាហរណ៍ C++ ដោយ g++ (៥៤ tests) **មិនបានរត់ក្នុង sandbox នេះទេ** (គ្មាន g++) — វារត់តែក្នុង CI (ubuntu-latest) ប៉ុណ្ណោះ។

## ២០២៦-១០-២៧ #២ — កំហុសធ្ងន់ធ្ងរបំផុតនៃមាតិកា៖ ភាពលំអៀងទីតាំងចម្លើយ (position bias)

**ការរកឃើញ** (ក្រោយការវិភាគទិន្នន័យមាតិកាទាំងអស់ មិនមែនពីរបាយការណ៍អ្នកប្រើទេ)៖

| កន្លែង | សំណួរសរុប | ចម្លើយត្រឹមត្រូវនៅ index ០ | ចៃដន្យគួរតែ |
| --- | --- | --- | --- |
| លំហាត់ `multiple_choice` ក្នុងមេរៀន | ៣៦ | **៣៣ (92%)** | 25% |
| សំណួរ `placement test` | ៨ | **៨ (100%)** | 25% |

**ផលប៉ះពាល់**៖
- លំហាត់៖ អ្នកសិក្សាអាចទទួលបាន **~៩២%** ដោយចុចជម្រើសដំបូងជានិច្ច ដោយមិនចាំបាច់ចេះ C++ — លំហាត់ទាំងអស់គ្មានតម្លៃវាស់វែង ហើយ XP/streak/achievements សុទ្ធតែខូចតាម។
- **Placement test ធ្ងន់ធ្ងរជាង**៖ វាមិនបានច្របល់ជម្រើសទាល់តែសោះ ដូច្នេះ «ចុចជម្រើសដំបូង ៨ ដង» = ៨/៨ → អ្នកសិក្សាដែលមិនចេះអ្វីសោះត្រូវបានណែនាំឲ្យ **រំលងកម្រិត ០–៥ ទាំងអស់**។

**ការកែ**៖
- **`src/utils/shuffle.ts` (ថ្មី)** — `shuffleChoices(count, answerIndex, seed)` ប្រើ mulberry32 + FNV-1a + Fisher–Yates។ ធានាថា៖ មិនបាត់/មិនស្ទួនជម្រើស · `order[answerPos] === answerIndex` ជានិច្ច · **មិនដែលត្រឡប់ទៅលំដាប់ដើម** (បើមិនដូច្នោះទេភាពលំអៀងដើមនៅតែអាចលេចឡើង)។
- **លំហាត់**៖ seed = `exercise id + ថ្ងៃបច្ចុប្បន្ន` → លំដាប់ **ថេរក្នុងមួយថ្ងៃ** (ចាំបាច់ ព្រោះអ្នកសិក្សាព្យាយាមម្តងទៀតលើលំហាត់ដដែល ហើយសម្រាប់ test ដែល deterministic) ប៉ុន្តែខុសគ្នារវាងលំហាត់ និងរវាងថ្ងៃ → ការចាំទីតាំងមិនអាចប្រើបាន។
- **Placement test**៖ seed ថ្មីរាល់ការចាប់ផ្តើម (`Date.now()`) → ធ្វើម្តងទៀតក៏មិនអាចចាំទីតាំងបាន។ បន្ថែមការ highlight ចម្លើយត្រូវ/ខុសលើជម្រើស (មុនកែមានតែសារអត្ថបទ)។
- **បញ្ហាដែលរកឃើញតាមផ្លូវ**៖ លេខ ១–៤ ដែលបង្ហាញក្នុង `.key-hint` គឺ **គ្រាន់តែជា decoration** — ចុចលេខមិនធ្វើអ្វីទាំងអស់។ ឥឡូវ keydown ១–៩ ជ្រើសជម្រើសពិត។
- **Hints ដែលបង្ហាញចម្លើយផ្ទាល់** (រំលាយគោលការណ៍ CONTENT_GUIDELINES §៣)៖ `l5-params-return-ex3` («n * n នៃ int ជា int» → ចម្លើយគឺ `int`) និង `l0-how-to-use-ex3` («ទំព័រមួយមានឈ្មោះថា "ពិនិត្យចំណេះដឹង"» → ចម្លើយគឺ «ពិនិត្យចំណេះដឹង»)។ សរសេរឡើងវិញជាទិសដៅ។

**ការការពារ (CI)**៖
- `tests/unit/shuffle.test.ts` — ចែកចាយទីតាំងស្មើៗគ្នាក្រោយ shuffle (15–35% ក្នុងមួយទីតាំង) · determinism · ភាពត្រឹមត្រូវនៃ permutation · degenerate sizes
- `tests/unit/placement-integrity.test.ts` — កំណត់ត្រាភាពលំអៀងដើម (៨/៨) · បង្ហាញថា «ចុចជម្រើសដំបូងជានិច្ច» ឥឡូវទទួលបាន ~25% មិនមែន 100% · seed ខុសគ្នារវាងការធ្វើម្តងទៀត · `scoreToLevel` monotonic
- `tests/curriculum/grading-guards.test.ts` — បន្ថែម៖ hint មិនអាចមានចម្លើយវែង ≥ ៨ អក្សរនៅខាងក្នុង · MC ត្រូវមាន ≥ ៣ ជម្រើស
- កែ integration tests ឲ្យរកជម្រើសតាម **អត្ថបទ** មិនមែនតាមទីតាំង DOM (មុនកែវាពឹងលើ index ដោយផ្ទាល់ ដូច្នេះវានឹងបាក់ភ្លាមៗ — នេះជាសញ្ញាថា test ចាស់មិនបានការពារអ្វីសោះ)

**លទ្ធផល**៖ តេស្ត **១៨៩ ឆ្លង** (ពី ១៦៥ · ដើម ១១៨) · typecheck clean · build clean។

**អ្វីដែលនៅសល់ដោយស្មោះត្រង់**៖ ជម្រើសខ្លី/វែងមិនស្មើគ្នានៅតែអាចជាបេក្ខភាពសម្រាប់ការទាយ (ឧ. `l1-hello-world-ex3` ចម្លើយត្រូវ ៦៩ តួ vs មធ្យមភាគ ៣៦)។ shuffle ដោះស្រាយភាពលំអៀង **ទីតាំង** ប៉ុន្តែមិនមែនភាពលំអៀង **ប្រវែង** ទេ — ត្រូវការសរសេរមាតិកាឡើងវិញដោយដៃ (៩ លំហាត់ បានរាយបញ្ជីក្នុង REVIEW)។
