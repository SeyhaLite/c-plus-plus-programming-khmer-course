// ============================================================
// Grading — ការវិនិច្ឆ័យចម្លើយអ្នកសិក្សា (learner answer grading)
//
// គោលការណ៍រចនា (យកគំរូតាមវេទិកាដែលបានសាកល្បងហើយ)៖
//  1. Runestone `fillintheblank`៖ ចម្លើយមួយចន្លោះអាចមាន **ច្រើនទម្រង់ត្រឹមត្រូវ**
//     (regex/variants) ហើយចម្លើយខុសនីមួយៗទទួលបាន **មតិជាក់លាក់** — មិនមែនសារទូទៅទេ។
//     Runestone ក៏មានជម្រើស `:casei:` ដាច់ដោយឡែក — ដោយលំនាំដើម **case-sensitive**
//     ព្រោះកូដពិត case-sensitive។
//  2. Runestone "Compare me"៖ បើអ្នកសិក្សាខុស បង្ហាញ **ការប្រៀបធៀបតួអក្សរម្តងមួយៗ**
//     ជាមួយចម្លើយត្រឹមត្រូវ ដើម្បីឲ្យឃើញកំហុសពិត (រួមទាំងអក្សរលាក់/អក្សរដូចគ្នា)។
//  3. freeCodeCamp curriculum-helpers៖ ធ្វើ normalization ឲ្យបានច្រើនមុនប្រៀបធៀប
//     (`removeWhiteSpace`, `stripQuotes`, regex permutation) ដើម្បីកុំដាក់ទោសអ្នកសិក្សា
//     ចំពោះទម្រង់ដែលមិនសំខាន់។ តែ **មិន** បំពានលើអត្ថន័យកូដ។
//  4. VS Code `unicode.highlight`៖ អក្សរដែលមើលទៅដូច ASCII (homoglyph/confusable)
//     និងអក្សរលាក់ (ZWSP/BOM/bidi) ត្រូវបាន **រកឃើញ និងរាយការណ៍ដោយឈ្មោះ** —
//     មិនមែនគ្រាន់តែនិយាយ "ស្ទើរតែត្រូវ" ទេ។
//
// ច្បាប់សំខាន់បំផុត៖ **បើប្រព័ន្ធប្រាប់អ្នកសិក្សាថា "ស្ទើរតែត្រូវ ខុសតែ ១ អក្សរ"
// ប្រព័ន្ធត្រូវតែអាចប្រាប់បានថាអក្សរណា។** បើមិនដូច្នោះទេ អ្នកសិក្សាជាប់គាំង។
// ============================================================

/**
 * តារាងអក្សរដែលមើលទៅដូច ASCII ប៉ុន្តែមិនមែន ASCII (confusables / homoglyphs)។
 * កើតឡើងញឹកញាប់ពេលអ្នកសិក្សាវាយដោយ keyboard ខ្មែរ/러ស្ស៊ី/ក្រិក ឬ copy ពីគេហទំព័រ។
 * យើង **រាយការណ៍** វា (មិនលាក់ការកែ) ហើយអាចប្រើសម្រាប់ប្រៀបធៀបដោយអត់ឱន។
 */
const CONFUSABLES: Record<string, string> = {
  '\u0430': 'a', '\u0435': 'e', '\u043e': 'o', '\u0440': 'p', '\u0441': 'c', '\u0443': 'y',
  '\u0445': 'x', '\u0455': 's', '\u0456': 'i', '\u0458': 'j', '\u04bb': 'h', '\u0501': 'd',
  '\u051b': 'q', '\u051d': 'w', '\u0410': 'A', '\u0412': 'B', '\u0415': 'E', '\u041a': 'K',
  '\u041c': 'M', '\u041d': 'H', '\u041e': 'O', '\u0420': 'P', '\u0421': 'C', '\u0422': 'T',
  '\u0425': 'X', '\u0405': 'S', '\u0406': 'I', '\u0408': 'J',
  '\u0391': 'A', '\u0392': 'B', '\u0395': 'E', '\u0396': 'Z', '\u0397': 'H', '\u0399': 'I',
  '\u039a': 'K', '\u039c': 'M', '\u039d': 'N', '\u039f': 'O', '\u03a1': 'P', '\u03a4': 'T',
  '\u03a5': 'Y', '\u03a7': 'X', '\u03bf': 'o', '\u03b1': 'a', '\u03b5': 'e', '\u03b9': 'i',
  '\u03ba': 'k', '\u03bd': 'v', '\u03c1': 'p', '\u03c4': 't', '\u03c5': 'u', '\u03c7': 'x',
  '\u0393': 'r', '\u0491': 'r',
  '\u2010': '-', '\u2011': '-', '\u2012': '-', '\u2013': '-', '\u2014': '-', '\u2015': '-',
  '\u2212': '-', '\uff0d': '-',
  '\u2018': "'", '\u2019': "'", '\u201a': "'", '\u201b': "'", '\u02bc': "'", '\uff07': "'",
  '\u201c': '"', '\u201d': '"', '\u201e': '"', '\u201f': '"', '\uff02': '"',
  '\uff01': '!', '\uff08': '(', '\uff09': ')', '\uff0c': ',', '\uff0e': '.', '\uff1a': ':',
  '\uff1b': ';', '\uff1c': '<', '\uff1e': '>', '\uff1f': '?', '\uff3b': '[', '\uff3d': ']',
  '\uff3f': '_', '\uff5b': '{', '\uff5d': '}', '\uff06': '&', '\uff0a': '*', '\uff0b': '+',
  '\uff0f': '/', '\uff1d': '=', '\uff20': '@', '\uff3c': '\\', '\uff5c': '|', '\uff05': '%',
  '\uff03': '#', '\uff04': '$', '\uff3e': '^', '\uff5e': '~',
  '\uff10': '0', '\uff11': '1', '\uff12': '2', '\uff13': '3', '\uff14': '4',
  '\uff15': '5', '\uff16': '6', '\uff17': '7', '\uff18': '8', '\uff19': '9',
};

/** អក្សរលាក់ដែលមើលមិនឃើញ ប៉ុន្តែធ្វើឲ្យការប្រៀបធៀបបរាជ័យ។ */
const INVISIBLES: Record<string, string> = {
  '\u200b': 'zero-width space',
  '\u200c': 'zero-width non-joiner',
  '\u200d': 'zero-width joiner',
  '\u2060': 'word joiner',
  '\ufeff': 'BOM / zero-width no-break space',
  '\u00ad': 'soft hyphen',
  '\u200e': 'left-to-right mark',
  '\u200f': 'right-to-left mark',
  '\u202a': 'left-to-right embedding',
  '\u202b': 'right-to-left embedding',
  '\u202c': 'pop directional formatting',
  '\u202d': 'left-to-right override',
  '\u202e': 'right-to-left override',
  '\u2066': 'left-to-right isolate',
  '\u2067': 'right-to-left isolate',
  '\u2068': 'first strong isolate',
  '\u2069': 'pop directional isolate',
  '\u034f': 'combining grapheme joiner',
  '\u180e': 'Mongolian vowel separator',
};

const INVISIBLE_RE = new RegExp(`[${Object.keys(INVISIBLES).join('')}]`, 'g');
const CONFUSABLE_RE = new RegExp(`[${Object.keys(CONFUSABLES).join('')}]`, 'g');
const ASCII_RE = /^[\x20-\x7e]*$/;

/** លទ្ធផលវិនិច្ឆ័យមួយចន្លោះ — មានមតិជាក់លាក់ មិនមែនសារទូទៅ។ */
export interface BlankVerdict {
  ok: boolean;
  /** ចម្លើយត្រូវ ប៉ុន្តែត្រូវការការអត់ឱន (ឧ. case ខុស ឬមានអក្សរលាក់)។ */
  autoFixed: boolean;
  /** សារខ្លីជាភាសាខ្មែរ ពន្យល់ពីអ្វីដែលប្រព័ន្ធបានកែ/រកឃើញ។ */
  note_km: string;
  /** កំហុសជាក់លាក់ដែលរកឃើញ (សម្រាប់បង្ហាញអ្នកសិក្សា)។ */
  problems: AnswerProblem[];
  /** ខុសបន្តិចបន្តួច (near miss) ឬអត់។ */
  close: boolean;
  /** ចម្លើយដែលបាន normalize រួច (សម្រាប់ប្រៀបធ្កប)។ */
  normalized: string;
}

export type AnswerProblem =
  | { kind: 'invisible'; chars: string[] }
  | { kind: 'homoglyph'; chars: string[] }
  | { kind: 'case'; expected: string; got: string }
  | { kind: 'extra-punctuation'; char: string }
  | { kind: 'wrong'; };

/**
 * ដកអក្សរលាក់ចេញ ហើយប្តូរ NBSP ទៅជាចន្លោះធម្មតា។
 * (មិនកែ homoglyph នៅទីនេះ — ការកែត្រូវបានរាយការណ៍ដាច់ដោយឡែក។)
 */
export function stripInvisibles(s: string): string {
  return s.replace(INVISIBLE_RE, '').replace(/\u00a0/g, ' ');
}

/** រកអក្សរលាក់ដែលមានក្នុងចម្លើយ។ */
export function findInvisibles(s: string): string[] {
  const out: string[] = [];
  for (const ch of s) {
    if (INVISIBLES[ch]) {
      const label = `${INVISIBLES[ch]} (U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')})`;
      if (!out.includes(label)) out.push(label);
    }
  }
  return out;
}

/** រកអក្សរដែលមើលទៅដូច ASCII ប៉ុន្តែមិនមែន (homoglyph)។ */
export function findHomoglyphs(s: string): string[] {
  const out: string[] = [];
  for (const ch of s) {
    if (CONFUSABLES[ch]) {
      const label = `"${ch}" (U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}) → គួរជា "${CONFUSABLES[ch]}" ASCII`;
      if (!out.includes(label)) out.push(label);
    }
  }
  return out;
}

/** ប្តូរអក្សរដូចគ្នា (homoglyph) ទៅ ASCII — ប្រើសម្រាប់ប្រៀបធៀបដោយអត់ឱនប៉ុណ្ណោះ។ */
export function foldConfusables(s: string): string {
  return s.replace(CONFUSABLE_RE, (ch) => CONFUSABLES[ch] ?? ch);
}

/** Normalize ចម្លើយកូដ៖ អក្សរលាក់ · NFKC · homoglyph · ចន្លោះលើស។ */
export function normalizeCodeAnswer(s: string): string {
  return foldConfusables(stripInvisibles(s).normalize('NFKC')).replace(/\s+/g, ' ').trim();
}

/**
 * ដក comment និង string/char literal ចេញពីកូដ — សម្រាប់តេស្តមាតិកា
 * (ឧ. ផ្ទៀងផ្ទាត់ថា template កូដ C++ មិនមានអក្សរខ្មែរនៅក្រៅ comment)។
 * ជំនួសដោយចន្លោះ ដើម្បីរក្សាលំនាំ token។
 */
export function stripCodeComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/\/\/[^\n]*/g, '');
}

/** Normalize ចម្លើយជាអត្ថបទ (មិនមែនកូដ)៖ ដូចគ្នា ប៉ុន្តែមិន fold homoglyph។ */
export function normalizeTextAnswer(s: string): string {
  return stripInvisibles(s).normalize('NFC').replace(/\s+/g, ' ').trim();
}

/**
 * បត់ចន្លោះជុំវិញសញ្ញាប្រតិបត្តិការ ដើម្បីឲ្យ `i = i + 1` ≡ `i=i+1` ≡ `i += 1` (≡ `i+=1`)។
 * សុវត្ថិភាព៖ ប្រើតែចំពោះចម្លើយខ្លី (fill-in-the-blank) ដែលគ្មាន string literal វែង។
 */
export function foldOperatorSpacing(s: string): string {
  return s.replace(/\s*([+\-*/%=<>!&|^~?:,;])\s*/g, '$1');
}

/** ដកសញ្ញាសម្រង់ជុំវិញចម្លើយ (ឧ. អ្នកសិក្សាវាយ "\n" ជំនួស \n)។ */
export function stripWrappingQuotes(s: string): string {
  const m = /^(['"`])([\s\S]*)\1$/.exec(s);
  return m ? m[2] : s;
}

export interface GradeOptions {
  /** true = ចម្លើយជាអត្ថបទ/ភាសាខ្មែរ (អត់ឱន case + ទទួលយកពាក្យដែលមានចម្លើយនៅខាងក្នុង)។ */
  text?: boolean;
  /** អត់ឱនចំពោះ case — លំនាំដើម false ព្រោះ C++ case-sensitive។ */
  caseInsensitive?: boolean;
  /** អត់ឱនចំពោះចន្លោះជុំវិញសញ្ញាប្រតិបត្តិការ — លំនាំដើម true សម្រាប់កូដ។ */
  foldSpacing?: boolean;
  /** អត់ឱនចំពោះសញ្ញាសម្រង់ដែលអ្នកសិក្សាវាយបន្ថែម។ */
  stripQuotes?: boolean;
}

/** កំណត់ថាតើចម្លើយជាភាសាខ្មែរ/អត្ថបទ ឬជាកូដ ASCII។ */
export function isTextAnswer(accepted: string[]): boolean {
  return accepted.some((a) => !ASCII_RE.test(a));
}

/**
 * វិនិច្ឆ័យចម្លើយមួយចន្លោះ។ ត្រឡប់មកវិញនូវ **ហេតុផលជាក់លាក់** មិនមែន true/false សុទ្ធ។
 */
export function gradeBlank(rawAnswer: string, accepted: string[], options: GradeOptions = {}): BlankVerdict {
  const text = options.text ?? isTextAnswer(accepted);
  const foldSpacing = options.foldSpacing ?? !text;
  const stripQuotes = options.stripQuotes ?? !text;

  const invisibles = findInvisibles(rawAnswer);
  const homoglyphs = text ? [] : findHomoglyphs(rawAnswer);
  const problems: AnswerProblem[] = [];
  if (invisibles.length) problems.push({ kind: 'invisible', chars: invisibles });
  if (homoglyphs.length) problems.push({ kind: 'homoglyph', chars: homoglyphs });

  const base = text ? normalizeTextAnswer(rawAnswer) : normalizeCodeAnswer(rawAnswer);
  const candidate = stripQuotes ? stripWrappingQuotes(base) : base;

  // បង្កើតទម្រង់ប្រៀបធៀបទាំងអស់ (exact → fold-spacing → case-insensitive)
  const forms = (s: string): string[] => {
    const out = [s];
    if (foldSpacing) {
      const f = foldOperatorSpacing(s);
      if (f !== s) out.push(f);
    }
    return out;
  };

  const acceptedForms = accepted.flatMap((a) => forms(text ? normalizeTextAnswer(a) : normalizeCodeAnswer(a)));
  const myForms = forms(candidate);

  const exact = myForms.some((m) => acceptedForms.includes(m));

  // ខុសតែអក្សរតូច/ធំ — សម្រាប់ **កូដ** នេះជាកំហុសពិត (C++ case-sensitive)
  // ដូច្នេះមិនទទួលយកទេ ប៉ុន្តែត្រូវតែ **ប្រាប់អ្នកសិក្សាពីមូលហេតុជាក់លាក់**។
  // សម្រាប់ **អត្ថបទ/ពាក្យខ្មែរ-អង់គ្លេស** អត់ឱន (ដូច Runestone `:casei:`)។
  const caseOnly =
    !exact && myForms.some((m) => acceptedForms.some((a) => a.toLowerCase() === m.toLowerCase()));
  const caseOk = caseOnly && (options.caseInsensitive === true || (options.caseInsensitive === undefined && text));

  // ចម្លើយជាអត្ថបទ៖ ទទួលយកពាក្យខ្លីដែលសំដៅធាតុដូចគ្នា (ឧ. «រាយការណ៍» ⊂ «រាយការណ៍បញ្ហា»)។
  const contained =
    !exact &&
    text &&
    candidate.length >= 4 &&
    acceptedForms.some((a) => a.includes(candidate) || candidate.includes(a));

  const ok = exact || caseOk || contained;

  if (caseOnly) {
    const matched = accepted.find((a) =>
      myForms.some((m) => normalizeCodeAnswer(a).toLowerCase() === m.toLowerCase())
    );
    problems.push({ kind: 'case', expected: matched ?? accepted[0], got: candidate });
  }

  const noteParts: string[] = [];
  if (invisibles.length) noteParts.push(`មានអក្សរលាក់ដែលមើលមិនឃើញ៖ ${invisibles.join(', ')}`);
  if (homoglyphs.length) noteParts.push(`មានអក្សរដែលមើលទៅដូច ASCII ប៉ុន្តែមិនមែន៖ ${homoglyphs.join(', ')}`);
  if (caseOnly) noteParts.push(`C++ ជាភាសា case-sensitive — ត្រូវសរសេរ «${accepted[0]}» (អក្សរតូច/ធំសំខាន់ណាស់)`);
  if (contained) noteParts.push('ទទួលយកពាក្យខ្លីដែលសំដៅលើចម្លើយត្រឹមត្រូវ');

  // near-miss៖ គិតលើទម្រង់ normalize រួច (អក្សរលាក់/homoglyph មិនរំខាន)។
  // កំណត់ចំនួនអក្សរខុសអតិបរមា **តាមប្រវែងចម្លើយ** — កំហុសចាស់គឺ gate `length < 4`
  // ដែលធ្វើឲ្យចម្លើយខ្លី (% && // & \n) មិនទទួលបានមតិអ្វីសោះ។
  const tolerance = (len: number): number => (len <= 3 ? 1 : len <= 8 ? 2 : Math.ceil(len / 4));
  const close =
    !ok &&
    candidate.length > 0 &&
    acceptedForms.some((a) => {
      const best = Math.min(...myForms.map((m) => levenshtein(m.toLowerCase(), a.toLowerCase())));
      return best > 0 && best <= tolerance(a.length);
    });

  if (!ok && problems.length === 0 && !close) problems.push({ kind: 'wrong' });

  return {
    ok,
    autoFixed: ok && (invisibles.length > 0 || homoglyphs.length > 0),
    note_km: noteParts.join(' · '),
    problems,
    close,
    normalized: candidate,
  };
}

/**
 * ប្រៀបធៀបលទ្ធផលកម្មវិធី (predict_output)៖ អត់ឱនចន្លោះនៅចុងបន្ទាត់ និង CRLF
 * ប៉ុន្តែ **រក្សាបន្ទាត់ទទេ** ព្រោះបន្ទាត់ទទេជាផ្នែកនៃលទ្ធផលពិត។
 */
export function normalizeOutputForCompare(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n+$/g, '');
}

export function outputsMatch(actual: string, expected: string): boolean {
  return normalizeOutputForCompare(actual) === normalizeOutputForCompare(expected);
}

/** Levenshtein distance (ចម្លើយខ្លីប៉ុណ្ណោះ)។ */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/**
 * "Compare me" បែប Runestone — បង្ហាញភាពខុសគ្នាតួអក្សរម្តងមួយៗ
 * ដើម្បីឲ្យអ្នកសិក្សាឃើញកំហុសជាក់ស្តែង (រួមទាំងអក្សរលាក់)។
 */
export function describeMismatch(got: string, expected: string): string {
  const g = Array.from(got);
  const e = Array.from(expected);
  const diffs: string[] = [];
  const n = Math.max(g.length, e.length);
  for (let i = 0; i < n && diffs.length < 4; i++) {
    const gc = g[i];
    const ec = e[i];
    if (gc === ec) continue;
    const name = (c: string | undefined): string => {
      if (c === undefined) return '(ខ្វះ)';
      const cp = c.codePointAt(0)!;
      if (INVISIBLES[c]) return `${INVISIBLES[c]} លាក់!`;
      if (CONFUSABLES[c]) return `"${c}" ដូច "${CONFUSABLES[c]}" ប៉ុន្តែជា U+${cp.toString(16).toUpperCase().padStart(4, "0")}!`;
      if (cp < 0x20) return `control U+${cp.toString(16).toUpperCase()}`;
      return `"${c}"`;
    };
    diffs.push(`ទីតាំង ${i + 1}: អ្នកវាយ ${name(gc)} — ត្រឹមត្រូវ ${name(ec)}`);
  }
  if (g.length !== e.length && diffs.length < 4) {
    diffs.push(`ប្រវែងខុសគ្នា៖ អ្នកវាយ ${g.length} តួ — ត្រឹមត្រូវ ${e.length} តួ`);
  }
  return diffs.join(' · ');
}
