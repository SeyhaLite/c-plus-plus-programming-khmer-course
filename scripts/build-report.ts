// ============================================================
// scripts/build-report.ts — curriculum completeness report
// Generates reports/curriculum-completeness.md
// Usage: npx tsx scripts/build-report.ts
//
// ស្ថានភាពមាតិកា (content statuses):
//  - Published: មានមាតិកាពេញលេញ និងបង្ហាញលើគេហទំព័រ
//  - Draft: មានមាតិកា ប៉ុន្តែមិនទាន់បង្ហាញ (មិនមាននៅឡើយ)
//  - Planned: មានតែ metadata ក្នុងផែនការ
//  - Tested: published + ឧទាហរណ៍ C++ ផ្ទៀងផ្ទាត់ដោយ g++ ក្នុង CI
//    (មើល .github/workflows/ci.yml; ស្គាល់ចំនួនផ្ទៀងផ្ទាត់ពីឯកសារ test)
// ============================================================
import { writeFileSync, mkdirSync } from 'node:fs';
import { allLessons, allLevels, lessonsOfLevel } from '../src/data/curriculum';

const now = new Date().toISOString();
const lines: string[] = [];
lines.push('# របាយការណ៍ភាពពេញលេញនៃមាតិកា (Curriculum Completeness Report)');
lines.push('');
lines.push(`> បង្កើតស្វ្យ័យប្រវត្តិដោយ \`npm run report\` — ${now}`);
lines.push('> សូមកុំកែដោយដៃ; កែតាមរយៈ curriculum data ហើយរត់ script នេះឡើងវិញ។');
lines.push('');

const published = allLessons.filter((l) => l.status === 'published');
const planned = allLessons.filter((l) => l.status === 'planned');
const draft = allLessons.filter((l) => l.status === 'draft');
const exercisesTotal = published.reduce((n, l) => n + l.exercises.length, 0);
const examplesWithOutput = published.reduce((n, l) => n + l.examples.filter((e) => e.expectedOutput !== undefined).length, 0);
const codeChallenges = published.reduce((n, l) => n + l.exercises.filter((e) => e.type === 'code_challenge').length, 0);

lines.push('## សង្ខេប (Summary)');
lines.push('');
lines.push('| រង្វាស់ | ចំនួន |');
lines.push('| --- | --- |');
lines.push(`| កម្រិតសរុប | ${allLevels.length} |`);
lines.push(`| កម្រិតមានមាតិកា published | ${allLevels.filter((lv) => lv.status === 'published').length} |`);
lines.push(`| មេរៀន Published | ${published.length} |`);
lines.push(`| មេរៀន Draft | ${draft.length} |`);
lines.push(`| មេរៀន Planned | ${planned.length} |`);
lines.push(`| លំហាត់សរុប (published) | ${exercisesTotal} |`);
lines.push(`| ឧទាហរណ៍ C++ មាន expected output (ផ្ទៀងផ្ទាត់ដោយ g++ ក្នុង CI) | ${examplesWithOutput} |`);
lines.push(`| លំហាត់សរសេរកូដ (code challenges ជាមួយ test cases) | ${codeChallenges} |`);
lines.push('');

lines.push('## ស្ថានភាពតាមកម្រិត (Per-level status)');
lines.push('');
lines.push('| កម្រិត | ឈ្មោះ | ស្ថានភាព | មេរៀន published | មេរៀន planned |');
lines.push('| --- | --- | --- | --- | --- |');
for (const lv of allLevels) {
  const lessons = lessonsOfLevel(lv.id);
  const pub = lessons.filter((l) => l.status === 'published').length;
  const plan = lessons.filter((l) => l.status === 'planned').length;
  lines.push(`| ${lv.id} | ${lv.title_km} (${lv.title_en}) | ${lv.status} | ${pub} | ${plan} |`);
}
lines.push('');

lines.push('## មេរៀន Published (លម្អិត)');
lines.push('');
lines.push('| Lesson ID | ចំណងជើង | លំហាត់ | ឧទាហរណ៍ | នាទី | កំណែ |');
lines.push('| --- | --- | --- | --- | --- | --- |');
for (const l of published) {
  lines.push(`| ${l.id} | ${l.title_km} | ${l.exercises.length} | ${l.examples.length} | ${l.estimated_minutes} | ${l.version} |`);
}
lines.push('');

lines.push('## និយមន័យស្ថានភាព (Status definitions)');
lines.push('');
lines.push('- **Published** — មាតិកាពេញលេញ បង្ហាញលើគេហទំព័រ មានលំហាត់ និងការពិនិត្យដោយ validation tests');
lines.push('- **Tested** — published មេរៀនដែលឧទាហរណ៍ C++ ទាំងអស់ត្រូវបាន compile+run ដោយ g++ 17 ក្នុង CI ជារាល់ push (មើល workflow `ci.yml`)');
lines.push('- **Draft** — មានមាតិកាខ្លះ ប៉ុន្តែមិនទាន់បង្ហាញ (status draft មិន render លើ site ទេ)');
lines.push('- **Planned** — មានតែ metadata គម្រោង UI បង្ហាញជា "កំពុងរៀបចំ" មិនអនុញ្ញាតឲ្យចូល');
lines.push('- **Needs revision** — គ្មានមេរៀនណាស្ថិតក្នុងស្ថានភាពនេះទេ នៅពេលរបាយការណ៍នេះបង្កើត');
lines.push('');

mkdirSync('reports', { recursive: true });
writeFileSync('reports/curriculum-completeness.md', lines.join('\n'), 'utf8');
console.log('Report written to reports/curriculum-completeness.md');
