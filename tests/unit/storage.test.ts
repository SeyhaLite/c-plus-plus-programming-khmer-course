import { describe, it, expect } from 'vitest';
import {
  defaultState, loadState, saveState, migrateState, sanitizeState,
  exportStateJSON, importStateJSON, resetState, STORAGE_KEY, SCHEMA_VERSION,
  type StorageLike,
} from '../../src/services/storage';

function memStorage(initial: Record<string, string> = {}): StorageLike & { dump(): Record<string, string>; failNext?: boolean } {
  const data: Record<string, string> = { ...initial };
  const store = {
    failNext: false,
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => {
      if (store.failNext) {
        store.failNext = false;
        const err = new Error('quota');
        err.name = 'QuotaExceededError';
        throw err;
      }
      data[k] = v;
    },
    removeItem: (k: string) => { delete data[k]; },
    dump: () => ({ ...data }),
  };
  return store;
}

describe('persistence: load/save', () => {
  it('returns defaults for empty storage', () => {
    const r = loadState(memStorage());
    expect(r.ok).toBe(true);
    expect(r.state.schemaVersion).toBe(SCHEMA_VERSION);
    expect(r.state.xp).toBe(0);
  });

  it('round-trips state', () => {
    const store = memStorage();
    const s = defaultState();
    s.xp = 120;
    s.completedLessons['l0-what-is-cpp'] = { completedAt: new Date().toISOString(), score: 1, attempts: 1, hintsUsed: 0 };
    expect(saveState(s, store).ok).toBe(true);
    const r = loadState(store);
    expect(r.ok).toBe(true);
    expect(r.state.xp).toBe(120);
    expect(r.state.completedLessons['l0-what-is-cpp'].score).toBe(1);
  });

  it('handles unavailable storage gracefully', () => {
    const r = loadState(null);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('unavailable');
    expect(saveState(defaultState(), null).ok).toBe(false);
  });

  it('reports quota errors without throwing', () => {
    const store = memStorage();
    store.failNext = true;
    const res = saveState(defaultState(), store);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('quota');
  });

  it('recovers from corrupt JSON', () => {
    const store = memStorage({ [STORAGE_KEY]: '{not json!!' });
    const r = loadState(store);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('corrupt');
    expect(r.state.schemaVersion).toBe(SCHEMA_VERSION);
  });
});

describe('persistence: migration and sanitization', () => {
  it('migrates a v0-ish payload onto current schema keeping valid fields', () => {
    const raw = { schemaVersion: 0, xp: 42, currentLevel: 2, settings: { theme: 'dark' }, completedLessons: { 'l1-hello-world': { completedAt: '2026-01-01T00:00:00Z', score: 0.9, attempts: 2, hintsUsed: 1 } } };
    const s = migrateState(raw);
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(s.xp).toBe(42);
    expect(s.currentLevel).toBe(2);
    expect(s.settings.theme).toBe('dark');
    expect(s.settings.sound).toBe(false); // default filled in
    expect(s.completedLessons['l1-hello-world'].attempts).toBe(2);
  });

  it('clamps invalid numeric fields', () => {
    const s = migrateState({ xp: -500 });
    expect(s.xp).toBe(0);
    const s2 = sanitizeState({ ...defaultState(), xp: Number.NaN });
    expect(s2.xp).toBe(0);
  });

  it('drops oversized and malformed snippets', () => {
    const s = sanitizeState({
      ...defaultState(),
      snippets: [
        { id: 'a', title: 'ok', code: 'int main(){}', savedAt: '2026-01-01' },
        { id: 'b', title: 'huge', code: 'x'.repeat(200_000), savedAt: '2026-01-01' },
        null as never,
        { id: 'c' } as never,
      ],
    });
    expect(s.snippets.length).toBe(1);
    expect(s.snippets[0].id).toBe('a');
  });

  it('caps activity and review queue length', () => {
    const activity = Array.from({ length: 500 }, (_, i) => ({ at: new Date().toISOString(), kind: 'lesson_completed' as const, detail_km: `x${i}` }));
    const s = sanitizeState({ ...defaultState(), activity });
    expect(s.activity.length).toBeLessThanOrEqual(100);
  });
});

describe('persistence: export/import', () => {
  it('export produces importable JSON', () => {
    const s = defaultState();
    s.xp = 77;
    const json = exportStateJSON(s);
    const r = importStateJSON(json);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state.xp).toBe(77);
  });

  it('rejects non-JSON', () => {
    const r = importStateJSON('this is not json');
    expect(r.ok).toBe(false);
  });

  it('rejects JSON from another app', () => {
    const r = importStateJSON(JSON.stringify({ app: 'some-other-app', state: defaultState() }));
    expect(r.ok).toBe(false);
  });

  it('imported hostile payload is sanitized, not trusted', () => {
    const hostile = JSON.stringify({
      app: 'khmer-cpp-academy',
      state: {
        schemaVersion: 999,
        xp: 'not-a-number',
        snippets: [{ code: 'y'.repeat(500_000), title: 'z'.repeat(1000) }],
        settings: { theme: 'neon', sound: 'loud' },
        completedLessons: 'not-an-object',
      },
    });
    const r = importStateJSON(hostile);
    expect(r.ok).toBe(true); // salvageable, not rejected outright
    if (r.ok) {
      expect(r.state.schemaVersion).toBe(SCHEMA_VERSION);
      expect(r.state.xp).toBe(0);
      expect(r.state.settings.theme).not.toBe('neon' as never);
      expect(['light', 'dark']).toContain(r.state.settings.theme);
      expect(r.state.completedLessons).toEqual({});
      expect(r.state.snippets.every((sn) => sn.code.length <= 100_000 && sn.title.length <= 120)).toBe(true);
    }
  });

  it('reset returns to defaults and persists', () => {
    const store = memStorage();
    const s = defaultState();
    s.xp = 999;
    saveState(s, store);
    const fresh = resetState(store);
    expect(fresh.xp).toBe(0);
    const reloaded = loadState(store);
    expect(reloaded.ok && reloaded.state.xp === 0).toBe(true);
  });
});
