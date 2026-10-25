# កំណត់ហេតុវឌ្ឍនភាព (PROGRESS / Development Log)

ស្ថានភាពបច្ចុប្បន្ន៖ **v1.0.0 — ដាក់ពង្រាយលើ GitHub Pages** · តេស្ត ៩០ ឆ្លង (២០ skip ក្នុង sandbox គ្មាន g++; រត់ពេញក្នុង CI)

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

## ការងារបន្ទាប់ (អាទិភាព)

1. សរសេរមាតិកាពិតកម្រិត ៣ (លក្ខខណ្ឌ) — ៦ មេរៀន តាមគោលការណ៍ [CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md)
2. Playwright e2e + cross-browser/mobile manual pass
3. ពិនិត្យ Dependabot alerts ក្នុង GitHub settings
4. សាកល្បងផលិតកម្មលើ URL GitHub Pages ជាក់ស្តែង (deep links, fonts, execution)
