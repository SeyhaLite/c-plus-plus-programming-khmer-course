import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { allLevels, getLevel, getLesson, isLessonUnlocked, lessonsOfLevel } from '../../data/curriculum';
import { getState, levelProgress, selectLevel } from '../../services/progress';
import { breadcrumbs, showToast } from '../../app/layout';
import { basePath } from '../../app/router';

// ============================================================
// កម្រិតសិក្សា — level list + level detail (Duolingo-style path)
// ============================================================

export function renderLevels(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'កម្រិតសិក្សា' }]));
  const s = getState();
  host.append(el('h1', {}, 'កម្រិតសិក្សា'));
  host.append(el('p', { class: 'help', style: 'color:var(--c-text-muted);max-width:70ch' },
    'ជ្រើសរើសកម្រិតរបស់អ្នក។ មេរៀនត្រូវបានដោះសោតាមលំដាប់ — បញ្ចប់មេរៀនមុន ដើម្បីបើកមេរៀនបន្ទាប់។ កម្រិតដែលសម្គាល់ "កំពុងរៀបចំ" មានតែគម្រោងមាតិកា មិនទាន់មានមេរៀនពេញលេញទេ។'));

  if (s.currentLevel !== null) {
    host.append(el('p', {}, el('span', { class: 'tag tag-primary' }, `កម្រិតបច្ចុប្បន្នរបស់អ្នក៖ កម្រិត ${s.currentLevel}`)));
  }

  const grid = el('div', { class: 'card-grid', style: 'margin-top:1rem' });
  allLevels.forEach((level) => {
    const p = levelProgress(level.id);
    const hasContent = p.total > 0;
    const isCurrent = s.currentLevel === level.id;
    grid.append(
      el('a', {
        class: 'card',
        href: `${basePath()}/levels/${level.id}`,
        style: `text-decoration:none;color:inherit;display:block${isCurrent ? ';border-color:var(--c-primary)' : ''}`,
        'aria-label': `កម្រិត ${level.id} — ${level.title_km}${hasContent ? '' : ' (កំពុងរៀបចំ)'}`,
      },
        el('div', { style: 'display:flex;justify-content:space-between;align-items:start;gap:.5rem' },
          el('div', {},
            el('span', { class: 'tag', style: 'margin-bottom:.5rem' }, `កម្រិត ${level.id}`),
            el('h2', { style: 'font-size:1.05rem;margin:.25rem 0' }, level.title_km),
            el('div', { class: 'mono', style: 'font-size:.75rem;color:var(--c-text-muted)' }, level.title_en),
          ),
          hasContent
            ? el('span', { class: p.percent === 100 ? 'tag tag-success' : 'tag tag-primary' }, p.percent === 100 ? '✓ បានបញ្ចប់' : `${p.percent}%`)
            : el('span', { class: 'tag tag-muted' }, icon('lock', 14), ' កំពុងរៀបចំ'),
        ),
        el('p', { style: 'font-size:.85rem;color:var(--c-text-muted);margin-top:.5rem' }, level.objective_km),
        el('p', { style: 'font-size:.8rem;color:var(--c-text-muted)' }, icon('clock', 14), ` ប្រមាណ ${level.estimated_hours} ម៉ោង`),
        hasContent ? el('div', { class: 'progressbar', style: 'height:6px', role: 'progressbar', 'aria-valuenow': String(p.percent), 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': `វឌ្ឍនភាពកម្រិត ${level.id}` }, el('div', { style: `width:${p.percent}%` })) : null,
      )
    );
  });
  host.append(grid);
}

export function renderLevelDetail(levelId: number, host: HTMLElement): void {
  host.innerHTML = '';
  const level = getLevel(levelId);
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'កម្រិតសិក្សា', path: '/levels' }, { label: `កម្រិត ${levelId}` }]));
  if (!level) {
    host.append(el('h1', {}, 'មិនមានកម្រិតនេះទេ'), el('a', { class: 'btn btn-primary', href: `${basePath()}/levels` }, 'ត្រឡប់ទៅកម្រិតសិក្សា'));
    return;
  }
  const s = getState();
  const p = levelProgress(levelId);

  host.append(
    el('div', { class: 'card', style: 'margin-bottom:1.5rem' },
      el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;align-items:center' },
        el('span', { class: 'tag' }, `កម្រិត ${level.id}`),
        level.status === 'planned' ? el('span', { class: 'tag tag-muted' }, 'កំពុងរៀបចំ — មិនទាន់មានមេរៀន') : null,
        s.currentLevel === level.id ? el('span', { class: 'tag tag-primary' }, 'កម្រិតបច្ចុប្បន្នរបស់អ្នក') : null,
      ),
      el('h1', { style: 'margin-top:.5rem' }, level.title_km),
      el('p', { class: 'mono', style: 'color:var(--c-text-muted);font-size:.85rem' }, level.title_en),
      el('p', {}, el('strong', {}, 'គោលបំណង៖ '), level.objective_km),
      el('p', {}, el('strong', {}, 'លក្ខខណ្ឌមុន៖ '), level.prerequisites_km),
      el('ul', {}, el('strong', {}, 'លទ្ធផលសិក្សា៖'), ...level.outcomes_km.map((o) => el('li', {}, o))),
      el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, icon('clock', 14), ` ប្រមាណ ${level.estimated_hours} ម៉ោង${p.total ? ` · បញ្ចប់ ${p.done}/${p.total} មេរៀន` : ''}`),
      level.status !== 'planned' && s.currentLevel !== level.id
        ? el('button', { class: 'btn btn-primary', onclick: () => { selectLevel(level.id); showToast(`បានជ្រើសរើសកម្រិត ${level.id} ជាកម្រិតសិក្សារបស់អ្នក`, 'success'); renderLevelDetail(levelId, host); } }, icon('target', 18), 'ជ្រើសរើសជាកម្រិតសិក្សារបស់ខ្ញុំ')
        : null
    )
  );

  if (level.status === 'planned') {
    host.append(el('div', { class: 'consent-box' },
      el('strong', {}, 'មាតិកាកំពុងរៀបចំ។ '),
      'មេរៀនខាងក្រោមជាគម្រោង — ឈ្មោះនិងលំដាប់អាចប្តូរបាន។ យើងមិនបង្ហាញមេរៀនដែលមិនទាន់មានមាតិកាពិតជា "បានបញ្ចប់" ទេ។ សូមរៀនកម្រិត ០–២ ដែលមានពេញលេញជាមុនសិន។'
    ));
  }

  level.units.forEach((unit) => {
    host.append(el('h2', { style: 'margin-top:1.5rem;font-size:1.2rem' }, unit.title_km));
    const path = el('div', { class: 'level-path', role: 'list', 'aria-label': unit.title_km });
    unit.lessonIds.forEach((lessonId, i) => {
      const lesson = getLesson(lessonId);
      if (!lesson) return;
      const done = Boolean(s.completedLessons[lesson.id]);
      const unlocked = isLessonUnlocked(lesson, s.completedLessons);
      const planned = lesson.status !== 'published';
      if (i > 0) path.append(el('div', { class: 'path-connector', 'aria-hidden': 'true' }));

      const statusTag = planned
        ? el('span', { class: 'tag tag-muted' }, icon('lock', 14), ' កំពុងរៀបចំ')
        : done
          ? el('span', { class: 'tag tag-success' }, icon('check', 14), ' បានបញ្ចប់')
          : unlocked
            ? el('span', { class: 'tag tag-primary' }, 'អាចរៀនបាន')
            : el('span', { class: 'tag tag-muted' }, icon('lock', 14), ' ត្រូវបញ្ចប់មេរៀនមុន');

      const node = el('div', {
        class: `path-node${done ? ' done' : ''}${!unlocked && !planned ? ' locked' : ''}${planned ? ' planned' : ''}`,
        role: 'listitem',
      },
        el('div', { class: 'node-icon' }, icon(done ? 'check' : planned ? 'lock' : unlocked ? 'play' : 'lock', 24)),
        el('div', { class: 'node-body' },
          el('div', { class: 'node-title' }, lesson.title_km),
          el('div', { class: 'node-sub' }, `${lesson.title_en} · ${lesson.estimated_minutes} នាទី`),
        ),
        statusTag
      );

      if (!planned && unlocked) {
        const link = el('a', {
          href: `${basePath()}/levels/${level.id}/lessons/${lesson.id}`,
          'aria-label': `បើកមេរៀន ${lesson.title_km}`,
          style: 'position:absolute;inset:0;',
        });
        node.style.position = 'relative';
        node.append(link);
      }
      path.append(node);
    });
    host.append(path);
  });

  const lessons = lessonsOfLevel(levelId);
  if (lessons.length === 0) return;

  // Completion criteria + next steps
  const allDone = p.total > 0 && p.done === p.total;
  const nextLevel = getLevel(levelId + 1);
  host.append(el('div', { class: 'card', style: 'margin-top:1.5rem' },
    el('h2', { style: 'font-size:1rem' }, 'លក្ខខណ្ឌបញ្ចប់កម្រិត និងជំហានបន្ទាប់'),
    el('ul', { class: 'kv-list' },
      el('li', {}, el('span', {}, 'បញ្ចប់មេរៀន published ទាំងអស់'), el('span', {}, `${p.done}/${p.total} ${allDone ? '✓' : ''}`)),
    ),
    allDone && nextLevel
      ? el('p', { style: 'margin-top:.5rem' }, `អបអរសាទរ! ជំហានបន្ទាប់៖ `, el('a', { href: `${basePath()}/levels/${nextLevel.id}` }, `កម្រិត ${nextLevel.id} — ${nextLevel.title_km}`))
      : !allDone
        ? el('p', { style: 'margin-top:.5rem;color:var(--c-text-muted);font-size:.9rem' }, 'បញ្ចប់មេរៀនទាំងអស់ក្នុងកម្រិតនេះ ដើម្បីទទួលសមិទ្ធផលកម្រិត និងការណែនាំទៅកម្រិតបន្ទាប់។')
        : null
  ));
}
