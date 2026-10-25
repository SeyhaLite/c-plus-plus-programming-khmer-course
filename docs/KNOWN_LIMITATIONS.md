# ដែនកំណត់ដែលស្គាល់ (KNOWN LIMITATIONS)

ឯកសារនេះចង្អុលបង្ហាញដោយ **ស្មោះត្រង់** នូវអ្វីដែលប្រព័ន្ធមិនទាន់ធ្វើបាន ឬមានហានិភ័យ។

## ១. ការដំណើរការកូដពឹងផ្អែកសេវាខាងក្រៅ (Wandbox)

- GitHub Pages ជា static hosting — គ្មាន backend ផ្ទាល់ខ្លួន។ ការ compile/run ពិតត្រូវបានធ្វើតាម **wandbox.org** (ជម្រើស B)។
- **ហានិភ័យ**៖ សេវាសាធារណៈអាចប្តូរគោលការណ៍ (ឧទាហរណ៍ជាក់ស្តែង៖ Piston បានប្តូរទៅ whitelist-only នៅ ២០២៦-០២-១៥ ដែលជាហេតុធ្វើឲ្យយើងប្តូរទៅ Wandbox)។ បើ Wandbox បិទ មុខងារ Run នឹងបរាជ័យ — UI នឹងបង្ហាញកំហុសពិត (មិនក្លែង) ហើយ code_challenge lessons មិនអាចបញ្ចប់បានរហូតដល់មាន provider ថ្មី។
- **ផែនការបម្រុង**៖ self-host Piston (ឧ. Railway/Fly/docker) ហើយប្តូរ adapter ក្នុង `src/services/code-execution.ts` — មើល [DEPLOYMENT.md](./DEPLOYMENT.md)។
- Wandbox មិនមាន SLA សម្រាប់អ្នកប្រើអនាមិក; ការឆ្លើយតបអាចយឺត (~៤–១០s)។

## ២. វឌ្ឍនភាពមានតែក្នុង browser មួយ

- គ្មាន cross-device sync (ត្រូវការ backend + authentication — មិនទាន់អនុវត្ត)។ ការផ្លាស់ប្តូរឧបករណ៍/សម្អាត browser data = បាត់ទិន្នន័យ លុះត្រាតែបាន Export JSON។
- Private/incognito mode អាចបិទ localStorage — app ដំណើរការ ប៉ុន្តែបង្ហាញការព្រមាន និងមិនរក្សាទុក។

## ៣. ចម្លើយលំហាត់មិនអាចលាក់សម្ងាត់បាន

- ជា static site — answer keys និង solutions ស្ថិតក្នុង JS bundle ដែលអ្នកប្រើអាចអានបាន។ យើងចាត់ទុកលំហាត់ជា **formative assessment** (ឧបករណ៍រៀន) មិនមែនការប្រឡងសន្តិសុខ។ សម្រាប់ summative assessment ពិត ត្រូវការ server-side grading (មុខងារអនាគតដាច់ដោយឡែក)។

## ៤. មាតិកាកម្រិត ៣–១២ មិនទាន់មាន

- ៥៨ មេរៀន planned មានតែ metadata (ឈ្មោះ/លំដាប់/រយៈពេលប៉ាន់ស្មាន)។ UI សម្គាល់ច្បាស់ថា "កំពុងរៀបចំ"។ ឈ្មោះអាចប្តូរបានពេលសរសេរមាតិកាពិត។
- បណ្ណាល័យ C++ ជាឯកសារយោងសង្ខេប មិនមែន reference ពេញលេញ (ណែនាំ cppreference.com)។

## ៥. E2E tests លើ browser ពិត

- មិនមាន Playwright/cross-browser automation នៅឡើយ។ ការសាកល្បង responsive/keyboard/screen-reader ធ្វើដោយដៃ។ Integration tests រត់ក្នុង happy-dom (ការបកស្រាយ DOM មិន ១០០% ដូច browser ពិត)។

## ៦. CodeMirror chunk ធំ

- ~170KB gzip ប៉ុន្តែ **lazy-loaded** តែក្នុង `/playground` — ទំព័រមេរៀនមិនផ្ទុកវាទេ។ ជម្រើសស្រាលជាង (textarea ធម្មតា) មានស្រាប់ជា fallback។

## ៧. ភាសា UI

- UI មានតែភាសាខ្មែរ។ គ្រោងការណ៍ field `_km/_en` បានរៀបចំសម្រាប់អង់គ្លេសនាពេលអនាគត ប៉ុន្តែ locale switcher មិនទាន់មាន។

## ៨. PWA / offline

- មិនមាន service worker — ត្រូវការអ៊ីនធឺណិតសម្រាប់ផ្ទុកទំព័រដំបូង និងដំណើរការកូដ។ មាតិកាមេរៀនផ្ទាល់ bundle ក្នុង JS ដូច្នេះ navigation ក្រោយផ្ទុកដំបូងដំណើរការ offline មិនត្រូវការ network ទេ (លើកលែង code execution)។
