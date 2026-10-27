# Khmer C++ Academy — រៀន C++ ជាភាសាខ្មែរ

វេទិកាសិក្សា C++ ឥតគិតថ្លៃ ជាភាសាខ្មែរ លើ GitHub Pages។ បទពិសោធន៍រៀនបែបអន្តរកម្ម (Duolingo-inspired)៖ មេរៀនតាមជំហាន · លំហាត់ ៧ ប្រភេទជាមួយមតិភ្លាមៗ · កន្លែងសរសេរកូដ C++ ពិតប្រាកដក្នុង browser · វឌ្ឍនភាពរក្សាទុកក្នុង browser របស់អ្នក (គ្មានគណនី គ្មានការតាមដាន)។

**ស្ថានភាពមាតិកា (ស្មោះត្រង់)**៖ កម្រិត ០–៥ មានមេរៀនពេញលេញ **៣១** ជាមួយលំហាត់ **១១០** (ឧទាហរណ៍ C++ ទាំងអស់ផ្ទៀងផ្ទាត់ដោយ g++ ក្នុង CI)។ កម្រិត ៦–១២ (**៤០** មេរៀន) កំពុងរៀបចំ — សម្គាល់ច្បាស់ក្នុង UI។ លេខពិតបច្ចុប្បន្ន៖ [reports/curriculum-completeness.md](reports/curriculum-completeness.md) (បង្កើតស្វ័យប្រវត្តិ)។

## ចាប់ផ្តើមប្រើ (អ្នកសិក្សា)

គ្រាន់តែបើកគេហទំព័រ (មើលតំណ Pages ក្នុង Settings → Pages របស់ repo)។ ចាប់ផ្តើមពី **កម្រិត ០** ឬធ្វើ **ពិនិត្យចំណេះដឹង** ដើម្បីទទួលការណែនាំ។

## ដំណើរការក្នុងម៉ាស៊ីន (អ្នកអភិវឌ្ឍន៍)

```bash
npm ci          # ដំឡើង dependencies
npm run dev     # dev server
npm test        # unit + curriculum + integration + security (Vitest)
npm run check:cpp   # ផ្ទៀងផ្ទាត់ឧទាហរណ៍ C++ ដោយ g++ (ត្រូវការ g++ ក្នុងម៉ាស៊ីន)
npm run build   # production build → dist/
npm run report  # របាយការណ៍ភាពពេញលេញមាតិកា
```

ត្រូវការ Node.js 20+។ គ្មាន secret/API key ណាត្រូវការ។

## ការដាក់ពង្រាយ

Push ទៅ `main` → GitHub Actions build+test+deploy ស្វ្យ័យប្រវត្តិ។ ការកំណត់ម្តងគត់៖ Settings → Pages → Source = **GitHub Actions**។ លម្អិត៖ [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)។

## ឯកសារ (Documentation index)

| ឯកសារ | មាតិកា |
| --- | --- |
| [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) | ចក្ខុវិស័យ គោលការណ៍ ផែនការ milestone |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | ស្ថាបត្យកម្ម និងរចនាសម្ព័ន្ធថត |
| [FEATURES.md](docs/FEATURES.md) | មុខងារទាំងអស់ (អ្វីដែលមានពិត) |
| [DECISIONS.md](docs/DECISIONS.md) | សេចក្តីសម្រេចចិត្តសំខាន់ៗ + ហេតុផល (រួមទាំង execution API) |
| [TESTING.md](docs/TESTING.md) | យុទ្ធសាស្ត្រតេស្ត + លទ្ធផលជាក់ស្តែង |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | GitHub Pages + local development |
| [SECURITY.md](docs/SECURITY.md) | ទិន្នន័យ ឯកជនភាព consent redaction |
| [CONTENT_GUIDELINES.md](docs/CONTENT_GUIDELINES.md) | របៀបសរសេរ/បន្ថែមមេរៀន និងលំហាត់ |
| [PROGRESS.md](docs/PROGRESS.md) | កំណត់ហេតុវឌ្ឍនភាព និងការងារបន្ទាប់ |
| [KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md) | ដែនកំណត់ដោយស្មោះត្រង់ |
| [reports/curriculum-completeness.md](reports/curriculum-completeness.md) | របាយការណ៍មាតិកាស្វ័យប្រវត្តិ |

## ការរួមចំណែក (Contributing)

1. អាន [CONTENT_GUIDELINES.md](docs/CONTENT_GUIDELINES.md) (មាតិកា) ឬ [ARCHITECTURE.md](docs/ARCHITECTURE.md) (កូដ)
2. បង្កើត branch ថ្មី → កែ → រត់ `npm test` និង `npm run typecheck`
3. បើបន្ថែមមេរៀន៖ រត់ `npm run check:cpp` និង `npm run report`
4. Pull request — CI នឹងផ្ទៀងផ្ទាត់ស្វ័យប្រវត្តិ
5. រាយការណ៍បញ្ហា៖ ប្រើប៊ូតុង "រាយការណ៍បញ្ហា" លើគេហទំព័រ រួច paste របាយការណ៍ក្នុង [Issue](../../issues) (template មានស្រាប់)

**កុំ commit secrets** — គម្រោងនេះមិនត្រូវការ secret ណាទេ។

## អាជ្ញាបណ្ណ (License)

គម្រោងនេះចេញក្រោម **MIT License** — សូមមើលឯកសារ [LICENSE](LICENSE)។

## ការប្រើប្រាស់ទ្រព្ខាងក្រៅ

- កូដ និងមាតិកា៖ សរសេរដើមសម្រាប់គម្រោងនេះ
- ពុម្ពអក្សរ៖ Noto Sans / Noto Sans Khmer / Fira Code (SIL Open Font License) តាម @fontsource — self-hosted
- ម៉ាស្កុត "តារា" និង icons៖ SVG ដើម ១០០% ក្នុង repo
- **មិនប្រើ C++ logo ផ្លូវការ** (ម៉ាកសញ្ញា Standard C++ Foundation) — wordmark អក្សរ "C++" សាមញ្ញដើម។ មើល [DECISIONS.md](docs/DECISIONS.md#d5-logo-និងម៉ាស្កុត)។
- ការដំណើរការកូដ៖ សេវាសាធារណៈ [Wandbox](https://wandbox.org) (មាន consent gate)
