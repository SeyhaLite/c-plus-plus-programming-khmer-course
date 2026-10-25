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

/** Normalize code/output for tolerant comparison: trim lines, collapse whitespace runs. */
export function normalizeForCompare(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 || false)
    .join('\n')
    .replace(/[ \t]+/g, ' ')
    .trimEnd();
}

/** Compare predicted output with expected output (whitespace-tolerant). */
export function outputsMatch(actual: string, expected: string): boolean {
  return normalizeForCompare(actual) === normalizeForCompare(expected);
}

/** Compare code answer ignoring insignificant whitespace. */
export function codeMatches(actual: string, accepted: string[]): boolean {
  const norm = (s: string): string => s.replace(/\s+/g, ' ').trim();
  const a = norm(actual);
  return accepted.some((acc) => norm(acc) === a || (acc.length > 0 && a.toLowerCase() === norm(acc).toLowerCase()));
}

export function slugDate(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
