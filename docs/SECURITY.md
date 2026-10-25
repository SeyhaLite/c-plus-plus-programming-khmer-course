# សុវត្ថិភាព និងឯកជនភាព (SECURITY)

## ទិន្នន័យអ្វីត្រូវបានរក្សាទុក និងនៅឯណា

| ទិន្នន័យ | ទីតាំង | ការផ្ញើចេញ |
| --- | --- | --- |
| វឌ្ឍនភាព (មេរៀនបញ្ចប់, XP, streak, snippets, settings) | localStorage ក្នុង browser អ្នកប្រើ **ប៉ុណ្ណោះ** | គ្មាន (លើកលែង export JSON ដោយអ្នកប្រើផ្ទាល់) |
| កូដ C++ ដែលអ្នកប្រើសរសេរ + stdin | មិនរក្សាទុកអចិន្ត្រៃយ៍ (snippets បើអ្នកប្រើចុចរក្សាទុក) | ទៅ **wandbox.org** តែប៉ុណ្ណោះ ហើយតែក្រោយ **consent ច្បាស់លាស់** |
| Bug reports | បង្កើតក្នុង browser; copy ដោយអ្នកប្រើ | គ្មានការ upload ស្វ័យប្រវត្តិ |
| IP address | **មិនប្រមូល មិនប្រើ មិនរក្សាទុក** | — |
| Analytics/tracking | **គ្មាន** | — |

## Execution boundary (កូដមិនទុកចិត្ត)

- កូដអ្នកប្រើ **មិនដែល** ដំណើរការលើឧបករណ៍អ្នកប្រើ ឬ server របស់គម្រោង — វាដំណើរការក្នុង sandbox របស់ Wandbox (g++ 13.2, ដាច់ដោយឡែក)។
- Client-side limits (មុន network)៖ កូដ ≤ 32KB · stdin ≤ 32KB · fetch timeout 20s · output truncated 16KB។
- Server-side (Wandbox): infinite loops ត្រូវបាន kill (exit 137) — បានផ្ទៀងផ្ទាត់ដោយការសាកល្បងជាក់ស្តែង។
- គ្មាន API key/secret ណាមួយនៅក្នុង frontend source, build output, ឬ CI logs (តេស្ត `tests/security/` + grep ក្នុង review)។
- បើសេវាបរាជ័យ → UI បង្ហាញកំហុសពិត។ **មិនមានការក្លែងលទ្ធផល compile/test ក្នុងករណីណាក៏ដោយ។**

## Consent (ការយល់ព្រម)

- មុនការផ្ញើកូដលើកដំបូង dialog ពន្យល់ច្បាស់៖ អ្វីត្រូវផ្ញើ (code + stdin) ទៅណា (wandbox.org) អ្វីមិនផ្ញើ និងរបៀបដកការយល់ព្រម។
- ស្ថានភាព consent រក្សាទុកក្នុង settings; ដកបានគ្រប់ពេលក្នុងទំព័រ ការកំណត់។

## XSS / injection hardening

- មាតិកាមេរៀនឆ្លងកាត់ `escapeHtml` មុន mini-markdown rendering (`src/utils/markdown.ts`) — តេស្ត XSS ក្នុង `tests/unit/grading-markdown.test.ts`។
- គ្មាន `innerHTML` ជាមួយទិន្នន័យអ្នកប្រើ; អក្សរទាំងអស់តាម `textContent`/`createTextNode`។
- Imported progress JSON ត្រូវបាន sanitize (prototype-pollution safe, type-checked, size-capped) — `tests/security/hardening.test.ts`។

## Diagnostic redaction

- របាយការណ៍ bug មិនដែលរួមបញ្ចូល IP ឬវឌ្ឍនភាពផ្ទាល់ខ្លួន។
- តម្លៃដូច token (`ghp_…`, `github_pat_…`, `Bearer …`, `api_key=…`, `password: …`) ត្រូវ redact ស្វ័យប្រវត្តិមុនបង្ហាញ/copy។
- Source path/line បង្ហាញតែពី stack trace ពិតដែលចង្អុលទៅ `src/**` — ក្រៅពីនោះ "Not available in production" (មិនបង្កើតក្លែង)។

## Supply chain

- Dependencies តិចតួច និង pin តាម `package-lock.json` (`npm ci` ក្នុង CI)។
- CI រត់លើ `ubuntu-latest` ជាមួយ least-privilege `GITHUB_TOKEN`។
- ពុម្ពអក្សរ self-hosted (OFL) — គ្មាន third-party font CDN។
- ណែនាំឲ្យរត់ `npm audit` ជាប្រចាំ និង review Dependabot alerts (គួរបើក Dependabot ក្នុង Settings → Security)។

## សម្រាប់អ្នកអភិវឌ្ឍន៍

- **កុំ commit secrets** — គ្មាន .env ត្រូវការ (គ្មាន secret ណាមួយក្នុងកម្មវិធីនេះ)។
- បើ token ធ្លាយ (ឧ. paste ក្នុង chat/issue) — revoke ភ្លាមៗក្នុង GitHub → Settings → Developer settings → Fine-grained tokens។
