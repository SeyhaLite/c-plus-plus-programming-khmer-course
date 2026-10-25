// ============================================================
// C++ syntax highlighter — original, dependency-free tokenizer
// បង្កើត HTML ដែល escape រួច (សុវត្ថិភាព XSS) សម្រាប់បង្ហាញកូដមានពណ៌
// ក្នុងមេរៀន។ ពណ៌យកពី CSS variables (light + dark)។
// ============================================================

const KEYWORDS = new Set([
  'alignas','alignof','and','auto','break','case','catch','class','const','constexpr','continue',
  'decltype','default','delete','do','else','enum','explicit','export','extern','for','friend',
  'goto','if','inline','mutable','namespace','new','noexcept','not','operator','or','private',
  'protected','public','register','return','sizeof','static','struct','switch','template','this',
  'throw','try','typedef','typename','union','using','virtual','volatile','while','override','final',
]);

const TYPES_AND_LITERALS = new Set([
  'int','long','short','float','double','char','bool','void','signed','unsigned','size_t',
  'std','string','vector','array','map','set','cout','cin','endl','nullptr','true','false',
  'static_cast','dynamic_cast','const_cast','reinterpret_cast','include',
]);

const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*(?:(?!\\*\\/)[\\s\\S])*(?:\\*\\/)?)', // 1 comment
    ('("(?:[^"\\\\\\n]|\\\\.)*"?|\'(?:[^\'\\\\\\n]|\\\\.)*\'?)'), // 2 string/char
    '(^[ \\t]*#[a-z_]+)', // 3 preprocessor (multiline flag)
    '(\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[fuLlU]*\\b)', // 4 number
    '(\\b[A-Za-z_]\\w*\\b)', // 5 identifier
  ].join('|'),
  'gm'
);

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function highlightCpp(code: string): string {
  let out = '';
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    if (m.index > last) out += esc(code.slice(last, m.index));
    const [full, comment, str, pre, num, ident] = m;
    if (comment !== undefined) out += `<span class="tok-comment">${esc(comment)}</span>`;
    else if (str !== undefined) out += `<span class="tok-str">${esc(str)}</span>`;
    else if (pre !== undefined) out += `<span class="tok-pre">${esc(pre)}</span>`;
    else if (num !== undefined) out += `<span class="tok-num">${esc(num)}</span>`;
    else if (ident !== undefined) {
      if (KEYWORDS.has(ident)) out += `<span class="tok-kw">${esc(ident)}</span>`;
      else if (TYPES_AND_LITERALS.has(ident)) out += `<span class="tok-type">${esc(ident)}</span>`;
      else out += esc(ident);
    } else out += esc(full);
    last = m.index + full.length;
    if (full.length === 0) TOKEN_RE.lastIndex += 1; // safety
  }
  out += esc(code.slice(last));
  return out;
}

/** Safe <code> element with highlighting applied. */
export function highlightedCode(code: string): HTMLElement {
  const el = document.createElement('code');
  el.innerHTML = highlightCpp(code); // highlighter escapes all content
  return el;
}
