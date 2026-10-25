// One-off visual QA script: dark-theme quiz + lesson diagrams screenshots.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

const SHOTS = join(process.cwd(), '..', 'shots'); // repo lives one level below the workspace root
const root = join(process.cwd(), 'dist');
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  const BASE = '/c-plus-plus-programming-khmer-course';
  if (p.startsWith(BASE)) p = p.slice(BASE.length) || '/';
  let file = join(root, normalize(p).replace(/^(\.\.[\/\\])+/, ''));
  if (!existsSync(file) || file.endsWith('/')) file = join(root, 'index.html');
  try {
    const body = readFileSync(file);
    const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';
    res.setHeader('Content-Type', type); res.end(body);
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise(r => server.listen(4173, r));
const URL0 = 'http://localhost:4173/c-plus-plus-programming-khmer-course';

const browser = await chromium.launch();
// 1) quiz in DARK theme
let page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
await page.addInitScript(() => {
  localStorage.setItem('kca.progress.v1', JSON.stringify({ schemaVersion: 1, settings: { theme: 'dark', sound: false, reducedMotion: false, executionConsent: null }, completedLessons: {}, xp: 0, streak: { lastActiveDate: null, count: 0 }, reviewQueue: [], snippets: [], activity: [], achievements: [] }));
});
await page.goto(URL0 + '/quiz', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.click('.mc-option >> nth=0');
await page.screenshot({ path: join(SHOTS, 'quiz-dark.png') });
const probe = await page.evaluate(() => {
  const b = document.querySelector('.mc-option');
  const cs = getComputedStyle(b);
  return { bg: cs.backgroundColor, color: cs.color };
});
console.log('quiz dark option button:', JSON.stringify(probe));
await page.close();

// 2) lesson with diagrams (light), unlocked via fake progress
page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => {
  const done = {};
  for (const id of ['l0-what-is-cpp','l0-compiler','l0-how-to-use','l1-hello-world','l1-main-function','l1-statements-comments','l1-cout-output','l1-cin-input','l2-variables']) done[id] = { completedAt: '2026-10-25T00:00:00Z', score: 1, attempts: 1, hintsUsed: 0 };
  localStorage.setItem('kca.progress.v1', JSON.stringify({ schemaVersion: 1, settings: { theme: 'light', sound: false, reducedMotion: false, executionConsent: null }, completedLessons: done, xp: 200, streak: { lastActiveDate: null, count: 0 }, reviewQueue: [], snippets: [], activity: [], achievements: [] }));
});
await page.goto(URL0 + '/levels/2/lessons/l2-data-types', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('.lesson-diagrams').scrollIntoViewIfNeeded();
await page.screenshot({ path: join(SHOTS, 'lesson-diagram.png') });
console.log('diagram figures:', await page.locator('.diagram').count());
await browser.close();
server.close();
