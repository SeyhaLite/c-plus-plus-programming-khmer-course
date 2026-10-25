import { getState } from './progress';

// ============================================================
// Audio — សំឡេង feedback បង្កើតដោយ WebAudio API (គ្មានឯកសារ audio)
// បិទជាលំនាំដើម; បើកបានក្នុងការកំណត់។ គោរព autoplay policy
// (AudioContext បង្កើតតែក្រោយ user gesture)។
// ============================================================

type SoundKind = 'correct' | 'incorrect' | 'complete' | 'achievement' | 'click';

let ctx: AudioContext | null = null;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!getState().settings.sound) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null; // audio unavailable — degrade silently, visual feedback remains
  }
}

function tone(ac: AudioContext, freq: number, start: number, dur: number, gainVal = 0.08, type: OscillatorType = 'sine'): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainVal, ac.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

export function playSound(kind: SoundKind): void {
  const ac = ensureContext();
  if (!ac) return;
  try {
    switch (kind) {
      case 'correct':
        tone(ac, 523.25, 0, 0.12); // C5
        tone(ac, 783.99, 0.09, 0.18); // G5
        break;
      case 'incorrect':
        tone(ac, 196.0, 0, 0.2, 0.06, 'triangle'); // G3 low, soft
        break;
      case 'complete':
        tone(ac, 523.25, 0, 0.12);
        tone(ac, 659.25, 0.1, 0.12);
        tone(ac, 783.99, 0.2, 0.25);
        break;
      case 'achievement':
        tone(ac, 659.25, 0, 0.1);
        tone(ac, 783.99, 0.08, 0.1);
        tone(ac, 1046.5, 0.16, 0.3);
        break;
      case 'click':
        tone(ac, 440, 0, 0.05, 0.03, 'triangle');
        break;
    }
  } catch {
    /* never let audio break the UI */
  }
}
