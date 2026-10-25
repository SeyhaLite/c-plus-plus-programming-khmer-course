// ============================================================
// Router — History API SPA router សម្រាប់ GitHub Pages
// (deep links ដំណើរការតាម public/404.html redirect trick)
// ============================================================

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
}

type Handler = (match: RouteMatch, host: HTMLElement) => void | Promise<void>;

interface RouteDef {
  pattern: RegExp;
  keys: string[];
  handler: Handler;
}

const routes: RouteDef[] = [];
let notFoundHandler: Handler = () => {};
let currentPath = '/';

function toRegex(pattern: string): { regex: RegExp; keys: string[] } {
  const keys: string[] = [];
  const source = pattern
    .split('/')
    .map((seg) => {
      const m = /^:(\w+)$/.exec(seg);
      if (m) {
        keys.push(m[1]);
        return '([^/]+)';
      }
      return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { regex: new RegExp(`^${source}/?$`), keys };
}

export function route(pattern: string, handler: Handler): void {
  const { regex, keys } = toRegex(pattern);
  routes.push({ pattern: regex, keys, handler });
}

export function setNotFound(handler: Handler): void {
  notFoundHandler = handler;
}

export function navigate(path: string, replace = false): void {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const full = base + (path === '/' ? '/' : path);
  if (replace) history.replaceState({}, '', full);
  else history.pushState({}, '', full);
  void resolve(path);
}

export function currentRoute(): string {
  return currentPath;
}

export function basePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

export function pathFromLocation(): string {
  const base = basePath();
  let p = window.location.pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length);
  if (!p.startsWith('/')) p = '/' + p;
  return p === '' ? '/' : p;
}

async function resolve(path: string): Promise<void> {
  currentPath = path;
  const host = document.getElementById('app');
  if (!host) return;
  for (const r of routes) {
    const m = r.pattern.exec(path);
    if (m) {
      const params: Record<string, string> = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      await r.handler({ path, params, query: new URLSearchParams(window.location.search) }, host);
      window.scrollTo({ top: 0 });
      return;
    }
  }
  await notFoundHandler({ path, params: {}, query: new URLSearchParams(window.location.search) }, host);
}

export function startRouter(): void {
  window.addEventListener('popstate', () => void resolve(pathFromLocation()));
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const base = basePath();
    let internal: string | null = null;
    if (href.startsWith('/') && (!base || href.startsWith(base + '/') || href === base)) {
      internal = base && href.startsWith(base) ? href.slice(base.length) || '/' : href;
    }
    if (internal === null) return;
    e.preventDefault();
    navigate(internal);
    // collapse mobile menu after navigation
    document.querySelector('.main-nav')?.classList.remove('open');
  });
  void resolve(pathFromLocation());
}
