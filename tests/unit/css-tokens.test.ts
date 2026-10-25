import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================
// CSS source hygiene — regression guard
//
// Incident 2026-10-25: tokens.css used `//` line comments (invalid CSS).
// The parser's error recovery swallowed the whole `:root{}` rule, so every
// var(--token) was undefined in browsers: unstyled layout, invisible hero
// text (white-on-white), serif fallback font. These tests fail the build
// if anything similar reappears.
// ============================================================

const stylesDir = join(process.cwd(), 'src', 'styles');
const files = readdirSync(stylesDir).filter((f) => f.endsWith('.css'));

describe('css source hygiene', () => {
  for (const file of files) {
    const src = readFileSync(join(stylesDir, file), 'utf8');

    it(`${file}: no // line comments (invalid CSS that can swallow rules)`, () => {
      const bad = src.split('\n').map((l, i) => [l, i + 1] as const).filter(([l]) => /^\s*\/\//.test(l));
      expect(bad, bad.map(([l, n]) => `${file}:${n}: ${l}`).join('\n')).toHaveLength(0);
    });

    it(`${file}: balanced braces and comments`, () => {
      const noStrings = src.replace(/"[^"]*"|'[^']*'/g, '');
      expect((noStrings.match(/{/g) || []).length).toBe((noStrings.match(/}/g) || []).length);
      expect((noStrings.match(/\/\*/g) || []).length).toBe((noStrings.match(/\*\//g) || []).length);
    });
  }

  it('tokens.css defines :root with the core design tokens', () => {
    const src = readFileSync(join(stylesDir, 'tokens.css'), 'utf8');
    const rootBlock = /:root\s*\{([^}]*)\}/.exec(src);
    expect(rootBlock, 'missing :root rule').toBeTruthy();
    const body = rootBlock![1];
    for (const token of ['--c-primary', '--c-bg', '--c-text', '--font-km', '--sp-4', '--r-md', '--focus-ring', '--dur-base']) {
      expect(body, `token ${token} missing from :root`).toContain(token + ':');
    }
  });

  it('base.css gives buttons an inherited color (dark-theme visibility regression)', () => {
    const src = readFileSync(join(stylesDir, 'base.css'), 'utf8');
    const btnRule = /button\s*\{([^}]*)\}/.exec(src);
    expect(btnRule, 'button base rule missing').toBeTruthy();
    expect(btnRule![1], 'button rule must set color (incident: black text on dark surfaces)').toContain('color:');
  });

  it('tokens.css defines the dark theme overrides', () => {
    const src = readFileSync(join(stylesDir, 'tokens.css'), 'utf8');
    expect(src).toMatch(/\[data-theme=['"]dark['"]\]\s*\{/);
    expect(src).toContain('--c-bg:');
  });
});
