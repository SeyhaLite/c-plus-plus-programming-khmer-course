// ============================================================
// scripts/check-cpp-examples.ts — compile & run all C++ examples
// of published lessons with a real compiler (g++/clang++).
// Usage: npx tsx scripts/check-cpp-examples.ts
// Exit code 0 = all verified (or compiler unavailable → skip with notice).
// ============================================================
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { allLessons } from '../src/data/curriculum';
import type { CodeChallengeExercise } from '../src/types';

function findGxx(): string | null {
  for (const bin of ['g++', 'clang++']) {
    if (spawnSync(bin, ['--version']).status === 0) return bin;
  }
  return null;
}

const GXX = findGxx();
if (!GXX) {
  console.log('SKIP: no g++/clang++ found on this machine. Run in CI (ubuntu-latest) or install g++ to verify examples.');
  process.exit(0);
}

let failures = 0;
let checked = 0;

function compileAndRun(code: string, stdin: string): { ok: boolean; stdout: string; stderr: string } {
  const dir = mkdtempSync(join(tmpdir(), 'kca-cpp-'));
  const src = join(dir, 'main.cpp');
  const bin = join(dir, 'main.out');
  writeFileSync(src, code, 'utf8');
  try {
    try {
      execFileSync(GXX!, ['-std=c++17', '-Wall', '-Wextra', '-Werror', src, '-o', bin], { timeout: 60_000, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
      const err = e as { stderr?: string; stdout?: string };
      return { ok: false, stdout: '', stderr: String(err.stderr ?? err.stdout ?? e) };
    }
    const run = spawnSync(bin, { input: stdin, timeout: 10_000, encoding: 'utf8' });
    return { ok: run.status === 0, stdout: run.stdout ?? '', stderr: run.stderr ?? '' };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function check(label: string, code: string, stdin: string, expected: string): void {
  checked += 1;
  const r = compileAndRun(code, stdin);
  const pass = r.ok && r.stdout.trimEnd() === expected.trimEnd();
  if (!pass) {
    failures += 1;
    console.error(`FAIL ${label}`);
    if (r.stderr) console.error(r.stderr.split('\n').slice(0, 10).join('\n'));
    else console.error(`  expected: ${JSON.stringify(expected.trimEnd())}\n  actual:   ${JSON.stringify(r.stdout.trimEnd())}`);
  } else {
    console.log(`ok   ${label}`);
  }
}

for (const lesson of allLessons.filter((l) => l.status === 'published')) {
  lesson.examples.forEach((ex, i) => {
    if (ex.expectedOutput === undefined) return; // terminal-command examples
    check(`${lesson.id} example[${i}] "${ex.title_km}"`, ex.code, ex.stdin ?? '', ex.expectedOutput);
  });
  lesson.exercises.forEach((ex) => {
    if (ex.type === 'code_challenge') {
      const c = ex as CodeChallengeExercise;
      c.testCases.forEach((tc, i) => check(`${c.id} solution test[${i}]`, c.solutionCode, tc.stdin, tc.expectedOutput));
    }
  });
}

console.log(`\n${checked - failures}/${checked} C++ artifacts verified with ${GXX} -std=c++17 -Wall -Wextra -Werror`);
process.exit(failures > 0 ? 1 : 0);
