import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { getState } from '../../services/progress';
import { getLesson, getLevel } from '../../data/curriculum';
import { breadcrumbs } from '../../app/layout';
import { basePath } from '../../app/router';

// ============================================================
// ប្រវត្តិការសិក្សា (History / activity log)
// ============================================================

export function renderHistory(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'ប្រវត្តិការសិក្សា' }]));
  host.append(el('h1', {}, 'ប្រវត្តិការសិក្សា'));

  const s = getState();
  const completed = Object.entries(s.completedLessons).sort((a, b) => b[1].completedAt.localeCompare(a[1].completedAt));

  host.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.05rem' }, icon('check', 18), ` មេរៀនដែលបានបញ្ចប់ (${completed.length})`),
    completed.length === 0
      ? el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, 'មិនទាន់មានមេរៀនបានបញ្ចប់ទេ។')
      : el('table', { style: 'width:100%;border-collapse:collapse;font-size:.9rem' },
          el('thead', {}, el('tr', {}, ...['មេរៀន', 'កម្រិត', 'ថ្ងៃបញ្ចប់', 'ពិន្ទុ', 'ការព្យាយាម'].map((h) => el('th', { style: 'text-align:start;padding:.4rem;border-bottom:2px solid var(--c-border)' }, h)))),
          el('tbody', {}, ...completed.map(([id, rec]) => {
            const lesson = getLesson(id);
            const level = lesson ? getLevel(lesson.level_id) : null;
            return el('tr', {},
              el('td', { style: 'padding:.4rem;border-bottom:1px solid var(--c-border)' },
                lesson ? el('a', { href: `${basePath()}/levels/${lesson.level_id}/lessons/${lesson.id}` }, lesson.title_km) : el('span', {}, id)),
              el('td', { style: 'padding:.4rem;border-bottom:1px solid var(--c-border)' }, level ? `${level.id} — ${level.title_km}` : '?'),
              el('td', { style: 'padding:.4rem;border-bottom:1px solid var(--c-border)' }, new Date(rec.completedAt).toLocaleString('km-KH')),
              el('td', { style: 'padding:.4rem;border-bottom:1px solid var(--c-border)' }, `${Math.round(rec.score * 100)}%`),
              el('td', { style: 'padding:.4rem;border-bottom:1px solid var(--c-border)' }, String(rec.attempts)),
            );
          }))
        )
  ));

  host.append(el('div', { class: 'card' },
    el('h2', { style: 'font-size:1.05rem' }, icon('history', 18), ' សកម្មភាពទាំងអស់'),
    s.activity.length === 0
      ? el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, 'មិនទាន់មានសកម្មភាពទេ។')
      : el('ul', { class: 'activity-list' }, ...s.activity.map((a) => el('li', {},
          el('span', {}, a.detail_km ?? a.kind),
          el('time', { datetime: a.at }, new Date(a.at).toLocaleString('km-KH'))
        )))
  ));

  host.append(el('p', { class: 'help', style: 'color:var(--c-text-muted);margin-top:1rem;font-size:.85rem' },
    'ប្រវត្តិទាំងអស់រក្សាទុកក្នុង browser របស់អ្នកប៉ុណ្ណោះ។ អ្នកអាចនាំចេញ/នាំចូល ឬលុបវាបានពីទំព័រ ',
    el('a', { href: `${basePath()}/settings` }, 'ការកំណត់'), '។'));
}
