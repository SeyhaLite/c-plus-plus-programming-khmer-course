import { describe, it, expect } from 'vitest';
import { highlightCpp } from '../../src/utils/highlight';
import { cheerCorrect, cheerRetry, cheerComplete, cheerIdle, ALL_PHRASES, pickPhrase } from '../../src/data/encouragement';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================
// Syntax highlighter + encouragement phrase bank
// ============================================================

describe('C++ highlighter', () => {
  it('wraps keywords, types, strings, numbers, comments, preprocessor', () => {
    const html = highlightCpp('#include <iostream>\nint main() {\n  std::cout << "Hi" << 42; // note\n  return 0;\n}');
    expect(html).toContain('<span class="tok-pre">#include</span>');
    expect(html).toContain('<span class="tok-type">int</span>');
    expect(html).toContain('<span class="tok-kw">return</span>');
    expect(html).toContain('<span class="tok-type">std</span>');
    expect(html).toContain('<span class="tok-type">cout</span>');
    expect(html).toContain('<span class="tok-str">&quot;Hi&quot;</span>');
    expect(html).toContain('<span class="tok-num">42</span>');
    expect(html).toContain('<span class="tok-comment">// note</span>');
  });

  it('escapes HTML everywhere (XSS safe)', () => {
    const html = highlightCpp('std::cout << "<script>alert(1)</script>"; /* <img onerror=x> */');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;script&gt;');
  });

  it('survives unterminated strings and comments without throwing', () => {
    expect(() => highlightCpp('int x = "oops;\nint y = 5;')).not.toThrow();
    expect(() => highlightCpp('/* never closed\nint y = 5;')).not.toThrow();
    const html = highlightCpp('/* never closed\nint y = 5;');
    expect(html).toContain('tok-comment');
  });

  it('handles block comments spanning lines', () => {
    const html = highlightCpp('a /* x\ny */ b');
    expect(html).toContain('<span class="tok-comment">/* x\ny */</span>');
  });
});

describe('token colors exist for both themes', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'styles', 'tokens.css'), 'utf8');
  const rootBlocks = [...css.matchAll(/:root\s*\{[^}]*\}/g)].map((m) => m[0]).join('\n');
  const darkBlocks = [...css.matchAll(/\[data-theme=['"]dark['"]\]\s*\{[^}]*\}/g)].map((m) => m[0]).join('\n');
  for (const tok of ['--tok-kw', '--tok-type', '--tok-str', '--tok-num', '--tok-comment', '--tok-pre']) {
    it(`defines ${tok} in light and dark`, () => {
      expect(rootBlocks).toContain(tok + ':');
      expect(darkBlocks).toContain(tok + ':');
    });
  }
});

describe('encouragement phrases', () => {
  it('has at least 50 phrases in total', () => {
    expect(ALL_PHRASES.length).toBeGreaterThanOrEqual(50);
  });

  it('each category has at least 15 phrases', () => {
    for (const list of [cheerCorrect, cheerRetry, cheerComplete, cheerIdle]) {
      expect(list.length).toBeGreaterThanOrEqual(15);
    }
  });

  it('all phrases are Khmer, non-empty, and unique', () => {
    const seen = new Set<string>();
    for (const p of ALL_PHRASES) {
      expect(p.trim().length).toBeGreaterThan(5);
      expect(p).toMatch(/[ក-៿]/);
      expect(seen.has(p), `duplicate phrase: ${p}`).toBe(false);
      seen.add(p);
    }
  });

  it('pickPhrase returns members of the list', () => {
    for (let i = 0; i < 50; i++) {
      expect(cheerIdle).toContain(pickPhrase(cheerIdle));
    }
  });
});
