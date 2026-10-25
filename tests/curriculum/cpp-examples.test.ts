import { describe, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { allLessons } from '../../src/data/curriculum';
import type { CodeChallengeExercise } from '../../src/types';

// ============================================================
// Real compiler validation — ផ្ទៀងផ្ទាត់ឧទាហរណ៍ C++ ដោយ g++ ពិត
// រត់ក្នុង CI (ubuntu-latest មាន g++)។ នៅម៉ាស៊ីនគ្មាន g++ វា skip។
// ស្តង់ដារ៖ C++17 (ដូចក្នុងឯកសារ)។
// ============================================================

function findGxx(): string | null {
  for (const bin of ['g++', 'clang++']) {
    const r = spawnSync(bin, ['--version']);
    if (r.status === 0) return bin;
  }
  return null;
}

const GXX = findGxx();
const describeG = GXX ? describe : describe.skip;

interface CompileRunResult {
  compiled: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

function compileAndRun(code: string, stdin: string): CompileRunResult {
  const dir = mkdtempSync(join(tmpdir(), 'kca-cpp-'));
  const src = join(dir, 'main.cpp');
  const bin = join(dir, 'main.out');
  writeFileSync(src, code, 'utf8');
  try {
    try {
      execFileSync(GXX!, ['-std=c++17', '-Wall', '-Wextra', '-Werror', src, '-o', bin], {
        timeout: 60_000,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      const err = e as { stderr?: string; stdout?: string; status?: number | null };
      // Werror: warnings count as failures to keep examples pristine
      return { compiled: false, stdout: '', stderr: String(err.stderr ?? err.stdout ?? e), exitCode: err.status ?? null };
    }
    const run = spawnSync(bin, { input: stdin, timeout: 10_000, encoding: 'utf8' });
    return { compiled: true, stdout: run.stdout ?? '', stderr: run.stderr ?? '', exitCode: run.status };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const published = allLessons.filter((l) => l.status === 'published');

describeG(`C++ examples compile and produce documented output (compiler: ${GXX})`, () => {
  for (const lesson of published) {
    for (const example of lesson.examples) {
      if (example.expectedOutput === undefined) continue; // terminal-command examples
      it(`${lesson.id} :: ${example.title_km}`, () => {
        const r = compileAndRun(example.code, example.stdin ?? '');
        expect(r.compiled, `compile stderr:\n${r.stderr}`).toBe(true);
        expect(r.exitCode, `exit code, stderr:\n${r.stderr}`).toBe(0);
        expect(r.stdout).toBe(example.expectedOutput);
      });
    }
  }
});

describeG('C++ code_challenge solutions pass their own test cases', () => {
  const challenges = published.flatMap((l) =>
    l.exercises.filter((e): e is CodeChallengeExercise => e.type === 'code_challenge').map((e) => ({ lessonId: l.id, ex: e }))
  );

  it('has challenges to validate', () => {
    expect(challenges.length).toBeGreaterThan(0);
  });

  for (const { ex } of challenges) {
    it(`${ex.id} solution passes ${ex.testCases.length} test case(s)`, () => {
      for (const tc of ex.testCases) {
        const r = compileAndRun(ex.solutionCode, tc.stdin);
        expect(r.compiled, `compile failed:\n${r.stderr}`).toBe(true);
        expect(r.exitCode, `runtime stderr:\n${r.stderr}`).toBe(0);
        expect(r.stdout.trimEnd()).toBe(tc.expectedOutput.trimEnd());
      }
    });
  }
});

describe('g++ availability notice', () => {
  it('reports compiler presence honestly (skipped compile tests mean no g++ here)', () => {
    if (!GXX) {
      // Not a failure: CI provides g++; local sandboxes may not.
      expect(existsSync('/usr/bin/g++')).toBe(false);
    } else {
      expect(typeof GXX).toBe('string');
    }
  });
});
