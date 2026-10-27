import { describe, it, expect } from 'vitest';
import {
  gradeBlank,
  outputsMatch,
  normalizeOutputForCompare,
  foldOperatorSpacing,
  stripWrappingQuotes,
  findInvisibles,
  findHomoglyphs,
  describeMismatch,
  levenshtein,
} from '../../src/utils/grading';
import { renderMarkdown, escapeHtml } from '../../src/utils/markdown';

// ============================================================
// Grading tests — ការវិនិច្ឆ័យចម្លើយ
// ច្បាប់សំខាន់៖ (១) ចម្លើយត្រឹមត្រូវគ្រប់ទម្រង់ត្រូវជាប់
//               (២) ចម្លើយខុសត្រូវធ្លាក់
//               (៣) អ្នកសិក្សាមិនត្រូវជាប់គាំងដោយសារអក្សរលាក់/អក្សរដូច ASCII
// ============================================================

const CYR_O = '\u043e'; // о ដូច o
const CYR_S = '\u0455'; // ѕ ដូច s
const ZWSP = '\u200b';
const NBSP = '\u00a0';

describe('grading: output comparison (predict_output)', () => {
  it('matches identical output', () => {
    expect(outputsMatch('Hello, World!\n', 'Hello, World!\n')).toBe(true);
  });
  it('tolerates trailing newline, trailing spaces and CRLF differences', () => {
    expect(outputsMatch('Hello\r\n', 'Hello\n')).toBe(true);
    expect(outputsMatch('Hello', 'Hello\n')).toBe(true);
    expect(outputsMatch('10  \n20', '10\n20\n')).toBe(true);
  });
  it('rejects different content', () => {
    expect(outputsMatch('10\n21', '10\n20')).toBe(false);
  });
  it('PRESERVES blank lines (regression: old normalizeForCompare deleted them)', () => {
    // កំហុសចាស់៖ អ្នកសិក្សាដែលភ្លេចបន្ទាត់ទទេត្រូវបានចាត់ទុកថាត្រូវ
    expect(outputsMatch('1\n2', '1\n\n2')).toBe(false);
    expect(outputsMatch('1\n\n2', '1\n\n2')).toBe(true);
    expect(outputsMatch('\n1', '1')).toBe(false);
  });
  it('handles multi-line Khmer output', () => {
    expect(outputsMatch('ទី ១\nទី ២\nទី ៣\n', 'ទី ១\nទី ២\nទី ៣')).toBe(true);
  });
  it('normalizeOutputForCompare keeps line count', () => {
    expect(normalizeOutputForCompare('a\n\nb\n\n\n').split('\n').length).toBe(3);
  });
});

describe('grading: C++ code answers are case-SENSITIVE (regression)', () => {
  it('rejects STD::COUT — it does not compile in C++', () => {
    // កំហុសចាស់៖ codeMatches បានទទួលយក STD::COUT ជាចម្លើយត្រូវ
    expect(gradeBlank('STD::COUT', ['std::cout']).ok).toBe(false);
    expect(gradeBlank('Std::Cout', ['std::cout']).ok).toBe(false);
  });
  it('still explains the case problem specifically', () => {
    const v = gradeBlank('STD::COUT', ['std::cout']);
    expect(v.problems.some((p) => p.kind === 'case')).toBe(true);
  });
  it('accepts case variants when the author opts in (text answers)', () => {
    // ចម្លើយជាអត្ថបទ (មានអក្សរខ្មែរ ឬ prose: true) → អត់ឱន case
    expect(gradeBlank('Placement Test', ['placement test', 'ពិនិត្យចំណេះដឹង']).ok).toBe(true);
    expect(gradeBlank('BUG REPORT', ['bug report'], { text: true }).ok).toBe(true);
    // ចម្លើយជាកូដ → មិនអត់ឱន case ប៉ុន្តែប្រាប់មូលហេតុ
    expect(gradeBlank('Placement Test', ['placement test']).ok).toBe(false);
  });
});

describe('grading: accepts every equivalent form of the same C++', () => {
  it('accepts exact and whitespace-padded answers', () => {
    expect(gradeBlank('std::cout', ['std::cout']).ok).toBe(true);
    expect(gradeBlank('  std::cout  ', ['std::cout']).ok).toBe(true);
    expect(gradeBlank('\tstd::cout\n', ['std::cout']).ok).toBe(true);
  });
  it('accepts NBSP typed by some IMEs', () => {
    expect(gradeBlank(`std::${NBSP}cout`, ['std:: cout']).ok).toBe(true);
  });
  it('accepts all equivalent increments (regression: old grader failed i+=1 / i = i + 1)', () => {
    const accepted = ['++i', 'i++', 'i += 1', 'i=i+1'];
    for (const a of ['++i', 'i++', 'i += 1', 'i+=1', 'i = i + 1', 'i=i+1', '  i  +=  1  ']) {
      expect(gradeBlank(a, accepted).ok, `should accept ${JSON.stringify(a)}`).toBe(true);
    }
  });
  it('foldOperatorSpacing is whitespace-insensitive around operators', () => {
    expect(foldOperatorSpacing('i = i + 1')).toBe('i=i+1');
    expect(foldOperatorSpacing('i+=1')).toBe('i+=1');
    expect(foldOperatorSpacing('a  &&  b')).toBe('a&&b');
    // ចំណាំ៖ `i+=1` និង `i = i + 1` មិនមែនជាទម្រង់ដូចគ្នាទេ (+= គឺជា operator ផ្សេង)
    // ដូច្នេះអ្នកនិពន្ធមាតិកាត្រូវដាក់ **ទាំងពីរ** ក្នុង acceptedAnswers។
    expect(gradeBlank('i+=1', ['i = i + 1']).ok).toBe(false);
    expect(gradeBlank('i+=1', ['i = i + 1', 'i+=1']).ok).toBe(true);
    // ចន្លោះមិនសំខាន់ ពេល operator ដូចគ្នា
    expect(gradeBlank('i += 1', ['i+=1']).ok).toBe(true);
    expect(gradeBlank('a&&b', ['a && b']).ok).toBe(true);
  });
  it('accepts a quoted escape sequence when the blank is inside a string literal', () => {
    expect(gradeBlank('"\\n"', ['\\n']).ok).toBe(true);
    expect(stripWrappingQuotes('"\\n"')).toBe('\\n');
  });
  it('accepts the C++ alternative token `and` for &&', () => {
    expect(gradeBlank('and', ['&&', 'and']).ok).toBe(true);
  });
  it('rejects answers with different meaning', () => {
    expect(gradeBlank('std::cin', ['std::cout']).ok).toBe(false);
    expect(gradeBlank('std::endl', ['std::cout']).ok).toBe(false);
    expect(gradeBlank('&', ['&&']).ok).toBe(false);
    expect(gradeBlank('', ['std::cout']).ok).toBe(false);
    expect(gradeBlank('   ', ['std::cout']).ok).toBe(false);
  });
});

describe('grading: invisible characters and homoglyphs never dead-end the learner', () => {
  it('detects zero-width characters by name', () => {
    expect(findInvisibles(`std::cout${ZWSP}`)).toEqual(['zero-width space (U+200B)']);
  });
  it('detects look-alike non-ASCII characters', () => {
    const found = findHomoglyphs(`std::c${CYR_O}ut`);
    expect(found.length).toBe(1);
    expect(found[0]).toContain('U+043E');
  });
  it('a single homoglyph is auto-accepted AND explained (regression: was a permanent dead end)', () => {
    // កំហុសចាស់៖ «std::cоut» (o របស់ Cyrillic) បានទទួលសារ «ស្ទើរតែត្រូវហើយ ខុសតែ ១ អក្សរ»
    // ប៉ុន្តែអ្នកសិក្សាមើលមិនឃើញអក្សរខុស ដូច្នេះជាប់គាំងជាអចិន្ត្រៃយ៍។
    const v = gradeBlank(`std::c${CYR_O}ut`, ['std::cout']);
    expect(v.ok).toBe(true);
    expect(v.autoFixed).toBe(true);
    expect(v.note_km).toContain('U+043E');
  });
  it('invisible characters are stripped and explained, not silently failed', () => {
    const v = gradeBlank(`std::cout${ZWSP}`, ['std::cout']);
    expect(v.ok).toBe(true);
    expect(v.autoFixed).toBe(true);
    expect(v.problems.some((p) => p.kind === 'invisible')).toBe(true);
  });
  it('multiple homoglyphs still resolve', () => {
    expect(gradeBlank(`${CYR_S}td::c${CYR_O}ut`, ['std::cout']).ok).toBe(true);
  });
  it('Khmer text is NOT homoglyph-folded (it is legitimate prose)', () => {
    expect(gradeBlank('ពិនិត្យចំណេះដឹង', ['ពិនិត្យចំណេះដឹង']).ok).toBe(true);
  });
});

describe('grading: near-miss feedback is available for EVERY answer length (regression)', () => {
  it('old fuzzyClose had a length<4 gate — short answers got zero diagnostics', () => {
    // កំហុសចាស់៖ `%` `&&` `//` `&` `\n` មិនទទួលបានការវិនិច្ឆ័យ «ជិតត្រូវ» ទេ
    expect(gradeBlank('&&&', ['&&']).close).toBe(true);
    expect(gradeBlank('&&', ['&']).close).toBe(true);
    expect(gradeBlank('///', ['//']).close).toBe(true);
    expect(gradeBlank('/n', ['\\n']).close).toBe(true);
  });
  it('clearly-wrong short answers are not marked close', () => {
    expect(gradeBlank('printf', ['&&']).close).toBe(false);
    expect(gradeBlank('while', ['&&']).close).toBe(false);
  });
  it('describeMismatch pinpoints the differing character', () => {
    const msg = describeMismatch('std::cont', 'std::cout');
    // std::co|u|t  vs  std::co|n|t → ភាពខុសគ្នានៅតួទី ៨
    expect(msg).toContain('ទីតាំង 8');
    expect(msg).toContain('"n"');
    expect(msg).toContain('"u"');
  });
  it('describeMismatch names invisible and look-alike characters', () => {
    expect(describeMismatch(`std::cout${ZWSP}`, 'std::cout')).toContain('លាក់');
    expect(describeMismatch(`std::c${CYR_O}ut`, 'std::cout')).toContain('U+043E');
  });
  it('levenshtein sanity', () => {
    expect(levenshtein('cout', 'cont')).toBe(1);
    expect(levenshtein('std::cout', 'std::cont')).toBe(1);
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('abc', 'abc')).toBe(0);
  });
});

describe('grading: Khmer prose answers are tolerant like a human grader', () => {
  it('accepts a shorter phrase that names the same UI element', () => {
    // កំហុសចាស់៖ អ្នកសិក្សាវាយ «រាយការណ៍» (ធម្មជាតិបំផុត) → ធ្លាក់ដោយគ្មានមតិ
    expect(gradeBlank('រាយការណ៍', ['រាយការណ៍បញ្ហា', 'bug report']).ok).toBe(true);
    expect(gradeBlank('រាយការណ៍បញ្ហា', ['រាយការណ៍បញ្ហា']).ok).toBe(true);
    expect(gradeBlank('bug report', ['រាយការណ៍បញ្ហា', 'bug report']).ok).toBe(true);
  });
  it('still rejects unrelated Khmer text', () => {
    expect(gradeBlank('ការកំណត់', ['រាយការណ៍បញ្ហា']).ok).toBe(false);
  });
});

describe('markdown renderer safety', () => {
  it('escapes raw HTML in content', () => {
    const html = renderMarkdown('<script>alert("xss")</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
  it('escapes HTML inside inline code', () => {
    const html = renderMarkdown('use `<img onerror=alert(1)>` here');
    expect(html).not.toContain('<img');
    expect(html).toContain('<code>');
  });
  it('escapes HTML inside fenced code blocks', () => {
    const html = renderMarkdown('```cpp\n<b>x</b>\n```');
    expect(html).not.toContain('<b>');
    expect(html).toContain('<pre');
  });
  it('renders bold, italic, bullets and headings', () => {
    const html = renderMarkdown('## Title\n**bold** and *em*\n- item1\n- item2');
    expect(html).toContain('<h3>Title</h3>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>em</em>');
    expect(html).toContain('<li>item1</li>');
  });
  it('escapeHtml covers the dangerous five', () => {
    expect(escapeHtml(`<>&"'`)).toBe('&lt;&gt;&amp;&quot;&#39;');
  });
});
