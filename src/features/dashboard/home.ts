import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { getState, getStorageWarning, levelProgress, overallProgress } from '../../services/progress';
import { allLevels, getLesson, lessonsOfLevel, nextRecommendedLesson, totalPublishedLessons } from '../../data/curriculum';
import { mascotSvg } from '../../app/character';
import { basePath } from '../../app/router';
import { achievements, getAchievement } from '../../data/achievements';

// ============================================================
// ទំព័រដើម (Dashboard)
// ============================================================

export function renderHome(host: HTMLElement): void {
  host.innerHTML = '';
  const s = getState();
  const overall = overallProgress();
  const warning = getStorageWarning();

  if (warning) {
    host.append(el('div', { class: 'consent-box', role: 'alert' }, icon('bug', 18), ' ', warning));
  }

  const startLevel = s.currentLevel ?? 0;
  const recommended = nextRecommendedLesson(s.completedLessons, startLevel);

  const hero = el('section', { class: 'hero' },
    el('div', { style: 'flex:1;min-width:260px' },
      el('h1', {}, 'សួស្តី! សូមស្វាគមន៍មកកាន់ Khmer C++ Academy'),
      el('p', {}, 'រៀន C++ ពីមូលដ្ឋានដល់កម្រិតវិជ្ជាជីវៈ ជាភាសាខ្មែរ — មេរៀនតាមជំហាន លំហាត់អន្តរកម្ម និងកន្លែងសរសេរកូដពិតប្រាកដ។ ឥតគិតថ្លៃទាំងស្រុង។'),
      el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem' },
        recommended
          ? el('a', { class: 'btn', href: `${basePath()}/levels/${recommended.level_id}/lessons/${recommended.id}` }, icon('play', 18), recommended ? `បន្តរៀន៖ ${recommended.title_km}` : 'ចាប់ផ្តើម')
          : el('a', { class: 'btn', href: `${basePath()}/levels/0` }, icon('play', 18), 'ចាប់ផ្តើមរៀន'),
        el('a', { class: 'btn btn-secondary', href: `${basePath()}/quiz`, style: 'background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.5)' }, icon('clipboard', 18), 'ពិនិត្យចំណេះដឹង'),
      )
    ),
    (() => { const m = mascotSvg('happy', 120); m.classList.add('hero-mascot'); return m; })()
  );

  host.append(hero);

  const grid = el('div', { class: 'dash-grid' });

  // Left column: next lesson + level progress
  const left = el('div', {});

  if (recommended) {
    const lesson = recommended;
    left.append(el('div', { class: 'card', style: 'margin-bottom:1rem' },
      el('h2', { style: 'font-size:1.1rem' }, icon('target', 20), ' មេរៀនណែនាំបន្ទាប់'),
      el('p', { style: 'font-weight:700' }, lesson.title_km, ' ', el('span', { class: 'tag tag-muted mono' }, lesson.title_en)),
      el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, `កម្រិត ${lesson.level_id} · ខ្នាត ${lesson.unit_id} · ប្រមាណ ${lesson.estimated_minutes} នាទី`),
      el('a', { class: 'btn btn-primary', href: `${basePath()}/levels/${lesson.level_id}/lessons/${lesson.id}` }, icon('play', 18), 'ចាប់ផ្តើមមេរៀន')
    ));
  }

  const levelCards = el('div', { class: 'card', style: 'margin-bottom:1rem' }, el('h2', { style: 'font-size:1.1rem' }, icon('levels', 20), ' វឌ្ឍនភាពតាមកម្រិត'));
  allLevels.slice(0, 6).forEach((level) => {
    const p = levelProgress(level.id);
    const publishedCount = lessonsOfLevel(level.id).filter((l) => l.status === 'published').length;
    levelCards.append(
      el('div', { style: 'margin-bottom:.75rem' },
        el('div', { style: 'display:flex;justify-content:space-between;font-size:.9rem' },
          el('a', { href: `${basePath()}/levels/${level.id}`, style: 'font-weight:600;text-decoration:none' }, `កម្រិត ${level.id} — ${level.title_km}`),
          el('span', { class: 'tag tag-muted' }, publishedCount === 0 ? 'កំពុងរៀបចំ' : `${p.done}/${p.total}`),
        ),
        publishedCount > 0 ? el('div', { class: 'progressbar', style: 'height:8px;margin-top:.25rem', role: 'progressbar', 'aria-valuenow': String(p.percent), 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': `វឌ្ឍនភាពកម្រិត ${level.id}` }, el('div', { style: `width:${p.percent}%` })) : null
      )
    );
  });
  left.append(levelCards);

  // Review queue
  if (s.reviewQueue.length > 0) {
    const reviewCard = el('div', { class: 'card', style: 'margin-bottom:1rem' },
      el('h2', { style: 'font-size:1.1rem' }, icon('refresh', 20), ' ត្រូវពិនិត្យឡើងវិញ'),
      el('p', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem' }, 'ចំណុចដែលអ្នកឆ្លើយខុស — សូមរៀនមេរៀនទាំងនេះឡើងវិញ៖')
    );
    const seen = new Set<string>();
    s.reviewQueue.slice(0, 5).forEach((r) => {
      if (seen.has(r.lessonId)) return;
      seen.add(r.lessonId);
      const lesson = getLesson(r.lessonId);
      reviewCard.append(el('div', { style: 'padding:.25rem 0' },
        el('a', { href: lesson ? `${basePath()}/levels/${lesson.level_id}/lessons/${lesson.id}` : `${basePath()}/levels` }, lesson?.title_km ?? r.lessonId),
        el('span', { class: 'tag tag-warning', style: 'margin-inline-start:.5rem' }, `ខុស ${r.wrongCount}×`)
      ));
    });
    left.append(reviewCard);
  }

  // Snippets
  if (s.snippets.length > 0) {
    const snipCard = el('div', { class: 'card' }, el('h2', { style: 'font-size:1.1rem' }, icon('save', 20), ' Snippets ដែលបានរក្សាទុក'));
    s.snippets.slice(0, 3).forEach((sn) => {
      snipCard.append(el('div', { style: 'display:flex;justify-content:space-between;gap:.5rem;padding:.25rem 0;font-size:.9rem' },
        el('span', {}, sn.title),
        el('a', { href: `${basePath()}/playground` }, 'បើកក្នុង playground →'),
      ));
    });
    left.append(snipCard);
  }

  // Right column: stats + activity + achievements
  const right = el('div', {});
  const statsCard = el('div', { class: 'card', style: 'margin-bottom:1rem' },
    el('h2', { style: 'font-size:1.1rem' }, icon('bolt', 20), ' ស្ថិតិសិក្សា'),
    el('ul', { class: 'kv-list' },
      el('li', {}, el('span', {}, 'XP សរុប'), el('strong', {}, String(s.xp))),
      el('li', {}, el('span', {}, 'ស្ទ្រីកបច្ចុប្បន្ន'), el('strong', {}, `${s.streak.count} ថ្ងៃ`)),
      el('li', {}, el('span', {}, 'មេរៀនបានបញ្ចប់'), el('strong', {}, `${overall.done}/${overall.total} (${overall.percent}%)`)),
      el('li', {}, el('span', {}, 'សមិទ្ធផល'), el('strong', {}, `${s.achievements.length}/${achievements.length}`)),
      el('li', {}, el('span', {}, 'មេរៀនដែលមានសរុប'), el('strong', {}, `${totalPublishedLessons()} published`)),
    )
  );

  const activityCard = el('div', { class: 'card', style: 'margin-bottom:1rem' }, el('h2', { style: 'font-size:1.1rem' }, icon('history', 20), ' សកម្មភាពថ្មីៗ'));
  if (s.activity.length === 0) {
    activityCard.append(el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, 'មិនទាន់មានសកម្មភាពទេ — ចាប់ផ្តើមមេរៀនដំបូងរបស់អ្នក!'));
  } else {
    activityCard.append(el('ul', { class: 'activity-list' },
      ...s.activity.slice(0, 6).map((a) => el('li', {},
        el('span', {}, a.detail_km ?? a.kind),
        el('time', { datetime: a.at }, new Date(a.at).toLocaleDateString('km-KH'))
      ))
    ));
  }

  const achieveCard = el('div', { class: 'card' }, el('h2', { style: 'font-size:1.1rem' }, icon('trophy', 20), ' សមិទ្ធផលថ្មីៗ'));
  const latest = s.achievements.slice(-3).reverse();
  achieveCard.append(latest.length === 0
    ? el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, 'បញ្ចប់មេរៀនដំបូង ដើម្បីទទួលសមិទ្ធផលដំបូងរបស់អ្នក!')
    : el('ul', { class: 'kv-list' }, ...latest.map((id) => {
        const a = getAchievement(id);
        return el('li', {}, el('span', {}, icon(a?.icon ?? 'star', 16), ` ${a?.title_km ?? id}`), el('span', { class: 'tag tag-success' }, '✓'));
      })));

  right.append(statsCard, activityCard, achieveCard);
  grid.append(left, right);
  host.append(grid);
}
