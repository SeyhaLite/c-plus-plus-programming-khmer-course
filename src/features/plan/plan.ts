import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { allLevels, getLesson, lessonsOfLevel, nextRecommendedLesson } from '../../data/curriculum';
import { getState, levelProgress } from '../../services/progress';
import { breadcrumbs } from '../../app/layout';
import { basePath } from '../../app/router';

// ============================================================
// ផែនការសិក្សា (Learning plan) — ទិដ្ឋភាពសង្ខេបតាមលំដាប់
// ============================================================

export function renderPlan(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'ផែនការសិក្សា' }]));
  const s = getState();
  host.append(el('h1', {}, 'ផែនការសិក្សា'));
  host.append(el('p', { class: 'help', style: 'color:var(--c-text-muted);max-width:72ch' },
    'ផ្លូវសិក្សាពេញលេញពីមូលដ្ឋានដល់គម្រោងវិជ្ជាជីវៈ។ កម្រិត ០–២ មានមាតិកាពេញលេញហើយ; កម្រិត ៣–១២ កំពុងរៀបចំតាមផែនការ — ឈ្មោះមេរៀនអាចប្តូរបាន។'));

  const recommended = nextRecommendedLesson(s.completedLessons, s.currentLevel ?? 0);
  if (recommended) {
    host.append(el('div', { class: 'feedback hint', style: 'margin:1rem 0' }, icon('target', 20),
      el('div', {}, `ជំហានបន្ទាប់របស់អ្នក៖ `, el('a', { href: `${basePath()}/levels/${recommended.level_id}/lessons/${recommended.id}` }, recommended.title_km))));
  }

  allLevels.forEach((level) => {
    const p = levelProgress(level.id);
    const lessons = lessonsOfLevel(level.id);
    const plannedOnly = lessons.every((l) => l.status !== 'published');
    const card = el('div', { class: 'card', style: 'margin-bottom:1rem' },
      el('div', { style: 'display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap;align-items:center' },
        el('h2', { style: 'font-size:1.1rem;margin:0' },
          el('a', { href: `${basePath()}/levels/${level.id}`, style: 'text-decoration:none;color:inherit' }, `កម្រិត ${level.id} — ${level.title_km}`)),
        el('span', { class: plannedOnly ? 'tag tag-muted' : p.percent === 100 ? 'tag tag-success' : 'tag tag-primary' },
          plannedOnly ? 'កំពុងរៀបចំ' : p.percent === 100 ? '✓ បញ្ចប់' : `${p.done}/${p.total}`),
      ),
      el('p', { style: 'font-size:.9rem;color:var(--c-text-muted);margin:.5rem 0' }, level.objective_km),
    );
    const list = el('ul', { style: 'font-size:.88rem;padding-inline-start:1.2rem;margin:.25rem 0 0' });
    lessons.forEach((l) => {
      const done = Boolean(s.completedLessons[l.id]);
      list.append(el('li', {},
        l.status === 'published'
          ? el('a', { href: `${basePath()}/levels/${level.id}/lessons/${l.id}` }, done ? '✓ ' : '', l.title_km)
          : el('span', { style: 'color:var(--c-text-muted)' }, `⏳ ${l.title_km}`)
      ));
    });
    card.append(list);
    host.append(card);
  });

  // Review link
  if (s.reviewQueue.length) {
    const seen = new Set<string>();
    const items = s.reviewQueue.filter((r) => (seen.has(r.lessonId) ? false : (seen.add(r.lessonId), true)));
    host.append(el('div', { class: 'card' },
      el('h2', { style: 'font-size:1.1rem' }, icon('refresh', 20), ` ត្រូវពិនិត្យឡើងវិញ (${items.length})`),
      el('ul', { class: 'kv-list' }, ...items.slice(0, 8).map((r) => {
        const lesson = getLesson(r.lessonId);
        return el('li', {},
          lesson ? el('a', { href: `${basePath()}/levels/${lesson.level_id}/lessons/${lesson.id}` }, lesson.title_km) : el('span', {}, r.lessonId),
          el('span', { class: 'tag tag-warning' }, `ខុស ${r.wrongCount}×`));
      })),
    ));
  }
}
