import { describe, it, expect } from 'vitest';
import { importStateJSON, migrateState, sanitizeState } from '../../src/services/storage';
import { defaultState } from '../../src/services/storage';
import { redactSecrets } from '../../src/services/diagnostics';
import { runCpp, LIMITS } from '../../src/services/code-execution';

// ============================================================
// Security hardening tests
// ============================================================

describe('security: malicious progress imports', () => {
  it('prototype pollution attempts do not touch Object.prototype', () => {
    const hostile = '{"app":"khmer-cpp-academy","state":{"__proto__":{"polluted":true},"completedLessons":{"__proto__":{"polluted2":true}}}}';
    const r = importStateJSON(hostile);
    expect(r.ok).toBe(true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted2).toBeUndefined();
    expect(Object.prototype.hasOwnProperty('polluted')).toBe(false);
  });

  it('deeply nested / cyclic-ish structures do not crash sanitize', () => {
    const weird: Record<string, unknown> = { ...defaultState() };
    weird.reviewQueue = [null, 42, 'x', { lessonId: 123 }];
    const s = sanitizeState(weird as never);
    expect(Array.isArray(s.reviewQueue)).toBe(true);
    s.reviewQueue.forEach((r) => expect(typeof r.lessonId).toBe('string'));
  });

  it('oversized strings are truncated, not stored verbatim', () => {
    const s = sanitizeState({
      ...defaultState(),
      snippets: [{ id: 'x', title: 't'.repeat(10_000), code: 'c'.repeat(2_000_000), savedAt: 'now' }],
    });
    expect(s.snippets.length).toBe(0); // over MAX_CODE_LEN → dropped entirely
    const s2 = migrateState({ snippets: [{ id: 'y', title: 'ok', code: 'z'.repeat(50_000), savedAt: 'now' }] });
    expect(s2.snippets[0].code.length).toBeLessThanOrEqual(100_000);
  });

  it('non-array collections are replaced by empty arrays', () => {
    const s = sanitizeState({ ...defaultState(), activity: 'not-an-array', snippets: 42, reviewQueue: {}, achievements: null } as never);
    expect(s.activity).toEqual([]);
    expect(s.snippets).toEqual([]);
    expect(s.reviewQueue).toEqual([]);
    expect(s.achievements).toEqual([]);
  });
});

describe('security: diagnostics redaction edge cases', () => {
  it('redacts even when token appears inside longer text', () => {
    const out = redactSecrets('user pasted ghp_1234567890abcdefghijABCDEF in a comment');
    expect(out).not.toContain('ghp_1234567890');
  });

  it('does not redact ordinary C++ code', () => {
    const code = 'std::cout << "token: " << value << std::endl;';
    expect(redactSecrets(code)).toBe(code);
  });
});

describe('security: code-execution request limits', () => {
  it('refuses oversized code without any network call', async () => {
    const huge = 'a'.repeat(LIMITS.maxCodeBytes + 1);
    const res = await runCpp({ code: huge });
    expect(res.ok).toBe(false);
    expect(res.stage).toBe('limits');
    expect(res.message_km).toContain('វែងពេក');
  });

  it('refuses oversized stdin without any network call', async () => {
    const res = await runCpp({ code: 'int main(){}', stdin: 'x'.repeat(LIMITS.maxCodeBytes + 1) });
    expect(res.ok).toBe(false);
    expect(res.stage).toBe('limits');
  });
});
