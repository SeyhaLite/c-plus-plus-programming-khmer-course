import type { DiagramSpec } from '../types';

// ============================================================
// Diagrams — original inline-SVG learning visuals (គ្មានទ្រព្យខាងក្រៅ)
// ប្រភេទ៖ pipeline (ដំណើរការជាជំហាន), boxes (អថេរក្នុង memory),
// ioflow (stdin → អថេរ → stdout), table (តារាង trace/ប្រៀបធៀប)
// ពណ៌យកពី CSS variables → ដំណើរការទាំង light និង dark themes។
// ============================================================

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag: string, attrs: Record<string, string> = {}): SVGElement {
  const n = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

function text(x: number, y: number, content: string, opts: { mono?: boolean; size?: number; fill?: string; anchor?: string; weight?: string } = {}): SVGElement {
  const t = svgEl('text', {
    x: String(x), y: String(y),
    'font-size': String(opts.size ?? 13),
    fill: opts.fill ?? 'var(--c-text)',
    'text-anchor': opts.anchor ?? 'middle',
    'font-family': opts.mono ? 'var(--font-mono)' : 'var(--font-km)',
    ...(opts.weight ? { 'font-weight': opts.weight } : {}),
  });
  const lines = content.split('\n');
  lines.forEach((ln, i) => {
    const ts = svgEl('tspan', { x: String(x), dy: i === 0 ? '0' : '1.5em' });
    ts.textContent = ln;
    t.appendChild(ts);
  });
  return t;
}

function arrow(x1: number, y: number, x2: number): SVGElement {
  const g = svgEl('g', {});
  g.appendChild(svgEl('line', { x1: String(x1), y1: String(y), x2: String(x2 - 7), y2: String(y), stroke: 'var(--c-text-muted)', 'stroke-width': '2', 'marker-end': 'none' }));
  g.appendChild(svgEl('path', { d: `M ${x2 - 8} ${y - 5} L ${x2} ${y} L ${x2 - 8} ${y + 5}`, fill: 'none', stroke: 'var(--c-text-muted)', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  return g;
}

function roundedBox(x: number, y: number, w: number, h: number, fill: string, stroke: string): SVGElement {
  return svgEl('rect', { x: String(x), y: String(y), width: String(w), height: String(h), rx: '10', fill, stroke, 'stroke-width': '2' });
}

function renderPipeline(d: Extract<DiagramSpec, { type: 'pipeline' }>): { svg: SVGElement; width: number; height: number } {
  const BW = 148, BH = 62, GAP = 34;
  const width = d.steps.length * BW + (d.steps.length - 1) * GAP + 20;
  const height = 100;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': d.title_km });
  d.steps.forEach((s, i) => {
    const x = 10 + i * (BW + GAP);
    const first = i === 0, last = i === d.steps.length - 1;
    svg.appendChild(roundedBox(x, 14, BW, BH, first ? 'var(--c-primary-soft)' : last ? 'var(--c-success-soft)' : 'var(--c-surface)', first ? 'var(--c-primary)' : last ? 'var(--c-success)' : 'var(--c-border)'));
    svg.appendChild(text(x + BW / 2, s.sub ? 38 : 46, s.label_km, { size: 12.5, weight: '600' }));
    if (s.sub) svg.appendChild(text(x + BW / 2, 58, s.sub, { size: 11, mono: true, fill: 'var(--c-text-muted)' }));
    if (!last) svg.appendChild(arrow(x + BW + 4, 45, x + BW + GAP - 4));
  });
  return { svg, width, height };
}

function renderBoxes(d: Extract<DiagramSpec, { type: 'boxes' }>): { svg: SVGElement; width: number; height: number } {
  const BW = 108, BH = 74, GAP = 22;
  const width = d.boxes.length * BW + (d.boxes.length - 1) * GAP + 20;
  const height = 116;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': d.title_km });
  svg.appendChild(text(10, 16, 'memory', { size: 11, mono: true, fill: 'var(--c-text-muted)', anchor: 'start' }));
  d.boxes.forEach((b, i) => {
    const x = 10 + i * (BW + GAP);
    svg.appendChild(roundedBox(x, 26, BW, BH, b.constant ? 'var(--c-warning-soft)' : 'var(--c-surface)', b.constant ? 'var(--c-warning)' : 'var(--c-primary)'));
    svg.appendChild(text(x + BW / 2, 46, b.name, { size: 12.5, mono: true, weight: '700', fill: b.constant ? 'var(--c-warning)' : 'var(--c-primary)' }));
    svg.appendChild(svgEl('line', { x1: String(x + 8), y1: '54', x2: String(x + BW - 8), y2: '54', stroke: 'var(--c-border)', 'stroke-width': '1.5' }));
    svg.appendChild(text(x + BW / 2, 76, b.value, { size: 13, mono: true }));
    svg.appendChild(text(x + BW / 2, 112, b.kind ?? (b.constant ? 'const' : ''), { size: 10.5, mono: true, fill: 'var(--c-text-muted)' }));
  });
  return { svg, width, height };
}

function renderIoFlow(d: Extract<DiagramSpec, { type: 'ioflow' }>): { svg: SVGElement; width: number; height: number } {
  const hasInput = d.input !== undefined;
  const nodes: { label: string; sub: string; fill: string; stroke: string }[] = [];
  if (hasInput) nodes.push({ label: 'stdin (input)', sub: JSON.stringify(d.input), fill: 'var(--c-surface-2)', stroke: 'var(--c-border)' });
  if (d.variable) nodes.push({ label: 'អថេរ (variable)', sub: d.variable, fill: 'var(--c-primary-soft)', stroke: 'var(--c-primary)' });
  nodes.push({ label: 'stdout (អេក្រង់)', sub: JSON.stringify(d.output), fill: 'var(--c-success-soft)', stroke: 'var(--c-success)' });
  const BW = 168, BH = 64, GAP = 40;
  const width = nodes.length * BW + (nodes.length - 1) * GAP + 20;
  const height = 104;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': d.title_km });
  nodes.forEach((n, i) => {
    const x = 10 + i * (BW + GAP);
    svg.appendChild(roundedBox(x, 16, BW, BH, n.fill, n.stroke));
    svg.appendChild(text(x + BW / 2, 40, n.label, { size: 12, weight: '600' }));
    svg.appendChild(text(x + BW / 2, 62, n.sub, { size: 12, mono: true, fill: 'var(--c-text-muted)' }));
    if (i < nodes.length - 1) {
      svg.appendChild(arrow(x + BW + 4, 48, x + BW + GAP - 4));
      svg.appendChild(text(x + BW + GAP / 2, 38, i === 0 && hasInput ? 'cin >>' : 'cout <<', { size: 10.5, mono: true, fill: 'var(--c-text-muted)' }));
    }
  });
  return { svg, width, height };
}

function renderTable(d: Extract<DiagramSpec, { type: 'table' }>): { svg: SVGElement; width: number; height: number } {
  const CW = 150, RH = 34, HH = 36;
  const width = d.columns.length * CW + 20;
  const height = HH + d.rows.length * RH + 10;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': d.title_km });
  svg.appendChild(svgEl('rect', { x: '10', y: '6', width: String(width - 20), height: String(HH), rx: '8', fill: 'var(--c-surface-2)', stroke: 'var(--c-border)' }));
  d.columns.forEach((c, i) => svg.appendChild(text(10 + i * CW + CW / 2, 29, c, { size: 12.5, weight: '700' })));
  d.rows.forEach((row, r) => {
    const y = 6 + HH + r * RH;
    if (r % 2 === 1) svg.appendChild(svgEl('rect', { x: '10', y: String(y), width: String(width - 20), height: String(RH), fill: 'var(--c-surface-2)', opacity: '0.55' }));
    row.forEach((cell, i) => svg.appendChild(text(10 + i * CW + CW / 2, y + 22, cell, { size: 12, mono: i > 0 })));
    svg.appendChild(svgEl('line', { x1: '10', y1: String(y + RH), x2: String(width - 10), y2: String(y + RH), stroke: 'var(--c-border)', 'stroke-width': '1' }));
  });
  svg.appendChild(svgEl('rect', { x: '10', y: '6', width: String(width - 20), height: String(HH + d.rows.length * RH), rx: '8', fill: 'none', stroke: 'var(--c-border)', 'stroke-width': '1.5' }));
  return { svg, width, height };
}

export function renderDiagram(spec: DiagramSpec): HTMLElement {
  const fig = document.createElement('figure');
  fig.className = 'diagram';
  let out: { svg: SVGElement; width: number; height: number };
  switch (spec.type) {
    case 'pipeline': out = renderPipeline(spec); break;
    case 'boxes': out = renderBoxes(spec); break;
    case 'ioflow': out = renderIoFlow(spec); break;
    case 'table': out = renderTable(spec); break;
  }
  out.svg.classList.add('diagram-svg');
  out.svg.style.maxWidth = '100%';
  out.svg.style.height = 'auto';
  const title = svgEl('title');
  title.textContent = spec.title_km;
  out.svg.prepend(title);
  const cap = document.createElement('figcaption');
  cap.textContent = spec.title_km;
  fig.append(out.svg, cap);
  if (spec.note_km) {
    const note = document.createElement('div');
    note.className = 'diagram-note';
    note.textContent = spec.note_km;
    fig.append(note);
  }
  return fig;
}
