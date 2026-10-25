# ស្ថាបត្យកម្ម (ARCHITECTURE)

## ទិដ្ឋភាពទូទៅ

Khmer C++ Academy គឺជា **static single-page application** ដែលសាងសង់ដោយ៖

- **Vite 5** — build tool (base path `/c-plus-plus-programming-khmer-course/` សម្រាប់ GitHub Pages)
- **TypeScript (strict)** — ភាសាតែមួយគត់សម្រាប់កូដកម្មវិធី
- **Vanilla DOM** — គ្មាន UI framework។ គ្រប់ component សាងសង់ដោយ `el()` helper (`src/utils/dom.ts`) ដើម្បី bundle តូច និងងាយយល់
- **CodeMirror 6** — editor ក្នុងទំព័រ playground ប៉ុណ្ណោះ (lazy-loaded chunk)
- **@fontsource** — ពុម្ពអក្សរ self-hosted (Noto Sans Khmer, Noto Sans, Fira Code) ជាមួយ unicode-range subsetting
- **Wandbox API** — ដំណើរការកូដ C++ ពីចម្ងាយ (មើល [DECISIONS.md](./DECISIONS.md#ការដំណើរការកូដ-c))

## រចនាសម្ព័ន្ធថត

```
src/
  app/          # router (History API), layout shell, icons, character (ម៉ាស្កុត)
  components/   # exercises.ts — ម៉ាស៊ីនលំហាត់ (render + grade គ្រប់ប្រភេទ)
  curriculum/levels/
    level-00/lessons.ts   # មេរៀនពិត (published)
    level-01/lessons.ts
    level-02/lessons.ts
    planned-levels.ts     # កម្រិត ៣–១២ (metadata គ្រោង គ្មានមាតិកា)
  data/         # curriculum.ts (index + unlock logic), achievements.ts, placement-quiz.ts
  features/     # ទំព័រនីមួយៗ៖ dashboard, plan, curriculum(levels), lessons, quiz,
                # playground, library, history, achievements, settings, help, bug-reports
  services/     # storage, progress, audio, diagnostics, code-execution
  styles/       # tokens.css (design tokens), base.css, components.css
  types.ts      # គ្រោងការណ៍ទិន្នន័យទាំងអស់ (Lesson, Exercise, ProgressState…)
tests/
  unit/ curriculum/ integration/ security/
scripts/
  check-cpp-examples.ts   # compile+run ឧទាហរណ៍ដោយ g++ ពិត
  build-report.ts         # របាយការណ៍ភាពពេញលេញមាតិកា
docs/ reports/ .github/workflows/
```

## លំហូរទិន្នន័យ

1. **Curriculum** ជា static data (TypeScript modules) — គ្មានការផ្ទុកពី network សម្រាប់មេរៀន។ Bundle ទាំងមូល ~48KB gzip។
2. **Progress store** (`services/progress.ts`) — module-level state + `subscribe()`; រាល់ mutation ត្រូវបាន persist ទៅ localStorage ភ្លាមៗ (`services/storage.ts`) ជាមួយ schema version និង sanitization។
3. **Router** (`app/router.ts`) — History API + ការ intercept លើ link clicks។ Deep links លើ GitHub Pages ដំណើរការតាម `public/404.html` redirect trick។
4. **Code execution** (`services/code-execution.ts`) — fetch ទៅ Wandbox ជាមួយ consent gate, timeouts និង size limits។ លទ្ធផល (ឬកំហុសពិត) បង្ហាញតាម UI ដោយមិនក្លែង។

## គ្រោងការណ៍មេរៀន (Lesson schema)

មើល `src/types.ts`។ សង្ខេប៖ `id, title_km, title_en, level_id, unit_id, status, version, estimated_minutes, prerequisites[], objectives_km[], explanation_km (mini-markdown), examples[] (code+expectedOutput+stdin), commonMistake?, exercises[], summary_km, next?`។

ប្រភេទលំហាត់ទាំង ៧៖ `multiple_choice, fill_blank, predict_output, arrange, find_error, match, code_challenge`។

## ភាសា (i18n architecture)

មាតិកាទាំងអស់មាន field `_km` ដាច់ដោយឡែក (ឧ. `title_km`)។ ការបន្ថែមអង់គ្លេសនាពេលអនាគត = បន្ថែម field `_en` + locale resolver ក្នុង render layer — ម៉ាស៊ីនមេរៀន (lesson engine) មិនត្រូវប្តូរទេ។ កូដ C++, identifiers និងសារ compiler នៅតែជាអង់គ្លេសជានិច្ច។

## សុវត្ថិភាព rendering

អត្ថបទមេរៀនឆ្លងកាត់ `renderMarkdown()` ដែល **escape HTML ជាមុន** រួចទើបបកប្រែ mini-markdown — គ្មាន HTML ពីមាតិកាអាច execute បាន។ DOM ទាំងអស់សាងសង់តាម `textContent`/`createElement` (មិនមាន `innerHTML` ជាមួយទិន្នន័យអ្នកប្រើ)។
