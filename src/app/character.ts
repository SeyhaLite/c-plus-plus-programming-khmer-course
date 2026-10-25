// ============================================================
// Mascot — "តារា" (Tara), original inline-SVG robot character.
// រចនាដើម ១០០% (គ្មានទ្រព្យខាងក្រៅ, គ្មានអាជ្ញាបណ្ណត្រូវការ)។
// States: neutral / happy / sad / thinking
// ============================================================

export type MascotState = 'neutral' | 'happy' | 'sad' | 'thinking';

export function mascotSvg(state: MascotState = 'neutral', size = 72): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'តារា — មិត្តជំនួយការសិក្សា');
  svg.classList.add('mascot');

  const eyes =
    state === 'happy'
      ? '<path d="M34 44q5-6 10 0M56 44q5-6 10 0" stroke="#0f1522" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
      : state === 'sad'
        ? '<circle cx="39" cy="45" r="4" fill="#0f1522"/><circle cx="61" cy="45" r="4" fill="#0f1522"/><path d="M42 58q8-5 16 0" stroke="#0f1522" stroke-width="3" fill="none" stroke-linecap="round"/>'
        : state === 'thinking'
          ? '<circle cx="39" cy="45" r="4" fill="#0f1522"/><circle cx="61" cy="45" r="4" fill="#0f1522"/><circle cx="50" cy="58" r="4.5" fill="none" stroke="#0f1522" stroke-width="3"/>'
          : '<circle cx="39" cy="45" r="4" fill="#0f1522"/><circle cx="61" cy="45" r="4" fill="#0f1522"/><path d="M42 56q8 6 16 0" stroke="#0f1522" stroke-width="3" fill="none" stroke-linecap="round"/>';

  svg.innerHTML = `
    <rect x="22" y="24" width="56" height="48" rx="14" fill="#1e5eff"/>
    <rect x="28" y="32" width="44" height="32" rx="10" fill="#e3ecff"/>
    ${eyes}
    <rect x="46" y="10" width="8" height="12" rx="4" fill="#1e5eff"/>
    <circle cx="50" cy="8" r="5" fill="#ffc800"/>
    <rect x="14" y="40" width="8" height="16" rx="4" fill="#1749cc"/>
    <rect x="78" y="40" width="8" height="16" rx="4" fill="#1749cc"/>
    <rect x="34" y="72" width="12" height="14" rx="5" fill="#1749cc"/>
    <rect x="54" y="72" width="12" height="14" rx="5" fill="#1749cc"/>
    <text x="50" y="69" font-family="monospace" font-size="7" fill="#1e5eff" text-anchor="middle" font-weight="bold">C++</text>
  `;
  return svg;
}

export interface MascotBubbleOptions {
  state?: MascotState;
  text_km: string;
  small?: boolean;
}

/** Mascot + speech bubble row. Text is inserted as textContent (safe). */
export function mascotBubble(opts: MascotBubbleOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'mascot-wrap';
  const svg = mascotSvg(opts.state ?? 'neutral', opts.small ? 44 : 72);
  if (opts.small) svg.classList.add('mascot-sm');
  const bubble = document.createElement('div');
  bubble.className = 'mascot-bubble';
  bubble.setAttribute('role', 'status');
  bubble.textContent = opts.text_km;
  wrap.append(svg, bubble);
  return wrap;
}
