// ============================================================
// Safe mini-markdown → HTML renderer
// គាំទ្រ៖ paragraphs, **bold**, *italic*, `inline code`,
// ``` fenced code blocks, "- " bullet lists, "## " headings
// សុវត្ថិភាព៖ escape HTML ទាំងអស់មុនពេលបកប្រែ — គ្មានការ render HTML ពីអ្នកប្រើ។
// ============================================================

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inline(text: string): string {
  // inline code first (protect content from further processing)
  const codes: string[] = [];
  let out = text.replace(/`([^`]+)`/g, (_m, c: string) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = out
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => `<code>${codes[Number(i)]}</code>`);
  return out;
}

export function renderMarkdown(src: string): string {
  const escaped = escapeHtml(src);
  const lines = escaped.split('\n');
  const html: string[] = [];
  let i = 0;
  let inList = false;
  let inPara = false;

  const closePara = (): void => {
    if (inPara) { html.push('</p>'); inPara = false; }
  };
  const closeList = (): void => {
    if (inList) { html.push('</ul>'); inList = false; }
  };

  while (i < lines.length) {
    const line = lines[i];
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      closePara(); closeList();
      const lang = fence[1] || 'text';
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // skip closing fence
      html.push(`<pre class="code-${lang}" dir="ltr"><code>${buf.join('\n')}</code></pre>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      closePara(); closeList();
      html.push(`<h3>${inline(line.replace(/^##\s+/, ''))}</h3>`);
      i++; continue;
    }
    if (/^[-*]\s+/.test(line)) {
      closePara();
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`);
      i++; continue;
    }
    if (line.trim() === '') {
      closePara(); closeList();
      i++; continue;
    }
    closeList();
    if (!inPara) { html.push('<p>'); inPara = true; }
    else html.push('<br/>');
    html.push(inline(line));
    i++;
  }
  closePara(); closeList();
  return html.join('\n');
}
