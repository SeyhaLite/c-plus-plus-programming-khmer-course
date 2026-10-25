import { describe, it, expect } from 'vitest';
import { outputsMatch, codeMatches, normalizeForCompare } from '../../src/utils/dom';
import { renderMarkdown, escapeHtml } from '../../src/utils/markdown';

describe('grading: output comparison', () => {
  it('matches identical output', () => {
    expect(outputsMatch('Hello, World!\n', 'Hello, World!\n')).toBe(true);
  });
  it('tolerates trailing newline and CRLF differences', () => {
    expect(outputsMatch('Hello\r\n', 'Hello\n')).toBe(true);
    expect(outputsMatch('Hello', 'Hello\n')).toBe(true);
  });
  it('tolerates trailing spaces per line but not different content', () => {
    expect(outputsMatch('10  \n20', '10\n20\n')).toBe(true);
    expect(outputsMatch('10\n21', '10\n20')).toBe(false);
  });
  it('handles multi-line predicted output', () => {
    expect(outputsMatch('ទី ១\nទី ២\nទី ៣\n', 'ទី ១\nទី ២\nទី ៣')).toBe(true);
  });
  it('normalizeForCompare collapses spaces', () => {
    expect(normalizeForCompare('a  b')).toBe('a b');
  });
});

describe('grading: code/blank answers', () => {
  it('accepts exact and case-insensitive variants', () => {
    expect(codeMatches('std::cout', ['std::cout'])).toBe(true);
    expect(codeMatches('  std::cout  ', ['std::cout'])).toBe(true);
    expect(codeMatches('STD::COUT', ['std::cout'])).toBe(true);
  });
  it('accepts Khmer text answers ignoring surrounding whitespace', () => {
    expect(codeMatches(' ពិនិត្យចំណេះដឹង ', ['ពិនិត្យចំណេះដឹង'])).toBe(true);
  });
  it('rejects wrong answers', () => {
    expect(codeMatches('std::cin', ['std::cout'])).toBe(false);
    expect(codeMatches('', ['std::cout'])).toBe(false);
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
