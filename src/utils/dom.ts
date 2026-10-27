// ============================================================
// DOM helpers + output normalization for grading
// ============================================================

type Attrs = Record<string, string | number | boolean | null | undefined | ((e: Event) => void) | Record<string, string>>;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = String(v);
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (k === 'dataset') {
      Object.assign(node.dataset, v as Record<string, string>);
    } else node.setAttribute(k, String(v));
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

// ------------------------------------------------------------
// ការវិនិច្ឆ័យចម្លើយ (grading) បានផ្លាស់ទៅ `src/utils/grading.ts`។
// ហេតុផល៖ dom.ts គួរមានតែជំនួយ DOM។ ការវិនិច្ឆ័យមានច្បាប់ច្រើន
// (homoglyph, អក្សរលាក់, case-sensitivity, ទម្រង់សមមូល) ហើយត្រូវការ
// unit tests ដាច់ដោយឡែក។
// ------------------------------------------------------------

export function slugDate(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
