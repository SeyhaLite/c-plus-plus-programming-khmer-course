import { describe, it, expect } from 'vitest';
import { buildDiagnosticReport, redactSecrets, sourceLocationFromStack } from '../../src/services/diagnostics';

describe('diagnostics: secret redaction', () => {
  it('redacts GitHub PATs of every prefix', () => {
    const text = 'key=github_pat_11ABCDEFGHIJKabcdefghij0123456789 and ghp_abcdefghijABCDEFGHIJ0123456789abcdefgh';
    const out = redactSecrets(text);
    expect(out).not.toContain('github_pat_11ABCDEFGHIJK');
    expect(out).not.toContain('ghp_abcdefghij');
    expect(out).toContain('[REDACTED_TOKEN]');
  });

  it('redacts bearer/api key style values', () => {
    const out = redactSecrets('Authorization: Bearer abc123 ; api_key=secretvalue password: hunter2');
    expect(out).not.toContain('abc123');
    expect(out).not.toContain('secretvalue');
    expect(out).not.toContain('hunter2');
    expect(out).toContain('[REDACTED]');
  });

  it('leaves normal text untouched', () => {
    const text = 'Compile failed at main.cpp:12 — expected ;';
    expect(redactSecrets(text)).toBe(text);
  });
});

describe('diagnostics: source location honesty', () => {
  it('returns null when no stack is provided', () => {
    expect(sourceLocationFromStack(undefined)).toBeNull();
  });

  it('extracts a real src path from a dev stack trace', () => {
    const stack = 'Error: boom\n    at renderLesson (http://localhost:5173/src/features/lessons/lesson-view.ts:42:11)';
    const loc = sourceLocationFromStack(stack);
    expect(loc).not.toBeNull();
    expect(loc?.path).toContain('src/features/lessons/lesson-view.ts');
    expect(loc?.line).toBe(42);
  });

  it('ignores node_modules frames rather than guessing', () => {
    const stack = 'at foo (/app/node_modules/lib/index.js:10:2)';
    expect(sourceLocationFromStack(stack)).toBeNull();
  });

  it('report marks unavailable fields honestly', () => {
    const report = buildDiagnosticReport({
      route: '/levels/1/lessons/l1-hello-world',
      pageTitle: 'test',
      category: 'Compilation error',
    });
    expect(report).toContain('Source path: Not available in production');
    expect(report).toContain('Source line: Not available');
    expect(report).not.toMatch(/Source (path|line): src\//);
  });
});

describe('diagnostics: report shape', () => {
  it('includes app metadata, route context and ISO timestamp', () => {
    const report = buildDiagnosticReport({
      route: '/levels/1/lessons/l1-hello-world',
      pageTitle: 'Hello World',
      levelId: 1,
      lessonId: 'l1-hello-world',
      component: 'CodeEditor',
      category: 'Compilation error',
      expected: 'Program prints greeting',
      actual: 'Compilation failed',
      errorMessage: "main.cpp:5 error: expected ';'",
      steps: 'Open the lesson.\nRun the code.\nInspect output.',
      userAgent: 'Mozilla/5.0 (Test)',
    });
    expect(report).toContain('Application: Khmer C++ Academy');
    expect(report).toContain('Route: /levels/1/lessons/l1-hello-world');
    expect(report).toContain('Level: 1');
    expect(report).toContain('Lesson: l1-hello-world');
    expect(report).toContain('Component: CodeEditor');
    expect(report).toContain('Timestamp: ');
    expect(report).toMatch(/Timestamp: \d{4}-\d{2}-\d{2}T.*\(ISO 8601, UTC\)/);
    expect(report).toContain('1. Open the lesson.');
    expect(report).toContain('3. Inspect output.');
  });

  it('redacts secrets smuggled through user text fields', () => {
    const report = buildDiagnosticReport({
      route: '/', pageTitle: 't', category: 'other',
      errorMessage: 'failed with github_pat_11ABCDEFGHIJKabcdefghij0123456789',
    });
    expect(report).not.toContain('github_pat_11ABCDEFGHIJKabcdefghij0123456789');
    expect(report).toContain('[REDACTED_TOKEN]');
  });

  it('distinguishes usability reports from runtime errors', () => {
    const report = buildDiagnosticReport({ route: '/', pageTitle: 't', category: 'បញ្ហា UI' });
    expect(report).toContain('Error: none (usability report)');
  });
});
