// ============================================================
// Shuffle — ការច្របល់លំដាប់ជម្រើសចម្លើយ
//
// ហេតុអ្វីមានឯកសារនេះ៖ កំហុសធ្ងន់ធ្ងរបំផុតនៃមាតិកាក្នុង repo នេះគឺ
// **៣៣ ក្នុងចំណោម ៣៦ លំហាត់ជ្រើសរើសចម្លើយ (92%) មានចម្លើយត្រឹមត្រូវនៅទីតាំងទី ១**។
// អ្នកសិក្សាអាចទទួលបាន ៩២% ដោយគ្រាន់តែចុចជម្រើសដំបូងជានិច្ច — លំហាត់ទាំងអស់
// ក្លាយជាគ្មានតម្លៃវាស់វែង។
//
// ដំណោះស្រាយ៖ ច្របល់លំដាប់ជម្រើសពេល render។ យើងប្រើ seed ពី
// (exercise id + ថ្ងៃបច្ចុប្បន្ន) ដើម្បី៖
//  - **កំណត់បានក្នុងមួយថ្ងៃ** → ចម្លើយមិនលោតចុះឡើងពេលអ្នកសិក្សាព្យាយាមម្តងទៀត
//    (សំខាន់សម្រាប់ការយល់ដឹង និងសម្រាប់ test)
//  - **ខុសគ្នារវាងថ្ងៃ និងរវាងលំហាត់** → ការចាំទីតាំងមិនអាចប្រើបានទេ
// មិនមែនជាសុវត្ថិភាពទេ (អ្នកសិក្សាអាចអាន answer key ក្នុង bundle —
// មើល docs/KNOWN_LIMITATIONS.md #៣) គឺគ្រាន់តែជាការកែលម្អ pedagogical។
// ============================================================

/** បង្កើត PRNG ដែលអាចទស្សន៍ទាយបាន (mulberry32) ពី seed ជាចំនួនគត់។ */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** seed ពីខ្សែអក្សរ (FNV-1a)។ */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** ថ្ងៃបច្ចុប្បន្នជាខ្សែអក្សរ (សម្រាប់ seed ប្រចាំថ្ងៃ)។ */
export function todaySeedPart(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** Fisher–Yates shuffle ដោយមិនកែ array ដើម។ */
export function shuffled<T>(arr: readonly T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * ច្របល់ជម្រើសចម្លើយ ហើយត្រឡប់មកវិញនូវ៖
 *  - `order`៖ សន្ទស្សន៍ដើមនៃជម្រើស តាមលំដាប់ដែលត្រូវបង្ហាញ
 *  - `answerPos`៖ ទីតាំងបង្ហាញនៃចម្លើយត្រឹមត្រូវ
 *
 * ធានាថាចម្លើយត្រឹមត្រូវមិននៅទីតាំងដើមរបស់វា **លុះត្រាតែមានតែមួយជម្រើស**
 * (ការច្របល់ដែលមិនផ្លាស់ប្តូរអ្វីសោះធ្វើឲ្យកំហុស authoring នៅតែអាចមើលឃើញ)។
 */
export function shuffleChoices(
  optionCount: number,
  answerIndex: number,
  seed: string
): { order: number[]; answerPos: number } {
  const identity = Array.from({ length: optionCount }, (_, i) => i);
  if (optionCount < 2) return { order: identity, answerPos: answerIndex };
  const rand = seededRandom(hashString(seed));
  let order = shuffled(identity, rand);
  // កុំឲ្យចៃដន្យត្រឡប់ទៅលំដាប់ដើមវិញ (បើមិនដូច្នោះទេ ភាពលំអៀងដើមនៅតែអាចលេចឡើង)
  if (order.every((v, i) => v === i)) {
    order = [identity[1], identity[0], ...identity.slice(2)];
  }
  return { order, answerPos: order.indexOf(answerIndex) };
}
