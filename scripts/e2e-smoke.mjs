import { chromium } from 'playwright';
// Real-browser smoke test (manual, not run in CI — needs `npx playwright install chromium`).
// Verifies: boot, :root tokens applied, lesson navigation, no console errors.
// Usage: npm run test:e2e [url]   (default: local dist server; pass live URL to check production)

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

const target = process.argv[2];
const root = join(process.cwd(), 'dist');
const server = target ? null : createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  const BASE = '/c-plus-plus-programming-khmer-course';
  if (p.startsWith(BASE)) p = p.slice(BASE.length) || '/';
  let file = join(root, normalize(p).replace(/^(\.\.[\/\\])+/, ''));
  if (!existsSync(file) || file.endsWith('/')) file = join(root, 'index.html'); // SPA fallback
  try {
    const body = readFileSync(file);
    const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';
    res.setHeader('Content-Type', type);
    res.end(body);
  } catch { res.statusCode = 404; res.end('nf'); }
});
if (server) await new Promise(r => server.listen(4173, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const url = target || 'http://localhost:4173/c-plus-plus-programming-khmer-course/';
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('.main-nav a', { timeout: 15000 }).catch(()=>console.log('WARN: nav not found'));
console.log('CONSOLE/PAGE ERRORS SO FAR:', errors.length ? errors.join(' | ') : '(none)');
const htmlSnip = await page.evaluate(() => document.getElementById('app') ? document.getElementById('app').innerHTML.slice(0,200) : 'NO #app');
console.log('APP HTML:', JSON.stringify(htmlSnip));
const diag = await page.evaluate(() => {
  const cs = getComputedStyle(document.body);
  const root = [...document.styleSheets[0].cssRules].find(r => r.selectorText === ':root');
  return {
    rootRuleFound: !!root,
    rootDecls: root ? root.style.length : 0,
    varBg: getComputedStyle(document.documentElement).getPropertyValue('--c-bg').trim(),
    bodyBg: cs.backgroundColor,
    bodyFont: cs.fontFamily.slice(0, 40),
    heroBg: getComputedStyle(document.querySelector('.hero')).backgroundImage.slice(0, 40),
    navLabelColor: document.querySelector('.main-nav a') ? getComputedStyle(document.querySelector('.main-nav a')).color : 'NO NAV',
  };
});
console.log('DIAG:', JSON.stringify(diag, null, 1));
console.log('JS ERRORS:', errors.length ? errors.join(' | ') : '(none)');
await page.screenshot({ path: 'reports/e2e-home.png' });
// navigate to a lesson for a second screenshot
await page.click('text=ចាប់ផ្តើមមេរៀន');
await page.waitForTimeout(600);
await page.screenshot({ path: 'reports/e2e-lesson.png' });
console.log('screenshots saved');
await browser.close();
if (server) server.close();
