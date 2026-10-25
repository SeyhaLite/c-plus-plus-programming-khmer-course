# ការដាក់ពង្រាយ (DEPLOYMENT) — GitHub Pages ឥតគិតថ្លៃ

## របៀបដែលវាដំណើរការ

1. Push ទៅសាខា `main`
2. Workflow `.github/workflows/deploy.yml` ដំណើរការ៖ `npm ci` → typecheck → tests → **g++ ផ្ទៀងផ្ទាត់ឧទាហរណ៍ C++** → `vite build` → upload `dist/` → deploy ដោយ `actions/deploy-pages@v4`
3. Build ខូច = មិន deploy (job verify បរាជ័យមុន deploy)

Permissions (least privilege)៖ `contents: read`, `pages: write`, `id-token: write` — គ្មាន secret ណាត្រូវការ (GITHUB_TOKEN ស្វ័យប្រវត្តិ)។

## ការកំណត់ដែលត្រូវធ្វើក្នុង GitHub (ម្តងគត់)

ជាភាសាខ្មែរ ជាជំហានៗ៖

1. បើក repository `SeyhaLite/c-plus-plus-programming-khmer-course` លើ github.com
2. ចូល **Settings → Pages**
3. ត្រង់ **Build and deployment → Source** ជ្រើសរើស **GitHub Actions** (មិនមែន "Deploy from a branch")
4. ចប់។ Push ទៅ `main` នឹង deploy ស្វ័យប្រវត្តិ។

URL ផលិតកម្ម៖ `https://seyhalite.github.io/c-plus-plus-programming-khmer-course/`

## Base path និង routing

- Vite `base` = `/c-plus-plus-programming-khmer-course/` (កំណត់ក្នុង `vite.config.ts`) — រាល់ asset និង link ខាងក្នុងប្រើផ្លូវនេះ។ បើផ្លាស់ប្តូរឈ្មោះ repo ឬដាក់លើ custom domain/root ត្រូវកែ `base`។
- Deep links (ឧ. ផ្ទុកឡើងវិញទំព័រមេរៀន) ដំណើរការតាម `public/404.html` redirect trick → index.html ស្តារ route វិញ។
- ទំព័រ 404 ក្នុងកម្មវិធី (ជាភាសាខ្មែរ) មានស្រាប់សម្រាប់ route មិនស្គាល់។

## ដំណើរការក្នុងម៉ាស៊ីនផ្ទាល់ (Local development)

```bash
npm ci          # ដំឡើង dependencies តាម lockfile
npm run dev     # dev server (http://localhost:5173/c-plus-plus-programming-khmer-course/)
npm test        # tests
npm run build   # production build → dist/
npm run preview # សាកល្បង production build ក្នុងម៉ាស៊ីន
```

## ដែនកំណត់ GitHub Pages (អានមុន)

- Static hosting ប៉ុណ្ណោះ — គ្មាន backend។ ការដំណើរការកូដ C++ ពឹងផ្អែកសេវាខាងក្រៅ Wandbox (មើល [DECISIONS.md](./DECISIONS.md#d3-ការដំណើរការកូដ-c))។
- ដែនកំណត់ទំហំ/traffic របស់ GitHub Pages អនុវត្ត (site ~2MB build បច្ចុប្បន្ន — ឆ្ងាយពីដែនកំណត់)។
- Deployment អាចចំណាយពេល ១–២ នាទីក្រោយ push។

## សេវាបម្រុងសម្រាប់ execution (optional, មិនចាំបាច់)

បើ Wandbox ប្តូរគោលការណ៍ អ្នកអាច host **Piston** ផ្ទាល់ខ្លួន (docker `ghcr.io/engineer-man/piston`) ហើយប្តូរ `WANDBOX_URL`/adapter ក្នុង `src/services/code-execution.ts`។ នេះជា deployment ដាច់ដោយឡែក មិនមែនផ្នែកនៃ static site ទេ។
