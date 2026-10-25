// ============================================================
// Code execution — Approach B: External execution API (Wandbox)
//
// ហេតុអ្វីមិនមែន Piston? សេវា Piston សាធារណៈបានប្តូរទៅជា whitelist-only
// ចាប់ពីថ្ងៃ 2026-02-15 (ផ្ទៀងផ្ទាត់ដោយការសាកល្បងជាក់ស្តែង)។
// Wandbox (https://wandbox.org) គឺជាសេវាសាធារណៈគ្មាន API key
// ដែលបានសាកល្បងហើយថាដំណើរការជាមួយ g++ និង C++17។
//
// សុវត្ថិភាព និងឯកជនភាព (អានបន្ថែមក្នុង docs/SECURITY.md)៖
//  - មិនមានផ្ញើកូដទេ លុះត្រាតែអ្នកប្រើយល់ព្រមច្បាស់លាស់ (executionConsent)
//  - មាន timeout, ដែនកំណត់ទំហំកូដ និង output
//  - កូដដំណើរការក្នុង sandbox របស់ Wandbox មិនមែនលើម៉ាស៊ីនអ្នកប្រើទេ
//  - បើសេវាមិនអាចទាក់ទងបាន UI បង្ហាញសារពិត មិនក្លែងលទ្ធផលទេ
//  - Compiler ជាក់លាក់៖ gcc-13.2.0, -std=c++17 -Wall -Wextra
// ============================================================

const WANDBOX_URL = 'https://wandbox.org/api/compile.json';
export const COMPILER = 'gcc-13.2.0';
export const COMPILE_OPTIONS = ['-std=c++17', '-Wall', '-Wextra'];

export const LIMITS = {
  maxCodeBytes: 32_000,
  maxOutputBytes: 16_000,
  timeoutMs: 20_000, // Wandbox kills runaway programs server-side (exit 137)
} as const;

export interface RunResult {
  ok: boolean;
  stage: 'compile' | 'run' | 'network' | 'limits';
  stdout: string;
  stderr: string;
  exitCode: number | null;
  message_km: string;
  durationMs: number;
}

export interface RunOptions {
  code: string;
  stdin?: string;
}

function fail(stage: RunResult['stage'], message_km: string, detail = ''): RunResult {
  return { ok: false, stage, stdout: '', stderr: detail, exitCode: null, message_km, durationMs: 0 };
}

interface WandboxResponse {
  status?: string;
  signal?: string;
  compiler_output?: string;
  compiler_error?: string;
  program_output?: string;
  program_error?: string;
  program_message?: string;
}

export async function runCpp(options: RunOptions): Promise<RunResult> {
  const { code, stdin = '' } = options;

  if (new TextEncoder().encode(code).length > LIMITS.maxCodeBytes) {
    return fail('limits', `កូដវែងពេក (អតិបរមា ${LIMITS.maxCodeBytes} bytes)។ សូមកាត់បន្ថយ។`);
  }
  if (new TextEncoder().encode(stdin).length > LIMITS.maxCodeBytes) {
    return fail('limits', 'Input វែងពេក។');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIMITS.timeoutMs);
  const started = performance.now();

  try {
    const res = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        compiler: COMPILER,
        stdin,
        'compiler-option-raw': COMPILE_OPTIONS.join('\n'),
        'compiler-std': 'c++17',
      }),
      signal: controller.signal,
    });
    const durationMs = Math.round(performance.now() - started);

    if (!res.ok) {
      return { ...fail('network', `សេវាដំណើរការកូដត្រឡប់ HTTP ${res.status}។ សូមព្យាយាមម្តងទៀត។`), durationMs };
    }
    const data = (await res.json()) as WandboxResponse;
    const compileError = truncate(data.compiler_error ?? '', LIMITS.maxOutputBytes);
    const stdout = truncate(data.program_output ?? '', LIMITS.maxOutputBytes);
    const runtimeError = truncate(data.program_error ?? '', LIMITS.maxOutputBytes);
    const exitCode = data.status !== undefined && data.status !== '' ? Number(data.status) : null;

    // កំហុស compile៖ compiler_error មានមាតិកា ហើយគ្មាន program output
    if (compileError && !stdout && exitCode !== 0) {
      return {
        ok: false,
        stage: 'compile',
        stdout: truncate(data.compiler_output ?? '', LIMITS.maxOutputBytes),
        stderr: compileError,
        exitCode,
        message_km: 'កំហុស compile — សូមអានសារខាងក្រោម ហើយកែកូដរបស់អ្នក។',
        durationMs,
      };
    }

    const killed = exitCode === 137 || exitCode === 152 || data.signal === 'Killed';
    const crashed = data.signal !== undefined && data.signal !== '' && data.signal !== '0';

    return {
      ok: exitCode === 0 && !killed && !crashed,
      stage: 'run',
      stdout,
      stderr: runtimeError || compileError,
      exitCode,
      message_km: killed
        ? 'កម្មវិធីដំណើរការយូរពេក ហើយត្រូវបានបញ្ឈប់ដោយសេវា — សូមពិនិត្យ infinite loop។'
        : crashed
          ? `កម្មវិធីគាំងដោយសារ signal: ${data.signal} (ឧ. segmentation fault)។`
          : exitCode === 0
            ? 'ដំណើរការជោគជ័យ។'
            : `កម្មវិធីបញ្ចប់ដោយ exit code ${exitCode ?? '?'}។`,
      durationMs,
    };
  } catch (e) {
    const durationMs = Math.round(performance.now() - started);
    const aborted = e instanceof Error && e.name === 'AbortError';
    return {
      ...fail(
        'network',
        aborted
          ? 'ការសុំដំណើរការកូដហួសម៉ោងកំណត់ (20 វិនាទី)។ សូមព្យាយាមម្តងទៀត។'
          : 'មិនអាចទាក់ទងសេវាដំណើរការកូដបានទេ (អ៊ីនធឺណិត ឬសេវាមិនដំណើរការ)។ អ្នកនៅតែអាចសរសេរ និងរក្សាទុកកូដបាន។',
        e instanceof Error ? e.message : ''
      ),
      durationMs,
    };
  } finally {
    clearTimeout(timer);
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '\n…[output truncated]' : s;
}

export interface TestCaseResult {
  index: number;
  passed: boolean;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
}

export async function runTestCases(code: string, cases: { stdin: string; expectedOutput: string }[]): Promise<{ results: TestCaseResult[]; error?: string }> {
  const results: TestCaseResult[] = [];
  for (let i = 0; i < cases.length; i++) {
    const res = await runCpp({ code, stdin: cases[i].stdin });
    if (res.stage === 'network' || res.stage === 'limits') {
      return { results, error: res.message_km };
    }
    results.push({
      index: i,
      passed: res.ok && normalizeOutput(res.stdout) === normalizeOutput(cases[i].expectedOutput),
      expectedOutput: cases[i].expectedOutput,
      actualOutput: res.stdout,
      stderr: res.stderr,
    });
    if (!res.ok) break; // compile/run failure — no point continuing
  }
  return { results };
}

export function normalizeOutput(s: string): string {
  return s.replace(/\r\n/g, '\n').trimEnd();
}
