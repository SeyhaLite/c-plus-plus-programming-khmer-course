# សេចក្តីសម្រេចចិត្តស្ថាបត្យកម្ម (DECISIONS)

ទម្រង់៖ បរិបទ → ជម្រើស → សេចក្តីសម្រេច → ហេតុផល។

## D1. Stack៖ Vite + TypeScript + Vanilla DOM (គ្មាន UI framework)

- **បរិបទ**៖ Repository ទទេ (គ្មាន framework មានស្រាប់)។ ទំព័រភាគច្រើនជាមាតិកាស្តាទិច + អន្តរកម្មតិចតួច។
- **ជម្រើស**៖ React/Svelte/Vue vs vanilla TS។
- **សម្រេច**៖ Vanilla DOM ជាមួយ `el()` helper + Vite។
- **ហេតុផល**៖ Bundle តូច (48KB gzip រួម curriculum ទាំងមូល) គ្មាន virtual DOM overhead អាចថែរក្សាងាយ ហើយមេរៀន page មិនត្រូវការ reactive complexity។ CodeMirror (521KB raw) ត្រូវបាន lazy-load តែក្នុង playground។

## D2. Routing៖ History API + 404.html redirect trick

- **បរិបទ**៖ GitHub Pages មិនមាន server rewrite សម្រាប់ SPA។
- **ជម្រើស**៖ (ក) hash routing `#/...` (ខ) history + `404.html` redirect (គ) pre-render ជា static HTML រាល់ route។
- **សម្រេច**៖ (ខ)។
- **ហេតុផល**៖ canonical URLs ស្អាត (`/levels/1/lessons/l1-hello-world`) ដែល refresh ដំណើរការ។ Trick ស្តង់ដារ spa-github-pages ប្រើ `?/path` query ហើយ index.html ស្តារផ្លូវវិញដោយ `history.replaceState`។ ជម្រើស (គ) ត្រូវការ build tooling បន្ថែម; អាចពិចារណានាពេលអនាគត។

## D3. ការដំណើរការកូដ C++

- **បរិបទ**៖ GitHub Pages static — មិនអាច compile លើ server ខ្លួនឯង។ ត្រូវការជម្រើស A (WASM), B (external API) ឬ C (self-hosted backend)។
- **ការសាកល្បងជាក់ស្តែង (២០២៦-១០-២៥)**៖
  - **Piston (emkc.org)** — គម្រោងដើម៖ ❌ សេវាសាធារណៈបានប្តូរទៅ **whitelist-only ចាប់ពី 2026-02-15** (ផ្ទៀងផ្ទាត់ដោយការហៅ API ពិត ទទួលបានសារ "Public Piston API is now whitelist only")។
  - **Wandbox** — ✅ ផ្ទៀងផ្ទាត់ដោយការហៅពិត៖ g++ 13.2.0 ជាមួយ `-std=c++17`, stdin, compile errors, exit codes, កម្មវិធី infinite loop ត្រូវបាន kill (137)។ គ្មាន API key។
  - **WASM compiler (ជម្រើស A)** — clang.wasm ~100MB+ ធ្ងន់ពេកសម្រាប់ GitHub Pages និង mobile; បដិសេធ។
- **សម្រេច**៖ ជម្រើស B ជាមួយ **Wandbox** + consent gate ច្បាស់លាស់ + limits ខាង client + ការបរាជ័យដោយស្មោះត្រង់។
- **ហេតុផល**៖ ដំណើរការពិតបានភ្លាមៗ ឥត key ឥត secret។ ហានិភ័យ (សេវាអាចប្តូរគោលការណ៍ដូច Piston) ត្រូវបានកត់ត្រាក្នុង [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) ជាមួយផែនការបម្រុង (ជម្រើស C — self-hosted Piston ដែលមានឯកសារណែនាំ)។

## D4. ពុម្ពអក្សរខ្មែរ៖ Noto Sans Khmer តាម @fontsource (self-hosted)

- **សម្រេច**៖ `@fontsource/noto-sans-khmer` (weights 400/600/700) — អាជ្ញាបណ្ណ SIL OFL 1.1 ឯកសារ woff2 ត្រូវបាន bundle ក្នុង build (មិនមាន remote fetch ពេល page load) កំណែត្រូវបាន pin តាម `package-lock.json`។ unicode-range subsetting ធានាថា browser ទាញតែ subset ខ្មែរ/latin ដែលត្រូវការ។
- **Fallback chain**៖ `'Noto Sans Khmer', 'Noto Sans', 'Khmer OS', sans-serif`។
- **line-height 1.9** ដើម្បីការពារការកាត់ combining marks (ឧ. គូថែ ក្រោម/លើ)។

## D5. Logo និងម៉ាស្កុត

- យើង **មិនប្រើ ឬគូរឡើងវិញនូវ C++ logo ផ្លូវការ** (ម៉ាកសញ្ញា Standard C++ Foundation)។ ជំនួសមកវិញ៖ wordmark "C++" សាមញ្ញដើម (SVG ក្នុង repo) + ម៉ាស្កុតដើម "តារា" (robot SVG គូរដោយកូដក្នុង `src/app/character.ts`)។ គ្មានទ្រព្យខាងក្រៅ គ្មានបញ្ហាអាជ្ញាបណ្ណ។

## D6. សំឡេង៖ WebAudio synthesis ជាជាងឯកសារ audio

- បំពេញតាមតម្រូវការ "តូច ប្រសិទ្ធ អាជ្ញាបណ្ណច្បាស់លាស់" ដោយ **បង្កើតសំឡេងភ្លាមៗដោយ oscillator** (បី tones សាមញ្ញ) — 0 bytes នៃ audio assets គ្មានបញ្ហាអាជ្ញាបណ្ណ គ្រប់គ្រង volume/duration បានពេញលេញ។ បិទជាលំនាំដើម; AudioContext បង្កើតតែក្រោយ user gesture (autoplay policy)។

## D7. Persistence៖ localStorage (មិនមែន IndexedDB) គ្មាន IP/account

- ទិន្នន័យវឌ្ឍនភាពតូច (<១០០KB ជាធម្មតា; caps ក្នុង `sanitizeState`)។ localStorage ងាយស្រួល debug និង synchronous។ Schema v1 + migration + quota handling + export/import។ IP មិនត្រូវបានប្រមូល ឬប្រើជា identity ទេ (មិនអាចទុកចិត្ត ហើយជាទិន្នន័យផ្ទាល់ខ្លួន)។ Cross-device sync គឺជាមុខងារអនាគតដាច់ដោយឡែក (ត្រូវការ backend + auth)។

## D8. មិនមាន "pass ដោយចុចប៊ូតុង"

- ការបញ្ចប់មេរៀនផ្អែកលើការឆ្លើយត្រូវនៃលំហាត់ required ប៉ុណ្ណោះ។ code_challenge ត្រូវការលទ្ធផល test cases ពិត — បើ execution មិនអាច (គ្មាន consent/network) មេរៀនមិនអាចបញ្ចប់ ហើយ UI ប្រាប់ការពិត។ នេះជា design decision ដែលអាចរំខានខ្លះ ប៉ុន្តែស្របនឹងគោលការណ៍ "ការរៀនពិត"។

## D9. ចម្លើយលំហាត់នៅក្នុង client bundle

- មាតិកាស្តាទិចមិនអាចលាក់សម្ងាត់បាន — ចម្លើយ (answerIndex, solutions) ស្ថិតក្នុង JS bundle។ យើងទទួលស្គាល់ចំណុចនេះដោយបើកចំហ៖ platform នេះជាឧបករណ៍រៀន (formative) មិនមែនការប្រឡងសន្តិសុខ (summative)។ Placement test ក៏ដូចគ្នា។ សម្រាប់ការវាយតម្លៃដែលត្រូវការភាពម៉ឺងម៉ាត់ ត្រូវការ server-side grading — កត់ត្រាក្នុង KNOWN_LIMITATIONS។

## D10. Testing strategy

- **Vitest** (unit/curriculum/integration/security) + **happy-dom** សម្រាប់ DOM tests រហ័ស។ គ្មាន Playwright e2e នៅឡើយ — មើល KNOWN_LIMITATIONS (e2e លើ browser ពិតជាការងារអនាគត; integration tests គ្របដណ្តប់ flows សំខាន់ៗក្នុង happy-dom)។
- **g++ ពិតក្នុង CI** ផ្ទៀងផ្ទាត់ឧទាហរណ៍ និង solution ទាំងអស់ជាមួយ `-Wall -Wextra -Werror`។
