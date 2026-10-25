// Fonts — self-hosted via @fontsource (OFL license, pinned through package-lock)
import '@fontsource/noto-sans-khmer/400.css';
import '@fontsource/noto-sans-khmer/600.css';
import '@fontsource/noto-sans-khmer/700.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/600.css';
import '@fontsource/noto-sans/700.css';
import '@fontsource/fira-code/400.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import { route, setNotFound, startRouter } from './app/router';
import { renderShell, goMain, highlightNav, showToast } from './app/layout';
import { initProgress } from './services/progress';
import { renderHome } from './features/dashboard/home';
import { renderPlan } from './features/plan/plan';
import { renderLevels, renderLevelDetail } from './features/curriculum/levels';
import { renderQuiz } from './features/quiz/quiz';
import { renderLibrary } from './features/library/library';
import { renderHistory } from './features/history/history';
import { renderAchievements } from './features/achievements/achievements';
import { renderSettings, applySettings } from './features/settings/settings';
import { renderHelp } from './features/help/help';
import { renderLessonRoute } from './features/lessons/lessons-route';
import { el } from './utils/dom';
import { basePath } from './app/router';

// ============================================================
// Entry point
// ============================================================

initProgress();
renderShell();
applySettings();

function page(fn: (host: HTMLElement) => void): (m: unknown, host: HTMLElement) => void {
  return (_m, _host) => {
    const main = goMain();
    highlightNav();
    fn(main);
  };
}

route('/', page(renderHome));
route('/plan', page(renderPlan));
route('/levels', page(renderLevels));
route('/levels/:id', (m, _host) => {
  const main = goMain();
  highlightNav();
  const id = Number((m as { params: Record<string, string> }).params.id);
  if (Number.isNaN(id)) {
    main.append(el('h1', {}, 'កម្រិតមិនត្រឹមត្រូវ'), el('a', { class: 'btn btn-primary', href: `${basePath()}/levels` }, 'ទៅកម្រិតសិក្សា'));
    return;
  }
  renderLevelDetail(id, main);
});
route('/levels/:id/lessons/:lessonId', (m, _host) => {
  const main = goMain();
  highlightNav();
  const p = (m as { params: Record<string, string> }).params;
  renderLessonRoute(p.id, p.lessonId, main);
});
route('/quiz', page(renderQuiz));
route('/library', page(renderLibrary));
route('/history', page(renderHistory));
route('/achievements', page(renderAchievements));
route('/settings', page(renderSettings));
route('/help', page(renderHelp));

// Playground is lazy-loaded (CodeMirror chunk stays out of lesson pages)
route('/playground', async (_m, _host) => {
  const main = goMain();
  highlightNav();
  main.append(el('p', { role: 'status' }, 'កំពុងផ្ទុកកន្លែងសរសេរកូដ…'));
  const { renderPlayground } = await import('./features/playground/playground');
  await renderPlayground(main);
});

setNotFound(page((host) => {
  host.append(
    el('h1', {}, '៤០៤ — រកមិនឃើញទំព័រ'),
    el('p', {}, 'ទំព័រដែលអ្នកសុំមិនមានទេ។ វាអាចត្រូវបានផ្លាស់ប្តូរ ឬអ្នកវាយ URL ខុស។'),
    el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap' },
      el('a', { class: 'btn btn-primary', href: `${basePath()}/` }, 'ទៅទំព័រដើម'),
      el('a', { class: 'btn btn-secondary', href: `${basePath()}/levels` }, 'ទៅកម្រិតសិក្សា'),
      el('a', { class: 'btn btn-secondary', href: `${basePath()}/help` }, 'ជំនួយ និងរាយការណ៍បញ្ហា'),
    )
  );
  showToast('រកមិនឃើញទំព័រ (404)', 'error');
}));

startRouter();
