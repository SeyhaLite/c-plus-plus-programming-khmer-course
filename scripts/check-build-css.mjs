// ============================================================
// Post-build CSS sanity check — chained after `vite build`.
// Fails the build if the bundled stylesheet lost the :root
// design-token rule (incident 2026-10-25) or ships invalid CSS.
// Usage: node scripts/check-build-css.mjs
// ============================================================
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const assetsDir = join(process.cwd(), 'dist', 'assets');
const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
if (cssFiles.length === 0) {
  console.error('FAIL: no CSS found in dist/assets');
  process.exit(1);
}

let failed = false;
for (const f of cssFiles) {
  const css = readFileSync(join(assetsDir, f), 'utf8');
  const checks = [
    [':root{ or :root { present', /:root\s*\{/.test(css)],
    ['--c-primary token defined in :root scope', /--c-primary:/.test(css)],
    ['--font-km token defined', /--font-km:/.test(css)],
    ['balanced braces', (css.match(/{/g) || []).length === (css.match(/}/g) || []).length],
    ['no // line comments', !/^\s*\/\//m.test(css)],
  ];
  for (const [name, ok] of checks) {
    if (!ok) {
      failed = true;
      console.error(`FAIL ${f}: ${name}`);
    }
  }
  if (!failed) console.log(`ok   ${f}: :root + tokens present, balanced`);
}
process.exit(failed ? 1 : 0);
