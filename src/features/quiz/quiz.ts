import { el } from '../../utils/dom';
import { icon } from '../../app/icons';
import { placementQuestions, scoreToLevel } from '../../data/placement-quiz';
import { getState, recordQuiz } from '../../services/progress';
import { breadcrumbs, showToast, updateStats } from '../../app/layout';
import { basePath } from '../../app/router';
import { getAchievement } from '../../data/achievements';
import { playSound } from '../../services/audio';
import { mascotBubble } from '../../app/character';
import { pickPhrase, cheerComplete } from '../../data/encouragement';
import { shuffleChoices } from '../../utils/shuffle';

// ============================================================
// ពិនិត្យចំណេះដឹង (Placement test)
// ============================================================

export function renderQuiz(host: HTMLElement): void {
  host.innerHTML = '';
  host.append(breadcrumbs([{ label: 'ទំព័រដើម', path: '/' }, { label: 'ពិនិត្យចំណេះដឹង' }]));
  host.append(el('h1', {}, 'ពិនិត្យចំណេះដឹង'), el('p', { class: 'help', style: 'color:var(--c-text-muted);max-width:70ch' },
    'ឆ្លើយសំណួរ ៨ ដើម្បីទទួលការណែនាំកម្រិតចាប់ផ្តើម។ ការធ្វើតេស្តនេះមិនប៉ះពាល់វឌ្ឍនភាពមេរៀនរបស់អ្នកទេ ហើយអ្នកអាចធ្វើម្តងទៀតបានគ្រប់ពេល។'));

  const prev = getState().placementResult;
  if (prev) {
    host.append(el('div', { class: 'feedback hint' }, icon('clipboard', 20), el('div', {}, `លទ្ធផលចុងក្រោយរបស់អ្នក៖ ណែនាំឲ្យចាប់ផ្តើមពី កម្រិត ${prev.levelId} (${new Date(prev.takenAt).toLocaleDateString('km-KH')})`)));
  }

  const card = el('div', { class: 'card', style: 'margin-top:1rem;max-width:760px' });
  let idx = 0;
  const correctLevels: number[] = [];
  // seed ថ្មីរាល់ការចាប់ផ្តើមតេស្ត → លំដាប់ជម្រើសខុសគ្នារវាងការធ្វើម្តងទៀត។
  // សំខាន់ណាស់៖ កំហុសចាស់គឺ **សំណួរទាំង ៨ មានចម្លើយត្រឹមត្រូវនៅទីតាំងទី ១**
  // ដូច្នេះការចុចជម្រើសដំបូងជានិច្ចផ្តល់ ៨/៨ → អ្នកសិក្សាត្រូវបានដាក់កម្រិតខ្ពស់ខុស។
  let attemptSeed = `${Date.now()}`;

  function renderQuestion(): void {
    card.innerHTML = '';
    const q = placementQuestions[idx];
    card.append(
      el('div', { class: 'lesson-progress-head' },
        el('div', { class: 'progressbar', role: 'progressbar', 'aria-valuenow': String(idx), 'aria-valuemin': '0', 'aria-valuemax': String(placementQuestions.length) }, el('div', { style: `width:${(idx / placementQuestions.length) * 100}%` })),
        el('span', { class: 'tag tag-muted' }, `${idx + 1}/${placementQuestions.length}`)
      ),
      el('h2', { style: 'font-size:1.1rem' }, q.prompt_km)
    );
    let selectedPos = -1;
    const { order, answerPos } = shuffleChoices(q.options_km.length, q.answerIndex, `${attemptSeed}|q${idx}`);
    const options = el('div', { class: 'mc-options', role: 'group', 'aria-label': 'ជម្រើស' },
      ...order.map((origIdx, pos) =>
        el('button', { class: 'mc-option', type: 'button', 'aria-pressed': 'false', onclick: () => {
            selectedPos = pos;
            options.querySelectorAll('.mc-option').forEach((b, j) => b.setAttribute('aria-pressed', String(j === pos)));
          } }, el('span', { class: 'key-hint' }, String(pos + 1)), el('span', {}, q.options_km[origIdx]))
      )
    );
    const fb = el('div', { role: 'status' });
    let answered = false;
    const nextBtn = el('button', { class: 'btn btn-primary', style: 'display:none' }, idx === placementQuestions.length - 1 ? 'មើលលទ្ធផល' : el('span', {}, 'សំណួរបន្ទាប់ →'));
    nextBtn.addEventListener('click', () => {
      idx += 1;
      if (idx < placementQuestions.length) renderQuestion();
      else renderResult();
    });
    const checkBtn = el('button', { class: 'btn btn-primary', onclick: () => {
        if (answered) return;
        if (selectedPos < 0) { fb.replaceChildren(el('div', { class: 'feedback hint' }, 'សូមជ្រើសរើសចម្លើយមួយ។')); return; }
        answered = true;
        const isRight = selectedPos === answerPos;
        if (isRight) correctLevels.push(q.upToLevel);
        fb.replaceChildren(el('div', { class: isRight ? 'feedback correct' : 'feedback incorrect' },
          icon(isRight ? 'check' : 'x', 20), el('div', {}, q.explanation_km)));
        // បង្ហាញចម្លើយត្រូវ/ខុសលើជម្រើស (ដូចលំហាត់ក្នុងមេរៀន) ដើម្បីឲ្យអ្នកសិក្សាយល់
        options.querySelectorAll('.mc-option').forEach((b, j) => {
          b.classList.remove('correct-answer', 'wrong-answer');
          if (j === answerPos) b.classList.add('correct-answer');
          else if (j === selectedPos) b.classList.add('wrong-answer');
          (b as HTMLButtonElement).disabled = true;
        });
        checkBtn.disabled = true;
        nextBtn.style.display = 'inline-flex';
      } }, icon('check', 18), 'ឆ្លើយ');
    card.append(options, fb, el('div', { style: 'display:flex;gap:.5rem;margin-top:1rem' }, checkBtn, nextBtn));
  }

  function renderResult(): void {
    const level = scoreToLevel(correctLevels);
    const unlocked = recordQuiz(level);
    updateStats();
    playSound('complete');
    card.innerHTML = '';
    card.append(
      mascotBubble({ state: 'happy', text_km: `${pickPhrase(cheerComplete)} អ្នកគួរចាប់ផ្តើមពីកម្រិត ${level}។` }),
      el('h2', { style: 'margin-top:1rem' }, `លទ្ធផល៖ ណែនាំឲ្យចាប់ផ្តើមពី កម្រិត ${level}`),
      el('p', {}, `អ្នកឆ្លើយត្រូវ ${correctLevels.length}/${placementQuestions.length} សំណួរ។ ការណែនាំនេះជាជំនួយទេ — អ្នកអាចជ្រើសរើសកម្រិតណាក៏បានដោយខ្លួនឯង ហើយរៀនឡើងវិញបានគ្រប់ពេល។`),
      el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem' },
        el('a', { class: 'btn btn-primary', href: `${basePath()}/levels/${level}` }, icon('play', 18), `ទៅកម្រិត ${level}`),
        el('a', { class: 'btn btn-secondary', href: `${basePath()}/levels` }, 'មើលកម្រិតទាំងអស់'),
        el('button', { class: 'btn btn-ghost', onclick: () => { idx = 0; correctLevels.length = 0; attemptSeed = `${Date.now()}`; renderQuestion(); } }, icon('refresh', 18), 'ធ្វើតេស្តឡើងវិញ'),
      )
    );
    if (unlocked.length) {
      const a = getAchievement(unlocked[0]);
      if (a) showToast(`សមិទ្ធផលថ្មី៖ ${a.title_km}!`, 'success');
    }
  }

  renderQuestion();
  host.append(card);
}
