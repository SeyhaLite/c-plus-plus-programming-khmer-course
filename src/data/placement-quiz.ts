import type { MultipleChoiceExercise } from '../types';

// ============================================================
// ពិនិត្យចំណេះដឹង (Placement test) — សំណួរកាត់កម្រិត
// ចំណាំ៖ ចម្លើយស្ថិតក្នុង client bundle — វាជាឧបករណ៍ណែនាំកម្រិត
// មិនមែនការប្រឡងសន្តិសុខទេ (មើល docs/KNOWN_LIMITATIONS.md)។
// ============================================================

export interface PlacementQuestion extends MultipleChoiceExercise {
  /** បើឆ្លើយត្រូវ សន្មតថាមានចំណេះដឹងដល់កម្រិតនេះ */
  upToLevel: number;
}

export const placementQuestions: PlacementQuestion[] = [
  {
    id: 'pq-1', type: 'multiple_choice', upToLevel: 1,
    prompt_km: 'តើបន្ទាត់ណាបញ្ចេញអក្សរទៅអេក្រង់បានត្រឹមត្រូវ?',
    options_km: ['std::cout << "Hello" << std::endl;', 'std::cin << "Hello";', 'print("Hello");', 'console.log("Hello");'],
    answerIndex: 0, hints_km: [], explanation_km: 'std::cout << ... << std::endl; ជាវិធីស្តង់ដារក្នុង C++។',
  },
  {
    id: 'pq-2', type: 'multiple_choice', upToLevel: 1,
    prompt_km: 'តើអ្វីបញ្ចប់ statement នីមួយៗក្នុង C++?',
    options_km: ['សញ្ញា ;', 'សញ្ញា :', 'ពាក្យ end', 'សញ្ញា .'],
    answerIndex: 0, hints_km: [], explanation_km: 'រាល់ statement ត្រូវបញ្ចប់ដោយសញ្ញា ;។',
  },
  {
    id: 'pq-3', type: 'multiple_choice', upToLevel: 2,
    prompt_km: 'តើ 7 / 2 មានតម្លៃប៉ុន្មាន បើទាំងពីរជា int?',
    options_km: ['3', '3.5', '4', '2'],
    answerIndex: 0, hints_km: [], explanation_km: 'int / int កាត់ទសភាគចោល → 3។',
  },
  {
    id: 'pq-4', type: 'multiple_choice', upToLevel: 2,
    prompt_km: 'តើប្រភេទណាសម្រាប់ទុកតម្លៃពិត/មិនពិត?',
    options_km: ['bool', 'int', 'char', 'double'],
    answerIndex: 0, hints_km: [], explanation_km: 'bool មានតម្លៃ true ឬ false។',
  },
  {
    id: 'pq-5', type: 'multiple_choice', upToLevel: 3,
    prompt_km: 'តើ x % 2 == 0 ពិនិត្យអ្វី?',
    options_km: ['x ជាលេខគូ', 'x ជាលេខសេស', 'x ស្មើ 2', 'x ជាចំនួនអវិជ្ជមាន'],
    answerIndex: 0, hints_km: [], explanation_km: '% ជាសំណល់; សំណល់ 0 ពេលចែក 2 មានន័យថាលេខគូ។',
  },
  {
    id: 'pq-6', type: 'multiple_choice', upToLevel: 4,
    prompt_km: 'តើរង្វិល for (int i = 0; i < 3; ++i) ដំណើរការប៉ុន្មានដង?',
    options_km: ['3 ដង (i = 0, 1, 2)', '4 ដង', '2 ដង', 'មិនអាចដឹងទេ'],
    answerIndex: 0, hints_km: [], explanation_km: 'i ចាប់ពី 0 ដល់ 2 → 3 ដង។',
  },
  {
    id: 'pq-7', type: 'multiple_choice', upToLevel: 5,
    prompt_km: 'តើ pass by reference មានន័យដូចម្តេច?',
    options_km: ['មុខងារអាចប្តូរតម្លៃអថេរដើមបាន (ប្រើ &)', 'មុខងារទទួលបានច្បាប់ចម្លងនៃអថេរ', 'អថេរត្រូវបានលុបចោល', 'ត្រូវប្រើ pointer ជានិច្ច'],
    answerIndex: 0, hints_km: [], explanation_km: 'void f(int& x) អនុញ្ញាតឲ្យប្តូរ x ដើម។',
  },
  {
    id: 'pq-8', type: 'multiple_choice', upToLevel: 6,
    prompt_km: 'តើ std::vector ខុសពី array ធម្មតាយ៉ាងដូចម្តេច?',
    options_km: ['vector អាចប្តូរទំហំបានតាមតម្រូវការ', 'array លឿនជាងជានិច្ច', 'vector មិនអាចផ្ទុក int ទេ', 'មិនមានភាពខុសគ្នាទេ'],
    answerIndex: 0, hints_km: [], explanation_km: 'std::vector ជា dynamic array — ទំហំអាចលូតលាស់បាន។',
  },
];

export function scoreToLevel(correctUpToLevels: number[]): number {
  if (correctUpToLevels.length === 0) return 0;
  // កម្រិតណែនាំ = កម្រិតខ្ពស់បំផុតដែលឆ្លើយត្រូវជាប់គ្នាពីដើម
  const sorted = [...new Set(correctUpToLevels)].sort((a, b) => a - b);
  let level = 0;
  for (const l of sorted) {
    if (l <= level + 2) level = l; // tolerate small gaps
    else break;
  }
  return Math.min(level, 6); // published content currently ends at level 2; cap recommendation at available+planned boundary
}
