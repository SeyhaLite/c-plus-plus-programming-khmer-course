import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { getState } from '../../services/progress';
import { achievements } from '../../data/achievements';
import { breadcrumbs } from '../../app/layout';

// ============================================================
// សមិទ្ធផល (Achievements)
// ============================================================

export function renderAchievements(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'សមិទ្ធផល' }]));
  const s = getState();
  const earned = new Set(s.achievements);

  host.append(el('h1', {}, 'សមិទ្ធផល'),
    el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, `ទទួលបាន ${earned.size}/${achievements.length} សមិទ្ធផល។ សមិទ្ធផលនីមួយៗមានលក្ខខណ្ឌច្បាស់លាស់ — គ្មានការផ្តល់ដោយចៃដន្យទេ។`));

  const grid = el('div', { class: 'card-grid', style: 'margin-top:1rem' });
  achievements.forEach((a) => {
    const has = earned.has(a.id);
    grid.append(el('div', { class: 'card', style: has ? 'border-color:var(--c-success)' : 'opacity:.65' },
      el('div', { style: 'display:flex;align-items:center;gap:.75rem' },
        el('div', { style: `width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none;background:${has ? 'var(--c-success-soft)' : 'var(--c-surface-2)'};color:${has ? 'var(--c-success)' : 'var(--c-text-muted)'}` }, icon(a.icon, 22)),
        el('div', {},
          el('h2', { style: 'font-size:1rem;margin:0' }, a.title_km),
          el('p', { style: 'font-size:.85rem;color:var(--c-text-muted);margin:.25rem 0 0' }, a.description_km),
        ),
      ),
      el('div', { style: 'margin-top:.5rem' }, has
        ? el('span', { class: 'tag tag-success' }, icon('check', 14), ' ទទួលបានហើយ')
        : el('span', { class: 'tag tag-muted' }, icon('lock', 14), ' មិនទាន់'))
    ));
  });
  host.append(grid);
}
