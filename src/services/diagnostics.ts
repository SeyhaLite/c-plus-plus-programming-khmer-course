import { APP_NAME, APP_VERSION } from '../data/curriculum';

// ============================================================
// Diagnostics — របាយការណ៍បញ្ហា (bug report) ដែលអាច copy បាន
// ច្បាប់៖
//  - មិនបង្កើត source path/line ក្លែង — បើមិនមានពី stack trace/sourcemap ទេ
//    សរសេរ "Not available in production"។
//  - redact ភាគសាស្ត្រដែលអាចជាសម្ងាត់ (token-like strings)។
//  - មិនប្រមូល IP ឬទិន្នន័យផ្ទាល់ខ្លួន។
// ============================================================

export interface DiagnosticInput {
  route: string;
  pageTitle: string;
  levelId?: number | null;
  unitId?: string | number | null;
  lessonId?: string | null;
  component?: string;
  category: string;
  errorMessage?: string;
  errorStack?: string;
  expected?: string;
  actual?: string;
  steps?: string;
  userAgent?: string;
  correlationId?: string;
}

const SECRET_PATTERN = /\b(?:ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9]{10,}\b/gi;
const BEARER_PATTERN = /\b(bearer|authorization|token|api[_-]?key|secret|password)(\s*[:=]\s*)\S+/gi;

/** Remove anything that looks like a credential from user-provided text. */
export function redactSecrets(text: string): string {
  return text.replace(SECRET_PATTERN, '[REDACTED_TOKEN]').replace(BEARER_PATTERN, '$1$2[REDACTED]');
}

/**
 * Derive a source location ONLY from a real stack trace frame that points at
 * our own source files (dev builds). Never guesses. Returns null otherwise.
 */
export function sourceLocationFromStack(stack?: string): { path: string; line: number } | null {
  if (!stack) return null;
  for (const line of stack.split('\n')) {
    const m = /(?:at\s+.*?\((.*?):(\d+):\d+\)|at\s+(.*?):(\d+):\d+)/.exec(line);
    const path = m?.[1] ?? m?.[3];
    const lineNo = m?.[2] ?? m?.[4];
    if (path && lineNo && /\/src\/.*\.(ts|tsx|css)/.test(path) && !path.includes('node_modules')) {
      return { path, line: Number(lineNo) };
    }
  }
  return null;
}

export function buildDiagnosticReport(input: DiagnosticInput): string {
  const src = sourceLocationFromStack(input.errorStack);
  const sourcePath = src ? src.path : 'Not available in production';
  const sourceLine = src ? String(src.line) : 'Not available';
  const ts = new Date().toISOString();

  const lines: string[] = [
    `Application: ${APP_NAME}`,
    `App version: ${APP_VERSION}`,
    `Route: ${input.route || 'unknown'}`,
    `Page title: ${input.pageTitle || 'unknown'}`,
    `Level: ${input.levelId ?? 'N/A'}`,
    `Unit: ${input.unitId ?? 'N/A'}`,
    `Lesson: ${input.lessonId ?? 'N/A'}`,
    `Component: ${input.component || 'N/A'}`,
    `Source path: ${sourcePath}`,
    `Source line: ${sourceLine}`,
    `Category: ${input.category || 'unspecified'}`,
    `Expected: ${input.expected || 'N/A'}`,
    `Actual: ${input.actual || 'N/A'}`,
    `Error: ${input.errorMessage ? redactSecrets(input.errorMessage) : 'none (usability report)'}`,
    `Timestamp: ${ts} (ISO 8601, UTC)`,
    `Correlation ID: ${input.correlationId ?? 'N/A'}`,
    `User agent: ${redactSecrets(input.userAgent ?? 'unknown')}`,
    '',
    'Steps to reproduce:',
    ...(input.steps ? input.steps.split('\n').map((s, i) => `${i + 1}. ${s.trim()}`) : ['1. (not provided)']),
  ];
  return lines.join('\n');
}

export function browserInfo(): { ua: string } {
  return { ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown' };
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
