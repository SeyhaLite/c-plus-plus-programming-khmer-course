import type { Lesson } from '../../types';
import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { renderMarkdown } from '../../utils/markdown';
import { highlightedCode } from '../../utils/highlight';
import { pickPhrase, cheerIdle, cheerComplete } from '../../data/encouragement';
import { renderExercise, type ExerciseHandle } from '../../components/exercises';
import { renderDiagram } from '../../components/diagrams';
import { completeLesson, getState } from '../../services/progress';
import { mascotBubble } from '../../app/character';
import { breadcrumbs, showToast, updateStats } from '../../app/layout';
import { basePath, navigate } from '../../app/router';
import { getLesson, getLevel, lessonsOfLevel, isLessonUnlocked } from '../../data/curriculum';
import { getAchievement } from '../../data/achievements';
import { playSound } from '../../services/audio';
import { copyText } from '../../services/diagnostics';

// ============================================================
// បទពិសោធន៍មេរៀន៖ ផែនទីមេរៀន + មាតិកាជាជំហាន + លំហាត់ + មតិត្រឡប់
// រចនាបថយកគំនិតពីកម្មវិធីសិក្សាអន្តរកម្ម GDQuest ប៉ុន្តែ UI និងខ្លឹមសារ
// ត្រូវបានរៀបចំថ្មីសម្រាប់ C++ និងអ្នកសិក្សាភាសាខ្មែរ។
// ============================================================

function renderCourseNavigation(lesson: Lesson): HTMLElement {
  const level = getLevel(lesson.level_id);
  const completed = getState().completedLessons;
  const all = level ? lessonsOfLevel(level.id) : [];
  const doneCount = all.filter((item) => Boolean(completed[item.id])).length;
  return el(
    'aside',
    { class: 'lesson-course-nav', 'aria-label': 'ផែនទីមេរៀនក្នុងកម្រិតនេះ' },
    el(
      'div',
      { class: 'lesson-course-nav__header' },
      el('span', { class: 'lesson-rail-eyebrow' }, 'ផែនការសិក្សា'),
      el('strong', {}, level ? 'កម្រិត ' + level.id + ' · ' + level.title_km : 'មេរៀន'),
      el('div', { class: 'lesson-rail-progress' },
        el('div', { class: 'progressbar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(all.length), 'aria-valuenow': String(doneCount), 'aria-label': 'មេរៀនដែលបានបញ្ចប់' },
          el('div', { style: 'width:' + (all.length ? (doneCount / all.length) * 100 : 0) + '%' })
        ),
        el('span', {}, doneCount + '/' + all.length + ' មេរៀន')
      )
    ),
    el(
      'div',
      { class: 'lesson-course-nav__body' },
      ...(level ? level.units.map((unit) => {
        const unitLessons = unit.lessonIds.map((id) => getLesson(id)).filter((item): item is Lesson => Boolean(item));
        const items = unitLessons.map((item) => {
          const done = Boolean(completed[item.id]);
          const active = item.id === lesson.id;
          const planned = item.status !== 'published';
          const unlocked = !planned && isLessonUnlocked(item, completed);
          const stateText = planned ? 'កំពុងរៀបចំ' : done ? 'បានបញ្ចប់' : active ? 'កំពុងរៀន' : unlocked ? 'អាចរៀនបាន' : 'ត្រូវរៀនមុន';
          const itemClass = 'lesson-rail-item' + (active ? ' is-active' : '') + (done ? ' is-done' : '') + ((!unlocked && !done && !active) ? ' is-locked' : '') + (planned ? ' is-planned' : '');
          const itemContent = [
            el('span', { class: 'lesson-rail-icon', 'aria-hidden': 'true' }, icon(done ? 'check' : planned || !unlocked ? 'lock' : active ? 'book' : 'play', 15)),
            el('span', { class: 'lesson-rail-copy' },
              el('span', { class: 'lesson-rail-name' }, item.title_km),
              el('span', { class: 'lesson-rail-meta' }, stateText + ' · ' + item.estimated_minutes + ' នាទី')
            )
          ];
          const row = unlocked || done || active
            ? el('a', { class: itemClass, href: basePath() + '/levels/' + item.level_id + '/lessons/' + item.id, 'aria-current': active ? 'page' : null }, ...itemContent)
            : el('div', { class: itemClass, 'aria-disabled': 'true' }, ...itemContent);
          return el('li', {}, row);
        });
        const unitDone = unitLessons.filter((item) => Boolean(completed[item.id])).length;
        return el(
          'section',
          { class: 'lesson-rail-unit' },
          el('div', { class: 'lesson-rail-unit__heading' },
            el('strong', {}, unit.title_km),
            el('span', {}, unitDone + '/' + unitLessons.length)
          ),
          el('ul', { class: 'lesson-rail-list' }, ...items)
        );
      }) : [])
    )
  );
}

export function renderLessonView(lesson: Lesson, host: HTMLElement): void {
  const level = getLevel(lesson.level_id);
  const handles: ExerciseHandle[] = [];
  let hintsUsed = 0;
  let solvedCount = 0;
  const requiredTotal = lesson.exercises.filter((e) => e.required !== false).length;

  host.replaceChildren();
  host.append(
    breadcrumbs([
      { label: 'ទំព័រដើម', path: '/' },
      { label: 'កម្រិតសិក្សា', path: '/levels' },
      { label: level ? 'កម្រិត ' + level.id + ' — ' + level.title_km : '?', path: level ? '/levels/' + level.id : undefined },
      { label: lesson.title_km },
    ])
  );

  const alreadyDone = Boolean(getState().completedLessons[lesson.id]);
  const progressHead = el(
    'div',
    { class: 'lesson-progress-head' },
    el(
      'div',
      { class: 'progressbar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(requiredTotal), 'aria-valuenow': alreadyDone ? String(requiredTotal) : '0', 'aria-label': 'វឌ្ឍនភាពលំហាត់ចាំបាច់' },
      el('div', { style: 'width:' + (alreadyDone ? 100 : 0) + '%' })
    ),
    el('span', { class: 'tag tag-muted progress-label' }, alreadyDone ? 'បានបញ្ចប់ ✓' : '0/' + requiredTotal + ' លំហាត់')
  );

  const header = el(
    'header',
    { class: 'lesson-heading' },
    el('div', { class: 'lesson-heading__meta' },
      el('span', { class: 'tag tag-primary' }, 'កម្រិត ' + lesson.level_id),
      el('span', { class: 'tag' }, icon('clock', 14), 'ប្រមាណ ' + lesson.estimated_minutes + ' នាទី'),
      el('span', { class: 'tag tag-muted' }, lesson.exercises.length + ' លំហាត់')
    ),
    el('h1', {}, lesson.title_km),
    el('p', { class: 'lesson-heading__intro' }, 'រៀនតាមជំហានខាងក្រោម រួចអនុវត្តដើម្បីពិនិត្យថាអ្នកយល់មេរៀននេះហើយឬនៅ។'),
    el('h2', { class: 'sr-only' }, 'គោលបំណងសិក្សា'),
    el('ul', { class: 'objectives' }, ...lesson.objectives_km.map((objective) => el('li', {}, icon('target', 18), el('span', {}, objective))))
  );

  const explanationCard = el('section', { class: 'card lesson-explanation lesson-section', id: 'lesson-explanation', 'aria-labelledby': 'lesson-explanation-title' });
  explanationCard.append(el('h2', { id: 'lesson-explanation-title', class: 'lesson-section-title' }, '១. ស្វែងយល់គំនិតសំខាន់'));
  const explanationBody = el('div', { class: 'lesson-explanation__body' });
  explanationBody.innerHTML = renderMarkdown(lesson.explanation_km);
  explanationCard.append(explanationBody);

  const examplesSection = el('section', { class: 'lesson-section lesson-examples', id: 'lesson-examples', 'aria-labelledby': 'lesson-examples-title' },
    el('div', { class: 'lesson-section-heading' },
      el('span', { class: 'lesson-step-number' }, '២'),
      el('div', {}, el('h2', { id: 'lesson-examples-title' }, 'មើលឧទាហរណ៍កូដ'), el('p', {}, 'មើលកូដ និងលទ្ធផល ដើម្បីយល់ថាកម្មវិធីដំណើរការដូចម្តេច។'))
    )
  );
  lesson.examples.forEach((example, index) => {
    const codeId = lesson.id + '-example-' + index + '-code';
    const copyBtn = el('button', {
      class: 'btn btn-secondary btn-sm copy-btn',
      'aria-label': 'ចម្លងកូដឧទាហរណ៍ទី ' + (index + 1),
      onclick: async () => {
        const ok = await copyText(example.code);
        showToast(ok ? 'បានចម្លងកូដហើយ' : 'មិនអាចចម្លងបានទេ — សូមចម្លងដោយដៃ', ok ? 'success' : 'error');
      },
    }, icon('copy', 14), 'ចម្លងកូដ');
    const pre = el('pre', { dir: 'ltr', id: codeId }, highlightedCode(example.code));
    examplesSection.append(
      el('article', { class: 'card lesson-example-card' },
        el('h3', {}, example.title_km),
        el('div', { class: 'code-block' }, pre, copyBtn),
        example.expectedOutput !== undefined
          ? el('div', {}, el('div', { class: 'output-label' }, 'លទ្ធផលរំពឹងទុក' + (example.stdin ? ' · ទិន្នន័យបញ្ចូល៖ ' + JSON.stringify(example.stdin) : '')),
              el('div', { class: 'output-block', 'aria-label': 'លទ្ធផលដែលគួរទទួលបាន' }, example.expectedOutput.replace(/\n$/, '')))
          : el('p', { class: 'help lesson-example-note' }, 'ឧទាហរណ៍នេះជាពាក្យបញ្ជា terminal ដូច្នេះមិនមានលទ្ធផលកម្មវិធីទេ។'),
        example.note_km ? el('p', { class: 'lesson-example-note' }, el('strong', {}, 'ចំណាំ៖ '), example.note_km) : null
      )
    );
  });

  const main = el('div', { class: 'lesson-main-content' }, progressHead, header, explanationCard);
  if (lesson.examples.length) main.append(examplesSection);

  if (lesson.diagrams && lesson.diagrams.length > 0) {
    const diagramSection = el('section', { class: 'lesson-section lesson-diagrams', id: 'lesson-diagrams' },
      el('div', { class: 'lesson-section-heading' },
        el('span', { class: 'lesson-step-number' }, 'ជំនួយ'),
        el('div', {}, el('h2', {}, 'រូបភាពជួយពន្យល់'), el('p', {}, 'ប្រើរូបភាពខាងក្រោមដើម្បីមើលទំនាក់ទំនងរវាងគំនិត។'))
      )
    );
    lesson.diagrams.forEach((diagram) => diagramSection.append(renderDiagram(diagram)));
    main.append(diagramSection);
  }

  if (lesson.commonMistake) {
    const mistake = lesson.commonMistake;
    main.append(
      el('section', { class: 'lesson-section lesson-mistakes', id: 'lesson-mistakes' },
        el('div', { class: 'lesson-section-heading' },
          el('span', { class: 'lesson-step-number lesson-step-number--warning' }, '!'),
          el('div', {}, el('h2', {}, 'កំហុសដែលគួរប្រុងប្រយ័ត្ន'), el('p', {}, 'ប្រៀបធៀបកូដខុស និងកូដត្រឹមត្រូវ។'))
        ),
        el('div', { class: 'card lesson-mistake-card' },
          el('div', { class: 'mistake-box' }, el('div', { class: 'output-label' }, 'ឧទាហរណ៍ខុស'), el('pre', { dir: 'ltr' }, highlightedCode(mistake.wrongCode))),
          el('div', { class: 'mistake-box right' }, el('div', { class: 'output-label' }, 'វិធីសរសេរត្រឹមត្រូវ'), el('pre', { dir: 'ltr' }, highlightedCode(mistake.rightCode))),
          el('p', {}, mistake.note_km)
        )
      )
    );
  }

  const exerciseSection = el('section', { class: 'lesson-section lesson-exercises', id: 'lesson-exercises', 'aria-labelledby': 'lesson-exercises-title' },
    el('div', { class: 'lesson-section-heading' },
      el('span', { class: 'lesson-step-number' }, '៣'),
      el('div', {}, el('h2', { id: 'lesson-exercises-title' }, 'អនុវត្ត និងពិនិត្យចម្លើយ'), el('p', {}, 'សាកល្បងឆ្លើយដោយខ្លួនឯង។ ប្រព័ន្ធនឹងប្រាប់ថាត្រូវឬខុស ហើយពន្យល់មូលហេតុជាភាសាខ្មែរ។'))
    ),
    el('p', { class: 'lesson-exercise-instruction' }, 'បញ្ចប់លំហាត់ចាំបាច់ទាំងអស់ ដើម្បីបើកមេរៀនបន្ទាប់។ អ្នកអាចសាកល្បងម្ដងទៀត និងប្រើជំនួយបាន។')
  );

  const completionPanel = el('section', { class: 'card completion-panel lesson-completion', id: 'lesson-summary', style: 'display:none', 'aria-live': 'polite' });

  lesson.exercises.forEach((exercise, index) => {
    const handle = renderExercise(exercise, {
      lessonId: lesson.id,
      onHintUsed: () => { hintsUsed += 1; },
      onResult: (correct) => {
        if (!correct) return;
        solvedCount = handles.filter((item) => item.isSolved()).length;
        const bar = progressHead.querySelector('.progressbar > div') as HTMLElement | null;
        const label = progressHead.querySelector('.progress-label');
        const requiredSolved = handles.filter((item, itemIndex) => item.isSolved() && lesson.exercises[itemIndex].required !== false).length;
        if (bar) bar.style.width = (requiredTotal ? (requiredSolved / requiredTotal) * 100 : 0) + '%';
        if (label) label.textContent = requiredSolved + '/' + requiredTotal + ' លំហាត់';
        progressHead.querySelector('.progressbar')?.setAttribute('aria-valuenow', String(requiredSolved));
        if (requiredSolved >= requiredTotal && requiredTotal > 0) finishLesson(completionPanel);
      },
    });
    handles.push(handle);
    handle.element.setAttribute('data-exercise-number', String(index + 1));
    exerciseSection.append(handle.element);
  });

  function finishLesson(panel: HTMLElement): void {
    if (panel.style.display !== 'none') return;
    const score = lesson.exercises.length ? solvedCount / lesson.exercises.length : 1;
    const newAchievements = completeLesson(lesson.id, Math.min(1, score), hintsUsed);
    playSound('complete');
    updateStats();

    const nextLesson = lesson.next ? getLesson(lesson.next) : undefined;
    panel.style.display = 'block';
    panel.replaceChildren();
    panel.append(
      mascotBubble({ state: 'happy', text_km: pickPhrase(cheerComplete) }),
      el('span', { class: 'lesson-completion__eyebrow' }, 'មេរៀននេះបានបញ្ចប់'),
      el('h2', { style: 'margin-top:.5rem' }, 'សង្ខេបមេរៀន'),
      el('p', { class: 'lesson-completion__congrats' }, 'អបអរសាទរ! អ្នកធ្វើបានហើយ។'),
      el('p', {}, lesson.summary_km),
      el('div', { class: 'lesson-completion__score' },
        el('strong', {}, '+25 XP'),
        el('span', {}, 'ពិន្ទុ ' + Math.round(score * 100) + '%')
      )
    );
    const btnRow = el('div', { class: 'lesson-completion__actions' });
    if (nextLesson && nextLesson.status === 'published') {
      btnRow.append(el('a', { class: 'btn btn-primary', href: basePath() + '/levels/' + nextLesson.level_id + '/lessons/' + nextLesson.id }, icon('chevronRight', 18), 'មេរៀនបន្ទាប់៖ ' + nextLesson.title_km));
    } else if (nextLesson && nextLesson.status === 'planned') {
      btnRow.append(el('span', { class: 'tag tag-muted' }, 'មេរៀនបន្ទាប់កំពុងរៀបចំ'), el('a', { class: 'btn btn-secondary', href: basePath() + '/levels' }, 'មើលកម្រិតសិក្សា'));
    }
    btnRow.append(el('a', { class: 'btn btn-secondary', href: basePath() + '/playground' }, icon('code', 18), 'ហាត់សរសេរកូដបន្ថែម'));
    panel.append(btnRow);

    if (newAchievements.length) {
      panel.append(el('div', { class: 'lesson-completion__achievements' }, ...newAchievements.map((id) => {
        const achievement = getAchievement(id);
        return achievement ? el('div', { class: 'feedback correct' }, icon('trophy', 20), el('div', {}, el('strong', {}, 'សមិទ្ធផលថ្មី៖ ' + achievement.title_km), el('div', {}, achievement.description_km))) : null;
      })));
      playSound('achievement');
    }
    panel.scrollIntoView?.({ behavior: getState().settings.reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  const courseRail = renderCourseNavigation(lesson);
  const side = el('aside', { class: 'lesson-side', 'aria-label': 'ព័ត៌មាន និងតំណភ្ជាប់មេរៀន' },
    el('section', { class: 'card lesson-side-card' },
      el('h2', {}, 'វឌ្ឍនភាពមេរៀន'),
      el('div', { class: 'lesson-side-stat' }, el('strong', {}, String(requiredTotal)), el('span', {}, 'លំហាត់ចាំបាច់')),
      el('div', { class: 'lesson-side-stat' }, el('strong', {}, alreadyDone ? 'បានបញ្ចប់' : 'កំពុងរៀន'), el('span', {}, 'ស្ថានភាព')),
      el('div', { class: 'lesson-side-stat' }, el('strong', {}, String(lesson.estimated_minutes) + ' នាទី'), el('span', {}, 'រយៈពេលប៉ាន់ស្មាន')),
      el('div', { class: 'lesson-side-stat' }, el('strong', {}, 'C++17'), el('span', {}, 'ស្តង់ដារកូដ'))
    ),
    el('nav', { class: 'card lesson-outline', 'aria-label': 'ផ្នែកក្នុងមេរៀននេះ' },
      el('h2', {}, 'ទៅកាន់ផ្នែក'),
      el('a', { href: '#lesson-explanation' }, icon('book', 15), 'ការពន្យល់'),
      lesson.examples.length ? el('a', { href: '#lesson-examples' }, icon('code', 15), 'ឧទាហរណ៍កូដ') : null,
      lesson.diagrams?.length ? el('a', { href: '#lesson-diagrams' }, icon('book', 15), 'រូបភាពជំនួយ') : null,
      lesson.commonMistake ? el('a', { href: '#lesson-mistakes' }, icon('x', 15), 'កំហុសទូទៅ') : null,
      el('a', { href: '#lesson-exercises' }, icon('clipboard', 15), 'លំហាត់ពិនិត្យចម្លើយ')
    ),
    el('section', { class: 'card lesson-side-help' },
      mascotBubble({ state: 'neutral', text_km: pickPhrase(cheerIdle), small: true }),
      el('a', { class: 'btn btn-secondary btn-sm btn-block', href: basePath() + '/playground' }, icon('code', 16), 'បើកកន្លែងហាត់កូដ'),
      el('button', { class: 'btn btn-ghost btn-sm btn-block', onclick: () => navigate('/levels/' + lesson.level_id) }, 'ត្រឡប់ទៅកម្រិតសិក្សា')
    )
  );

  const middle = el('div', { class: 'lesson-main-column' }, main, exerciseSection, completionPanel);
  host.append(el('div', { class: 'lesson-layout lesson-workspace' }, courseRail, middle, side));

  if (alreadyDone) {
    showToast('អ្នកបានបញ្ចប់មេរៀននេះពីមុនហើយ — អ្នកអាចរៀនឡើងវិញបានគ្រប់ពេល។', 'info');
  }
}
