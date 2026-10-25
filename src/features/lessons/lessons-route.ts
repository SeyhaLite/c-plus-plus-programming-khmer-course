import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { getLesson, isLessonUnlocked } from '../../data/curriculum';
import { getState } from '../../services/progress';
import { breadcrumbs } from '../../app/layout';
import { basePath } from '../../app/router';
import { renderLessonView } from './lesson-view';

// ============================================================
// Lesson route — ដោះស្រាយមេរៀនដែល locked/planned/មិនមាន ដោយស្មោះត្រង់
// ============================================================

export function renderLessonRoute(levelId: string, lessonId: string, host: HTMLElement): void {
  host.innerHTML = '';
  const levelNum = Number(levelId);
  const lesson = getLesson(lessonId);

  if (!lesson || lesson.level_id !== levelNum) {
    host.append(
      breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'កម្រិតសិក្សា', path: '/levels' }]),
      el('h1', {}, 'រកមិនឃើញមេរៀន'),
      el('p', {}, `មេរៀន "${lessonId}" មិនមាននៅក្នុងកម្រិត ${levelId} ទេ។`),
      el('a', { class: 'btn btn-primary', href: `${basePath()}/levels/${levelId}` }, icon('chevronRight', 18), 'ទៅកម្រិត ', levelId)
    );
    return;
  }

  if (lesson.status !== 'published') {
    host.append(
      breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'កម្រិតសិក្សា', path: '/levels' }, { label: `កម្រិត ${levelId}`, path: `/levels/${levelId}` }]),
      el('h1', {}, lesson.title_km),
      el('div', { class: 'consent-box', role: 'status' },
        el('strong', {}, 'មេរៀននេះកំពុងរៀបចំ (planned)។ '),
        `មាតិកាពិតមិនទាន់មានទេ — យើងមិនបង្ហាញមេរៀនទទេជា "អាចរៀនបាន" នោះទេ។ សូមត្រឡប់ទៅកម្រិត និងរៀនមេរៀនដែលមាន។`),
      el('a', { class: 'btn btn-primary', href: `${basePath()}/levels/${levelId}` }, icon('chevronRight', 18), `ត្រឡប់ទៅកម្រិត ${levelId}`)
    );
    return;
  }

  const s = getState();
  if (!isLessonUnlocked(lesson, s.completedLessons)) {
    const prereq = lesson.prerequisites.map((p) => getLesson(p)).filter(Boolean);
    host.append(
      breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'កម្រិតសិក្សា', path: '/levels' }, { label: `កម្រិត ${levelId}`, path: `/levels/${levelId}` }]),
      el('h1', {}, icon('lock', 24), ' មេរៀននេះនៅបិទ'),
      el('p', {}, 'ដើម្បីដោះសោមេរៀននេះ សូមបញ្ចប់មេរៀនមុនជាមុនសិន៖'),
      el('ul', {}, ...prereq.map((p) => el('li', {},
        el('a', { href: `${basePath()}/levels/${p!.level_id}/lessons/${p!.id}` }, p!.title_km),
        s.completedLessons[p!.id] ? el('span', { class: 'tag tag-success', style: 'margin-inline-start:.5rem' }, '✓') : el('span', { class: 'tag tag-warning', style: 'margin-inline-start:.5rem' }, 'មិនទាន់បញ្ចប់')
      ))),
      el('a', { class: 'btn btn-primary', href: `${basePath()}/levels/${levelId}`, style: 'margin-top:1rem' }, 'ត្រឡប់ទៅកម្រិត ', levelId)
    );
    return;
  }

  renderLessonView(lesson, host);
}
