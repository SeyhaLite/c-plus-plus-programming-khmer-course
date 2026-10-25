// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';

// ============================================================
// App boot smoke test — imports the REAL entry point (main.ts)
// and verifies the shell + router render without runtime errors.
// ============================================================

describe('app boot (main.ts entry)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="app" aria-busy="true"></div>';
  });

  it('boots, renders shell, and shows the dashboard without throwing', async () => {
    await import('../../src/main');
    // give the router's async resolve a tick
    await new Promise((r) => setTimeout(r, 50));
    const app = document.getElementById('app')!;
    expect(app.getAttribute('aria-busy')).toBe('false');
    expect(app.querySelector('.topbar')).toBeTruthy();
    expect(app.querySelector('.main-nav')).toBeTruthy();
    expect(app.querySelectorAll('.main-nav a').length).toBe(10);
    expect(app.querySelector('.footer')).toBeTruthy();
    // Dashboard content rendered
    const main = app.querySelector('#main')!;
    expect(main.textContent).toContain('Khmer C++ Academy');
    expect(main.querySelector('.hero')).toBeTruthy();
    // nav active state
    expect(app.querySelector('.main-nav a[aria-current="page"]')).toBeTruthy();
  });

  it('navigates to /levels and a lesson deep-link client-side', async () => {
    await import('../../src/main');
    await new Promise((r) => setTimeout(r, 30));
    const { navigate } = await import('../../src/app/router');
    navigate('/levels');
    await new Promise((r) => setTimeout(r, 30));
    expect(document.querySelector('#main')!.textContent).toContain('កម្រិតសិក្សា');
    expect(document.querySelectorAll('.card-grid a.card').length).toBeGreaterThanOrEqual(13);

    navigate('/levels/0');
    await new Promise((r) => setTimeout(r, 30));
    expect(document.querySelector('#main')!.textContent).toContain('ការត្រៀមខ្លួន');
    expect(document.querySelectorAll('.path-node').length).toBe(3);

    navigate('/levels/0/lessons/l0-what-is-cpp');
    await new Promise((r) => setTimeout(r, 30));
    const main = document.querySelector('#main')!;
    expect(main.textContent).toContain('តើ C++ ជាអ្វី?');
    expect(main.querySelectorAll('.exercise').length).toBe(3);
  });

  it('renders 404 page for unknown routes', async () => {
    await import('../../src/main');
    await new Promise((r) => setTimeout(r, 30));
    const { navigate } = await import('../../src/app/router');
    navigate('/no-such-page');
    await new Promise((r) => setTimeout(r, 30));
    expect(document.querySelector('#main')!.textContent).toContain('៤០៤');
  });
});
