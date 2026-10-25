// Visual QA script (manual): captures light/dark + loading-state screenshots.
// Usage: npm run test:visual   (serves dist/ locally; screenshots → ../shots)
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

const SHOTS = join(process.cwd(), '..', 'shots');
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
const UNLOCKED = JSON.stringify({
  schemaVersion: 1,
  settings: { theme: 'light', sound: false, reducedMotion: false, executionConsent: true },
  completedLessons: Object.fromEntries(
    ['l0-what-is-cpp','l0-compiler','l0-how-to-use','l1-hello-world','l1-main-function','l1-statements-comments','l1-cout-output','l1-cin-input','l2-variables']
      .map((id) => [id, { completedAt: '2026-10-25T00:00:00Z', score: 1, attempts: 1, hintsUsed: 0 }])
  ),
  xp: 200, streak: { lastActiveDate: null, count: 0 }, reviewQueue: [], snippets: [], activity: [], achievements: [],
});

const browser = await chromium.launch();

// 1) dark-theme quiz
let page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
await page.addInitScript((state) => localStorage.setItem('kca.progress.v1', state), JSON.stringify({ ...JSON.parse(UNLOCKED), settings: { theme: 'dark', sound: false, reducedMotion: false, executionConsent: true }, completedLessons: {} }));
await page.goto(URL0 + '/quiz', { waitUntil: 'networkidle' });
await page.click('.mc-option >> nth=0');
await page.screenshot({ path: join(SHOTS, 'quiz-dark.png') });
await page.close();

// 2) lesson: colored code + diagram
page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript((state) => localStorage.setItem('kca.progress.v1', state), UNLOCKED);
await page.goto(URL0 + '/levels/2/lessons/l2-data-types', { waitUntil: 'networkidle' });
await page.locator('.lesson-examples').scrollIntoViewIfNeeded();
await page.screenshot({ path: join(SHOTS, 'lesson-colored-code.png') });
await page.close();

// 3) playground: loading state (spinner + frozen buttons) then result
page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript((state) => localStorage.setItem('kca.progress.v1', state), UNLOCKED);
await page.goto(URL0 + '/playground', { waitUntil: 'networkidle' });
await page.waitForSelector('.cm-editor', { timeout: 15000 });
await page.click('button:has-text("ដំណើរការ")');
await page.waitForTimeout(900);
const loading = await page.evaluate(() => ({
  spinner: !!document.querySelector('.status-line .spinner'),
  runDisabled: document.querySelector('.playground-layout button')?.disabled ?? null,
  status: document.querySelector('.status-line')?.textContent?.trim(),
}));
console.log('loading state:', JSON.stringify(loading));
await page.screenshot({ path: join(SHOTS, 'playground-loading.png') });
await page.waitForFunction(() => (document.querySelector('.status-line')?.textContent || '').includes('exit code'), { timeout: 40000 });
await page.screenshot({ path: join(SHOTS, 'playground-result.png') });
console.log('result status:', await page.evaluate(() => document.querySelector('.status-line')?.textContent?.trim()));
await page.close();

await browser.close();
server.close();
console.log('visual QA screenshots saved');
