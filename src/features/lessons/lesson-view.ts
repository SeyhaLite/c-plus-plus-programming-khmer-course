import type { Lesson } from '../../types';
import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { renderMarkdown } from '../../utils/markdown';
import { renderExercise, type ExerciseHandle } from '../../components/exercises';
import { completeLesson, getState } from '../../services/progress';
import { mascotBubble } from '../../app/character';
import { breadcrumbs, showToast, updateStats } from '../../app/layout';
import { basePath, navigate } from '../../app/router';
import { getLesson, getLevel } from '../../data/curriculum';
import { getAchievement } from '../../data/achievements';
import { playSound } from '../../services/audio';
import { copyText } from '../../services/diagnostics';

// ============================================================
// Lesson view — មេរៀន៖ ការពន្យល់ → ឧទាហរណ៍ → លំហាត់ → សង្ខេប
// ការបញ្ចប់មេរៀន ត្រូវការឆ្លើយលំហាត់ required ទាំងអស់ត្រឹមត្រូវ។
// ============================================================

export function renderLessonView(lesson: Lesson, host: HTMLElement): void {
  const level = getLevel(lesson.level_id);
  const handles: ExerciseHandle[] = [];
  let hintsUsed = 0;
  let solvedCount = 0;
  const requiredTotal = lesson.exercises.filter((e) => e.required !== false).length;

  host.innerHTML = '';
  host.append(
    breadcrumbs([
      { label: 'ទំព័រដើម', path: '/' },
      { label: 'កម្រិតសិក្សា', path: '/levels' },
      { label: level ? `កម្រិត ${level.id} — ${level.title_km}` : '?', path: level ? `/levels/${level.id}` : undefined },
      { label: lesson.title_km },
    ])
  );

  const alreadyDone = Boolean(getState().completedLessons[lesson.id]);

  const progressHead = el(
    'div',
    { class: 'lesson-progress-head' },
    el('div', { class: 'progressbar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(requiredTotal), 'aria-valuenow': alreadyDone ? String(requiredTotal) : '0', 'aria-label': 'វឌ្ឍនភាពលំហាត់' }, el('div', { style: `width:${alreadyDone ? 100 : 0}%` })),
    el('span', { class: 'tag tag-muted progress-label' }, alreadyDone ? `បានបញ្ចប់ ✓` : `0/${requiredTotal} លំហាត់`)
  );

  const header = el(
    'div',
    {},
    el('div', { class: 'lesson-meta', style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem' },
      el('span', { class: 'tag' }, icon('clock', 14), `ប្រមាណ ${lesson.estimated_minutes} នាទី`),
      el('span', { class: 'tag' }, `កម្រិត ${lesson.level_id} · ខ្នាត ${lesson.unit_id}`),
      el('span', { class: 'tag tag-muted mono' }, lesson.title_en),
    ),
    el('h1', {}, lesson.title_km),
    el('h2', { class: 'sr-only' }, 'គោលបំណងសិក្សា'),
    el('ul', { class: 'objectives' }, ...lesson.objectives_km.map((o) => el('li', {}, icon('target', 18), el('span', {}, o))))
  );

  const explanationCard = el('div', { class: 'card lesson-explanation' });
  explanationCard.innerHTML = renderMarkdown(lesson.explanation_km);

  const examplesSection = el('div', { class: 'lesson-examples' }, el('h2', {}, 'ឧទាហរណ៍ និងលទ្ធផលរំពឹងទុក'));
  lesson.examples.forEach((ex, idx) => {
    const codeId = `${lesson.id}-example-${idx}-code`;
    const copyBtn = el('button', {
      class: 'btn btn-secondary btn-sm copy-btn',
      onclick: async () => {
        const ok = await copyText(ex.code);
        showToast(ok ? 'បានចម្លងកូដហើយ' : 'មិនអាចចម្លងបានទេ — សូមចម្លងដោយដៃ', ok ? 'success' : 'error');
      },
    }, icon('copy', 14), 'ចម្លង');
    const pre = el('pre', { dir: 'ltr', id: codeId }, el('code', {}, ex.code));
    examplesSection.append(
      el('div', { class: 'card', style: 'margin-bottom:1rem' },
        el('h3', { style: 'font-size:1rem' }, ex.title_km),
        el('div', { class: 'code-block' }, pre, copyBtn),
        ex.expectedOutput !== undefined
          ? el('div', {}, el('div', { class: 'output-label' }, `លទ្ធផលរំពឹងទុក${ex.stdin ? ` (input: ${JSON.stringify(ex.stdin)})` : ''}៖`), el('div', { class: 'output-block', 'aria-label': 'លទ្ធផលរំពឹងទុក' }, ex.expectedOutput.replace(/\n$/, '')))
          : el('p', { class: 'help', style: 'color:var(--c-text-muted);font-size:.85rem' }, 'ឧទាហរណ៍នេះជាពាក្យបញ្ជា terminal — មិនមានលទ្ធផលកម្មវិធី។'),
        ex.note_km ? el('p', { style: 'font-size:.9rem;color:var(--c-text-muted)' }, el('strong', {}, 'ចំណាំ៖ '), ex.note_km) : null
      )
    );
  });

  const main = el('div', {}, progressHead, header, explanationCard, lesson.examples.length ? examplesSection : null);

  if (lesson.commonMistake) {
    const cm = lesson.commonMistake;
    main.append(
      el('div', { class: 'card', style: 'margin-bottom:1rem;border-color:var(--c-error)' },
        el('h2', { style: 'color:var(--c-error);font-size:1.1rem' }, icon('x', 20), ' កំហុសទូទៅ'),
        el('div', { class: 'mistake-box' }, el('div', { class: 'output-label' }, '✗ ខុស៖'), el('pre', { dir: 'ltr' }, el('code', {}, cm.wrongCode))),
        el('div', { class: 'mistake-box right' }, el('div', { class: 'output-label' }, '✓ ត្រូវ៖'), el('pre', { dir: 'ltr' }, el('code', {}, cm.rightCode))),
        el('p', {}, cm.note_km)
      )
    );
  }

  const exerciseSection = el('div', { class: 'lesson-exercises' }, el('h2', {}, 'លំហាត់អនុវត្ត'), el('p', { class: 'help', style: 'color:var(--c-text-muted)' }, 'ឆ្លើយលំហាត់ចាំបាច់ទាំងអស់ឲ្យត្រឹមត្រូវ ដើម្បីបញ្ចប់មេរៀន។ អ្នកអាចសាកល្បងម្តងទៀតបានគ្មានដែនកំណត់។'));

  const completionPanel = el('div', { class: 'card completion-panel', style: 'display:none' });

  lesson.exercises.forEach((ex) => {
    const handle = renderExercise(ex, {
      lessonId: lesson.id,
      onHintUsed: () => { hintsUsed += 1; },
      onResult: (correct) => {
        if (correct) {
          solvedCount = handles.filter((h) => h.isSolved()).length;
          const bar = progressHead.querySelector('.progressbar > div') as HTMLElement | null;
          const label = progressHead.querySelector('.progress-label');
          const requiredSolved = handles.filter((h, i) => h.isSolved() && lesson.exercises[i].required !== false).length;
          if (bar) bar.style.width = `${requiredTotal ? (requiredSolved / requiredTotal) * 100 : 0}%`;
          if (label) label.textContent = `${requiredSolved}/${requiredTotal} លំហាត់`;
          progressHead.querySelector('.progressbar')?.setAttribute('aria-valuenow', String(requiredSolved));
          if (requiredSolved >= requiredTotal && requiredTotal > 0) {
            finishLesson(solvedCount, completionPanel);
          }
        }
      },
    });
    handles.push(handle);
    exerciseSection.append(handle.element);
  });

  function finishLesson(_solved: number, panel: HTMLElement): void {
    if (panel.style.display !== 'none') return;
    const score = lesson.exercises.length ? solvedCount / lesson.exercises.length : 1;
    const newAchievements = completeLesson(lesson.id, Math.min(1, score), hintsUsed);
    playSound('complete');
    updateStats();

    const nextLesson = lesson.next ? getLesson(lesson.next) : undefined;
    panel.style.display = 'block';
    panel.innerHTML = '';
    panel.append(
      mascotBubble({ state: 'happy', text_km: 'អបអរសាទរ! អ្នកបានបញ្ចប់មេរៀននេះហើយ។' }),
      el('h2', { style: 'margin-top:1rem' }, 'សង្ខេបមេរៀន'),
      el('p', {}, lesson.summary_km),
      el('p', { class: 'tag tag-success' }, `+25 XP · ពិន្ទុ ${Math.round(score * 100)}%`)
    );
    const btnRow = el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem' });
    if (nextLesson && nextLesson.status === 'published') {
      btnRow.append(el('a', { class: 'btn btn-primary', href: `${basePath()}/levels/${nextLesson.level_id}/lessons/${nextLesson.id}` }, icon('chevronRight', 18), `មេរៀនបន្ទាប់៖ ${nextLesson.title_km}`));
    } else if (nextLesson && nextLesson.status === 'planned') {
      btnRow.append(el('span', { class: 'tag tag-muted' }, 'មេរៀនបន្ទាប់កំពុងរៀបចំ — អ្នកបានបញ្ចប់មាតិកាដែលមានហើយ!'), el('a', { class: 'btn btn-secondary', href: `${basePath()}/levels` }, 'ទៅកម្រិតសិក្សា'));
    }
    btnRow.append(el('a', { class: 'btn btn-secondary', href: `${basePath()}/playground` }, icon('code', 18), 'ហាត់សរសេរកូដបន្ថែម'));
    panel.append(btnRow);
    if (newAchievements.length) {
      panel.append(el('div', { style: 'margin-top:1rem' }, ...newAchievements.map((id) => {
        const a = getAchievement(id);
        return a ? el('div', { class: 'feedback correct' }, icon('trophy', 20), el('div', {}, el('strong', {}, `សមិទ្ធផលថ្មី៖ ${a.title_km}`), el('div', {}, a.description_km))) : null;
      })));
      playSound('achievement');
    }
    panel.scrollIntoView?.({ behavior: getState().settings.reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  // Sidebar: status + quick links
  const side = el('aside', { class: 'lesson-side' },
    el('div', { class: 'card' },
      el('h2', { style: 'font-size:1rem' }, 'លក្ខខណ្ឌបញ្ចប់មេរៀន'),
      el('ul', { class: 'kv-list' },
        el('li', {}, el('span', {}, 'លំហាត់ចាំបាច់'), el('span', {}, `${requiredTotal}`)),
        el('li', {}, el('span', {}, 'ស្ថានភាព'), el('span', {}, alreadyDone ? 'បានបញ្ចប់ ✓' : 'កំពុងរៀន')),
        el('li', {}, el('span', {}, 'កំណែមាតិកា'), el('span', { class: 'mono' }, `v${lesson.version}`)),
      ),
    ),
    el('div', { class: 'card', style: 'margin-top:1rem' },
      el('h2', { style: 'font-size:1rem' }, 'តំណភ្ជាប់រហ័ស'),
      el('div', { style: 'display:grid;gap:.5rem' },
        el('a', { class: 'btn btn-secondary btn-sm', href: `${basePath()}/playground` }, icon('code', 16), 'ហាត់សរសេរកូដ'),
        el('button', { class: 'btn btn-secondary btn-sm', onclick: () => navigate(`/levels/${lesson.level_id}`) }, icon('levels', 16), `កម្រិត ${lesson.level_id} ទាំងមូល`),
      ),
    ),
    el('div', { class: 'card', style: 'margin-top:1rem' },
      mascotBubble({ state: 'neutral', text_km: 'ខ្ញុំឈ្មោះ តារា! អានការពន្យល់ រួចធ្វើលំហាត់ម្តងមួយៗ។ បើជាប់គាំង សូមចុចប៊ូតុងជំនួយ។', small: true }),
    ),
  );

  main.append(exerciseSection, completionPanel);
  host.append(el('div', { class: 'lesson-layout' }, main, side));

  if (alreadyDone) {
    showToast('អ្នកបានបញ្ចប់មេរៀននេះពីមុនហើយ — សូមរៀនឡើងវិញបានគ្រប់ពេល។', 'info');
  }
}
