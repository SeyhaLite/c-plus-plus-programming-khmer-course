import { el } from '../utils/dom';
import { icon } from './icons';
import { APP_NAME, APP_VERSION } from '../data/curriculum';
import { getState } from '../services/progress';
import { basePath, currentRoute, navigate } from './router';
import { openBugReportDialog } from '../features/bug-reports/dialog';
import { playSound } from '../services/audio';

// ============================================================
// App shell — topbar + navigation + footer + toasts
// ============================================================

export interface NavItem {
  path: string;
  label_km: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { path: '/', label_km: 'ទំព័រដើម', icon: 'home' },
  { path: '/plan', label_km: 'ផែនការសិក្សា', icon: 'plan' },
  { path: '/levels', label_km: 'កម្រិតសិក្សា', icon: 'levels' },
  { path: '/playground', label_km: 'ហាត់សរសេរកូដ', icon: 'code' },
  { path: '/library', label_km: 'បណ្ណាល័យ C++', icon: 'book' },
  { path: '/quiz', label_km: 'ពិនិត្យចំណេះដឹង', icon: 'clipboard' },
  { path: '/history', label_km: 'ប្រវត្តិការសិក្សា', icon: 'history' },
  { path: '/achievements', label_km: 'សមិទ្ធផល', icon: 'trophy' },
  { path: '/settings', label_km: 'ការកំណត់', icon: 'settings' },
  { path: '/help', label_km: 'ជំនួយ', icon: 'help' },
];

let statsEl: HTMLElement | null = null;

export function brandLogo(size = 36): HTMLElement {
  // Original compact SVG wordmark (មិនមែន logo ផ្លូវការ C++ — មើល docs/DECISIONS.md)
  const wrap = el('span', { class: 'brand' });
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Khmer C++ Academy');
  svg.classList.add('brand-logo');
  svg.innerHTML = `<rect width="64" height="64" rx="14" fill="#1e5eff"/><text x="32" y="42" font-family="Verdana, sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">C++</text><rect x="12" y="50" width="40" height="4" rx="2" fill="#ffc800"/>`;
  const name = el('span', { class: 'brand-name' }, APP_NAME, el('small', {}, 'រៀន C++ ជាភាសាខ្មែរ'));
  wrap.append(svg, name);
  return wrap;
}

function renderStats(): HTMLElement {
  const s = getState();
  const stats = el(
    'div',
    { class: 'topbar-stats' },
    el('span', { class: 'stat-chip', title: 'ពិន្ទុសរុប XP' }, icon('bolt', 16), el('span', {}, String(s.xp)), el('span', { class: 'stat-label' }, ' XP')),
    el('span', { class: 'stat-chip', title: 'ស្ទ្រីក — ចំនួនថ្ងៃជាប់គ្នា' }, icon('flame', 16), el('span', {}, String(s.streak.count)), el('span', { class: 'stat-label' }, ' ថ្ងៃ'))
  );
  return stats;
}

export function updateStats(): void {
  if (!statsEl) return;
  const fresh = renderStats();
  statsEl.replaceWith(fresh);
  statsEl = fresh;
}

export function renderShell(): HTMLElement {
  const app = document.getElementById('app');
  if (!app) throw new Error('missing #app');
  app.setAttribute('aria-busy', 'false');
  app.innerHTML = '';

  const menuBtn = el(
    'button',
    {
      class: 'menu-toggle',
      'aria-label': 'បើក/បិទម៉ឺនុយ',
      'aria-expanded': 'false',
      onclick: () => {
        const nav = document.querySelector('.main-nav');
        const open = nav?.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(Boolean(open)));
        playSound('click');
      },
    },
    icon('menu', 22)
  );

  statsEl = renderStats();

  const topbar = el(
    'header',
    { class: 'topbar' },
    el('div', { class: 'topbar-inner' }, el('a', { href: `${basePath()}/`, class: 'brand-link', 'aria-label': `${APP_NAME} — ទំព័រដើម` }, brandLogo()), statsEl, menuBtn)
  );

  const nav = el(
    'nav',
    { class: 'main-nav', 'aria-label': 'ម៉ឺនុយមេ' },
    el(
      'ul',
      {},
      ...navItems.map((item) =>
        el('li', {}, el('a', { href: `${basePath()}${item.path}` }, icon(item.icon, 17), item.label_km))
      )
    )
  );

  const main = el('main', { id: 'main', class: 'page', tabindex: '-1' });

  const footer = el(
    'footer',
    { class: 'footer' },
    el('p', {}, `${APP_NAME} v${APP_VERSION} · ឥតគិតថ្លៃ · ទិន្នន័យរក្សាទុកក្នុង browser របស់អ្នក · ដំណើរការលើ GitHub Pages`),
    el(
      'p',
      {},
      el('a', { href: `${basePath()}/help` }, 'ជំនួយ និងរាយការណ៍បញ្ហា'),
      ' · ',
      el('a', { href: 'https://github.com/SeyhaLite/c-plus-plus-programming-khmer-course', target: '_blank', rel: 'noopener' }, 'កូដប្រភពលើ GitHub')
    )
  );

  const bugBtn = el(
    'button',
    {
      class: 'btn btn-secondary bug-report-fab',
      'aria-label': 'រាយការណ៍បញ្ហា',
      title: 'រាយការណ៍បញ្ហា',
      onclick: () => openBugReportDialog(),
    },
    icon('bug', 18),
    el('span', { class: 'bug-report-label' }, 'រាយការណ៍បញ្ហា')
  );

  const toastRegion = el('div', { class: 'toast-region', role: 'status', 'aria-live': 'polite', id: 'toasts' });

  app.append(el('div', { class: 'app-shell' }, el('a', { class: 'skip-link', href: '#main' }, 'រំលងទៅមាតិកាមេ'), topbar, nav, main, footer), bugBtn, toastRegion);
  highlightNav();
  return main;
}

export function highlightNav(): void {
  const path = currentRoute();
  document.querySelectorAll('.main-nav a').forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    const itemPath = href.slice(basePath().length) || '/';
    const active = itemPath === path || (itemPath !== '/' && path.startsWith(itemPath));
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

export function showToast(message: string, kind: 'info' | 'success' | 'error' = 'info'): void {
  const region = document.getElementById('toasts');
  if (!region) return;
  const toast = el('div', { class: `toast ${kind}` }, message);
  region.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

export function breadcrumbs(items: { label: string; path?: string }[]): HTMLElement {
  return el(
    'nav',
    { class: 'breadcrumbs', 'aria-label': 'ផ្លូវទំព័រ' },
    el(
      'ol',
      {},
      ...items.map((it) =>
        el('li', {}, it.path ? el('a', { href: `${basePath()}${it.path}` }, it.label) : el('span', { 'aria-current': 'page' }, it.label))
      )
    )
  );
}

export function goMain(): HTMLElement {
  const main = document.getElementById('main');
  if (!main) return renderShell();
  main.innerHTML = '';
  return main as HTMLElement;
}

export { navigate };
