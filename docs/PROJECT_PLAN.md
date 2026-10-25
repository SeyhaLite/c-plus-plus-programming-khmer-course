# ផែនការគម្រោង (PROJECT PLAN) — Khmer C++ Academy

> ឯកសារនេះជាផែនការមេ។ ស្ថានភាពការងារជាក់ស្តែង៖ [PROGRESS.md](./PROGRESS.md)

## ១. ចក្ខុវិស័យ

វេទិកាសិក្សា C++ ឥតគិតថ្លៃ ជាភាសាខ្មែរ សម្រាប់អ្នកចាប់ផ្តើមដំបូង រហូតដល់កម្រិតវិជ្ជាជីវៈ។ បទពិសោធន៍រៀនបានលំនាំដុយគូលីង (Duolingo-inspired)៖ រៀន → ហាត់ → ទទួលមតិភ្លាមៗ → ពិនិត្យកំហុសឡើងវិញ → ជាប់ → បន្ត។ ប៉ុន្តែមានអត្តសញ្ញាណដាច់ដោយឡែក (ម៉ាស្កុត "តារា" ពណ៌ប្រេនខៀវ-លឿង)។

## ២. គោលការណ៍មិនអាចប្រកែកបាន

1. **ភាពស្មោះត្រង់** — មិនមានមុខងារក្លែង។ មាតិកាដែលមិនទាន់មាន ត្រូវសម្គាល់ "កំពុងរៀបចំ"។ លទ្ធផល compile មិនត្រូវបានក្លែងឡើយ។
2. **ការរៀនពិត** — បញ្ចប់មេរៀនបាន លុះត្រាតែឆ្លើយលំហាត់ចាំបាច់ត្រឹមត្រូវ។
3. **ឯកជនភាព** — វឌ្ឍនភាពនៅក្នុង browser អ្នកប្រើប៉ុណ្ណោះ។ គ្មាន IP គ្មានការតាមដាន។ កូដផ្ញើទៅសេវាខាងក្រៅតែក្រោយការយល់ព្រមច្បាស់លាស់។
4. **ភាពអាចចូលប្រើបាន (accessibility)** — keyboard, screen reader, contrast, reduced motion, អក្សរខ្មែរត្រឹមត្រូវ។
5. **ស្រាល** — static site ដំណើរការលើ GitHub Pages ឥតគិតថ្លៃ។

## ៣. ផែនការអនុវត្តតាម Milestone

| Milestone | ការងារ | ស្ថានភាព |
| --- | --- | --- |
| 0 | ត្រួតពិនិត្យ repository (baseline: README ទទេ 1 បន្ទាត់) | ✅ |
| 1 | ស្ថាបត្យកម្ម + ផែនការ + docs | ✅ |
| 2 | Design system, navigation, Khmer typography | ✅ |
| 3 | Curriculum engine (levels/units/lessons, unlock rules, validation) | ✅ |
| 4 | Exercises + feedback (ប្រភេទលំហាត់ ៧, hints, review queue) | ✅ |
| 5 | Progress + settings (localStorage, export/import, theme/sound/motion) | ✅ |
| 6 | C++ coding workspace (CodeMirror + Wandbox execution + consent) | ✅ |
| 7 | Character + audio + achievements (ម៉ាស្កុត SVG ដើម, WebAudio opt-in) | ✅ |
| 8 | Diagnostics + help (bug report ចម្លងបាន, redaction, issue template) | ✅ |
| 9 | ពង្រីកមាតិកា level 3–12 (planned ស្រាប់; មេរៀនពិតបន្ថែមជាបន្តបន្ទាប់) | 🔄 បន្ត |
| 10 | Testing + performance (110 tests; build verified) | ✅ |
| 11 | Documentation + deployment (GitHub Pages + Actions) | ✅ |
| 12 | Final review (មើល PROGRESS.md និង KNOWN_LIMITATIONS.md) | ✅ |

## ៤. វិសាលភាពមាតិកា (Content scope)

- **Published ឥឡូវ**៖ កម្រិត ០ (៣ មេរៀន), កម្រិត ១ (៥ មេរៀន), កម្រិត ២ (៥ មេរៀន) = ១៣ មេរៀន ជាមួយ ៤៥ លំហាត់។
- **Planned**៖ កម្រិត ៣–១២ (៥៨ មេរៀន) — មាន metadata និងលំដាប់ច្បាស់លាស់ ប៉ុន្តែគ្មានមាតិកាក្លែង។
- គុណភាពសំខាន់ជាងបរិមាណ៖ មេរៀនថ្មីនីមួយៗត្រូវឆ្លង curriculum validation + C++ compilation check ក្នុង CI មុន publish។

## ៥. របៀបបន្ថែមមេរៀនថ្មី

មើលការណែនាំលម្អិតក្នុង [CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md)។

## ៦. ការដាក់ពង្រាយ

មើល [DEPLOYMENT.md](./DEPLOYMENT.md)។ សង្ខេប៖ push ទៅ `main` → GitHub Actions build + test + deploy ទៅ GitHub Pages ស្វ័យប្រវត្តិ។
