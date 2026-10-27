// ============================================================
// គ្រោងការណ៍ទិន្នន័យ (Data schemas) — Khmer C++ Academy
// ============================================================

export type LessonStatus = 'published' | 'draft' | 'planned';

/** ប្រភេទលំហាត់ (Exercise types) */
export type ExerciseType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'predict_output'
  | 'arrange'
  | 'find_error'
  | 'match'
  | 'code_challenge';

export interface ExerciseBase {
  id: string;
  type: ExerciseType;
  /** សំណួរជាភាសាខ្មែរ */
  prompt_km: string;
  /** ជំនួយបង្ហាញជាបណ្តើរៗ (progressive hints) */
  hints_km: string[];
  /** ការពន្យល់ក្រោយឆ្លើយ */
  explanation_km: string;
  /** បើ false លំហាត់នេះមិនចាំបាច់ដើម្បីបញ្ចប់មេរៀន */
  required?: boolean;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: 'multiple_choice';
  options_km: string[];
  answerIndex: number;
}

export interface FillBlankExercise extends ExerciseBase {
  type: 'fill_blank';
  /** កូដ ឬអត្ថបទដែលមាន {{0}} {{1}} សម្គាល់កន្លែងទំនេរ */
  template: string;
  /**
   * ចម្លើយដែលទទួលយក សម្រាប់ចន្លោះនីមួយៗ។
   * សូមដាក់ **គ្រប់ទម្រង់ដែលត្រឹមត្រូវដូចគ្នា** (ឧ. `i+=1`, `i = i + 1`, `++i`) —
   * ចម្លើយត្រឹមត្រូវដែលត្រូវបានបដិសេធគឺជាកំហុសធ្ងន់ធ្ងរបំផុតនៃលំហាត់បំពេញចន្លោះ។
   */
  acceptedAnswers: string[][];
  /**
   * true = ចន្លោះនេះជា **អត្ថបទ/ពាក្យខ្មែរ** (មិនមែនកូដ)។
   * ការវិនិច្ឆ័យនឹងអត់ឱនចំពោះ case និងទទួលយកពាក្យខ្លីដែលសំដៅចម្លើយដូចគ្នា។
   * លំនាំដើម៖ ស្វ័យប្រវត្តិ (true បើចម្លើយមានអក្សរមិនមែន ASCII)។
   */
  prose?: boolean;
}

export interface PredictOutputExercise extends ExerciseBase {
  type: 'predict_output';
  code: string;
  /** ចម្លើយត្រឹមត្រូវ (ប្រៀបធៀបដោយ normalize whitespace) */
  expectedOutput: string;
}

export interface ArrangeExercise extends ExerciseBase {
  type: 'arrange';
  /** បន្ទាត់កូដត្រឹមត្រូវ (លំដាប់ត្រូវ) */
  lines: string[];
  /** លំដាប់ចៃដន្យសម្រាប់បង្ហាញ — indices ទៅកាន់ lines */
  shuffledOrder: number[];
}

export interface FindErrorExercise extends ExerciseBase {
  type: 'find_error';
  code: string;
  /** លេខបន្ទាត់ដែលមានកំហុស (1-based) */
  errorLine: number;
  /** បន្ទាត់ដែលកែត្រូវ */
  fixedLine: string;
}

export interface MatchExercise extends ExerciseBase {
  type: 'match';
  pairs: { left_km: string; right: string }[];
}

export interface CodeChallengeExercise extends ExerciseBase {
  type: 'code_challenge';
  starterCode: string;
  solutionCode: string;
  /** ករណីសាកល្បង — ដំណើរការតាម execution provider (Wandbox) បើមានការយល់ព្រម */
  testCases: { stdin: string; expectedOutput: string }[];
}

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | PredictOutputExercise
  | ArrangeExercise
  | FindErrorExercise
  | MatchExercise
  | CodeChallengeExercise;

export interface CodeExample {
  title_km: string;
  code: string;
  /** លទ្ធផលរំពឹងទុក — ត្រូវបានផ្ទៀងផ្ទាត់ដោយ g++ ក្នុង CI */
  expectedOutput?: string;
  /** stdin សម្រាប់ឧទាហរណ៍ដែលប្រើ std::cin */
  stdin?: string;
  note_km?: string;
}

export interface CommonMistake {
  wrongCode: string;
  rightCode: string;
  note_km: string;
}

// ============================================================
// ដ្យាក្រាម (Diagrams) — original inline-SVG learning visuals
// ============================================================

export interface PipelineDiagram {
  type: 'pipeline';
  title_km: string;
  steps: { label_km: string; sub?: string }[];
  note_km?: string;
}

export interface BoxesDiagram {
  type: 'boxes';
  title_km: string;
  boxes: { name: string; value: string; kind?: string; constant?: boolean }[];
  note_km?: string;
}

export interface IoFlowDiagram {
  type: 'ioflow';
  title_km: string;
  input?: string;
  variable?: string;
  output: string;
  note_km?: string;
}

export interface TableDiagram {
  type: 'table';
  title_km: string;
  columns: string[];
  rows: string[][];
  note_km?: string;
}

export type DiagramSpec = PipelineDiagram | BoxesDiagram | IoFlowDiagram | TableDiagram;

export interface Lesson {
  id: string;
  level_id: number;
  unit_id: number;
  title_km: string;
  title_en: string;
  status: LessonStatus;
  version: string;
  estimated_minutes: number;
  prerequisites: string[]; // lesson ids
  objectives_km: string[];
  /** ការពន្យល់ — mini-markdown ( paragraphs, `code`, ```cpp fences, - bullets, ## ) */
  explanation_km: string;
  examples: CodeExample[];
  commonMistake?: CommonMistake;
  /** ដ្យាក្រាម SVG (រូបភាពសិក្សា) បង្ហាញក្រោយការពន្យល់ */
  diagrams?: DiagramSpec[];
  exercises: Exercise[];
  summary_km: string;
  next?: string; // lesson id
}

export interface Unit {
  id: string;
  title_km: string;
  lessonIds: string[];
}

export interface Level {
  id: number;
  title_km: string;
  title_en: string;
  status: LessonStatus; // published = យ៉ាងហោចណាស់មានមេរៀន published មួយ
  objective_km: string;
  prerequisites_km: string;
  outcomes_km: string[];
  estimated_hours: number;
  units: Unit[];
}

// ============================================================
// ស្ថានភាពអ្នកសិក្សា (Learner state — persisted locally)
// ============================================================

export interface LessonRecord {
  completedAt: string; // ISO date
  score: number; // 0..1
  attempts: number;
  hintsUsed: number;
}

export interface ReviewItem {
  lessonId: string;
  exerciseId: string;
  wrongCount: number;
  lastWrongAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  savedAt: string;
}

export interface ActivityEntry {
  at: string; // ISO
  kind: 'lesson_completed' | 'quiz_taken' | 'snippet_saved' | 'level_selected' | 'achievement';
  lessonId?: string;
  detail_km?: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  sound: boolean;
  reducedMotion: boolean;
  /** ការយល់ព្រមផ្ញើកូដទៅ Wandbox API សម្រាប់ដំណើរការកូដ */
  executionConsent: boolean | null; // null = មិនទាន់សួរ
}

export interface ProgressState {
  schemaVersion: number;
  currentLevel: number | null;
  completedLessons: Record<string, LessonRecord>;
  xp: number;
  streak: { lastActiveDate: string | null; count: number };
  reviewQueue: ReviewItem[];
  snippets: Snippet[];
  activity: ActivityEntry[];
  achievements: string[]; // achievement ids
  settings: Settings;
  placementResult?: { levelId: number; takenAt: string };
}

export interface Achievement {
  id: string;
  title_km: string;
  description_km: string;
  icon: string; // icon key
}
