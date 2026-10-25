import type { Level, Lesson } from '../../types';

// ============================================================
// កម្រិត ៣–១២ — គ្រោងផែនការ (Planned levels)
// មេរៀនទាំងនេះមានតែ metadata ជាគម្រោង — status: 'planned'
// មិនមានមាតិកា ហើយ UI បង្ហាញជា "កំពុងរៀបចំ" មិនអនុញ្ញាតឲ្យចូល។
// ============================================================

interface PlannedLessonSpec {
  id: string;
  unit: number;
  title_km: string;
  title_en: string;
  minutes: number;
}

interface PlannedLevelSpec {
  id: number;
  title_km: string;
  title_en: string;
  objective_km: string;
  prerequisites_km: string;
  outcomes_km: string[];
  estimated_hours: number;
  lessons: PlannedLessonSpec[];
}

const plannedSpecs: PlannedLevelSpec[] = [
  {
    id: 4,
    title_km: 'រង្វិលជុំ (Loops)',
    title_en: 'Loops',
    objective_km: 'ប្រើ for, while, do-while និងគ្រប់គ្រងរង្វិលជុំដោយ break/continue',
    prerequisites_km: 'បញ្ចប់កម្រិត ៣',
    outcomes_km: ['ប្រើ for / while / do-while', 'ប្រើ break និង continue', 'trace ការដំណើរការរង្វិលជុំ', 'សរសេរ nested loops'],
    estimated_hours: 6,
    lessons: [
      { id: 'l4-for', unit: 1, title_km: 'រង្វិល for', title_en: 'for loop', minutes: 18 },
      { id: 'l4-while', unit: 1, title_km: 'រង្វិល while', title_en: 'while loop', minutes: 15 },
      { id: 'l4-do-while', unit: 1, title_km: 'do-while', title_en: 'do-while loop', minutes: 12 },
      { id: 'l4-break-continue', unit: 2, title_km: 'break និង continue', title_en: 'break and continue', minutes: 15 },
      { id: 'l4-nested-loops', unit: 2, title_km: 'រង្វិលជុំបង្កប់', title_en: 'Nested loops', minutes: 18 },
      { id: 'l4-loop-tracing', unit: 2, title_km: 'ការតាមដាន (trace) រង្វិលជុំ', title_en: 'Tracing loops', minutes: 15 },
    ],
  },
  {
    id: 5,
    title_km: 'មុខងារ (Functions)',
    title_en: 'Functions',
    objective_km: 'សរសេរ និងប្រើមុខងារ រួមទាំង pass by reference និង recursion មូលដ្ឋាន',
    prerequisites_km: 'បញ្ចប់កម្រិត ៤',
    outcomes_km: ['បង្កើតមុខងារដែលមាន parameters និង return', 'យល់ពី scope', 'ខុសគ្នារវាង pass by value និង reference', 'ប្រើ overloading និង recursion មូលដ្ឋាន'],
    estimated_hours: 7,
    lessons: [
      { id: 'l5-functions-intro', unit: 1, title_km: 'ការបង្កើតមុខងារ', title_en: 'Function basics', minutes: 18 },
      { id: 'l5-params-return', unit: 1, title_km: 'Parameters និង return values', title_en: 'Parameters and returns', minutes: 18 },
      { id: 'l5-scope', unit: 1, title_km: 'វិសាលភាព (scope)', title_en: 'Scope', minutes: 15 },
      { id: 'l5-pass-by-ref', unit: 2, title_km: 'Pass by value និង reference', title_en: 'Passing by reference', minutes: 20 },
      { id: 'l5-overloading', unit: 2, title_km: 'Function overloading', title_en: 'Overloading', minutes: 15 },
      { id: 'l5-recursion', unit: 2, title_km: 'Recursion មូលដ្ឋាន', title_en: 'Basic recursion', minutes: 20 },
    ],
  },
  {
    id: 6,
    title_km: 'Collections និង Strings',
    title_en: 'Collections and Strings',
    objective_km: 'ប្រើ arrays, std::vector, std::string និង algorithm មូលដ្ឋាន',
    prerequisites_km: 'បញ្ចប់កម្រិត ៥',
    outcomes_km: ['ប្រើ array និង std::vector', 'ដំណើរការ std::string', 'ស្វែងរក និងតម្រៀបទិន្នន័យ', 'យល់ពី complexity មូលដ្ឋាន'],
    estimated_hours: 8,
    lessons: [
      { id: 'l6-arrays', unit: 1, title_km: 'Arrays', title_en: 'Arrays', minutes: 18 },
      { id: 'l6-std-array', unit: 1, title_km: 'std::array', title_en: 'std::array', minutes: 12 },
      { id: 'l6-vector', unit: 1, title_km: 'std::vector', title_en: 'std::vector', minutes: 20 },
      { id: 'l6-string', unit: 2, title_km: 'std::string លម្អិត', title_en: 'Working with strings', minutes: 20 },
      { id: 'l6-iteration', unit: 2, title_km: 'ការដំណើរការលើ collections', title_en: 'Iteration', minutes: 15 },
      { id: 'l6-search-sort', unit: 2, title_km: 'ស្វែងរក និងតម្រៀប', title_en: 'Searching and sorting', minutes: 20 },
    ],
  },
  {
    id: 7,
    title_km: 'Pointers និង Memory',
    title_en: 'Pointers and Memory',
    objective_km: 'យល់ពី addresses, pointers, references, RAII និង smart pointers',
    prerequisites_km: 'បញ្ចប់កម្រិត ៦',
    outcomes_km: ['អាន និងប្រើ pointers', 'យល់ពី stack និង heap', 'ប្រើ RAII និង smart pointers', 'ជៀសវាងកំហុស memory ទូទៅ'],
    estimated_hours: 8,
    lessons: [
      { id: 'l7-addresses', unit: 1, title_km: 'Addresses និង &', title_en: 'Memory addresses', minutes: 15 },
      { id: 'l7-pointers', unit: 1, title_km: 'Pointers', title_en: 'Pointers', minutes: 22 },
      { id: 'l7-references', unit: 1, title_km: 'References', title_en: 'References', minutes: 15 },
      { id: 'l7-nullptr', unit: 2, title_km: 'nullptr', title_en: 'nullptr', minutes: 12 },
      { id: 'l7-stack-heap', unit: 2, title_km: 'Stack និង Heap', title_en: 'Stack vs heap', minutes: 18 },
      { id: 'l7-raii-smart', unit: 2, title_km: 'RAII និង smart pointers', title_en: 'RAII and smart pointers', minutes: 25 },
    ],
  },
  {
    id: 8,
    title_km: 'Object-Oriented Programming',
    title_en: 'Object-Oriented Programming',
    objective_km: 'បង្កើត classes ប្រើ encapsulation, inheritance និង polymorphism',
    prerequisites_km: 'បញ្ចប់កម្រិត ៧',
    outcomes_km: ['បង្កើត classes និង objects', 'ប្រើ constructors/destructors', 'យល់ពី inheritance និង polymorphism', 'ដឹងពេលគួរ (មិនគួរ) ប្រើ OOP'],
    estimated_hours: 10,
    lessons: [
      { id: 'l8-classes', unit: 1, title_km: 'Classes និង objects', title_en: 'Classes and objects', minutes: 22 },
      { id: 'l8-constructors', unit: 1, title_km: 'Constructors និង destructors', title_en: 'Constructors', minutes: 20 },
      { id: 'l8-encapsulation', unit: 1, title_km: 'Encapsulation', title_en: 'Encapsulation', minutes: 18 },
      { id: 'l8-inheritance', unit: 2, title_km: 'Inheritance', title_en: 'Inheritance', minutes: 22 },
      { id: 'l8-polymorphism', unit: 2, title_km: 'Polymorphism', title_en: 'Polymorphism', minutes: 25 },
      { id: 'l8-composition', unit: 2, title_km: 'Composition និង abstraction', title_en: 'Composition', minutes: 20 },
    ],
  },
  {
    id: 9,
    title_km: 'Modern C++',
    title_en: 'Modern C++',
    objective_km: 'ប្រើលក្ខណៈ C++ ទំនើប៖ auto, range-based loops, templates, exceptions, move semantics',
    prerequisites_km: 'បញ្ចប់កម្រិត ៨',
    outcomes_km: ['ប្រើ const correctness និង auto', 'ប្រើ range-based for និង enums', 'សរសេរ templates មូលដ្ឋាន', 'ដោះស្រាយ exceptions'],
    estimated_hours: 9,
    lessons: [
      { id: 'l9-const-auto', unit: 1, title_km: 'const និង auto', title_en: 'const and auto', minutes: 18 },
      { id: 'l9-range-for', unit: 1, title_km: 'Range-based loops និង enums', title_en: 'Range-for and enums', minutes: 18 },
      { id: 'l9-templates', unit: 1, title_km: 'Templates មូលដ្ឋាន', title_en: 'Templates', minutes: 25 },
      { id: 'l9-exceptions', unit: 2, title_km: 'Exceptions', title_en: 'Exceptions', minutes: 20 },
      { id: 'l9-stl-algos', unit: 2, title_km: 'STL algorithms', title_en: 'STL algorithms', minutes: 22 },
      { id: 'l9-move', unit: 2, title_km: 'Move semantics (ណែនាំ)', title_en: 'Move semantics intro', minutes: 20 },
    ],
  },
  {
    id: 10,
    title_km: 'រចនាសម្ព័ន្ធទិន្នន័យ និង Algorithms',
    title_en: 'Data Structures and Algorithms',
    objective_km: 'ប្រើ stacks, queues, maps, sets និងវិភាគ complexity',
    prerequisites_km: 'បញ្ចប់កម្រិត ៩',
    outcomes_km: ['ប្រើ std::stack, std::queue, std::map, std::set', 'វិភាគ Big-O មូលដ្ឋាន', 'ដោះស្រាយបញ្ហាដោយ recursion និង pattern ទូទៅ'],
    estimated_hours: 12,
    lessons: [
      { id: 'l10-stacks-queues', unit: 1, title_km: 'Stacks និង Queues', title_en: 'Stacks and queues', minutes: 22 },
      { id: 'l10-maps-sets', unit: 1, title_km: 'Maps និង Sets', title_en: 'Maps and sets', minutes: 22 },
      { id: 'l10-recursion', unit: 2, title_km: 'Recursion កម្រិតមធ្យម', title_en: 'Recursion', minutes: 25 },
      { id: 'l10-sorting', unit: 2, title_km: 'ការតម្រៀប និងស្វែងរក', title_en: 'Sorting and searching', minutes: 25 },
      { id: 'l10-complexity', unit: 2, title_km: 'ការវិភាគ complexity (Big-O)', title_en: 'Complexity analysis', minutes: 22 },
    ],
  },
  {
    id: 11,
    title_km: 'C++ វិជ្ជាជីវៈ',
    title_en: 'Professional C++',
    objective_km: 'រៀបចំគម្រោងពិតប្រាកដ៖ headers, CMake, tests, debugging, sanitizers',
    prerequisites_km: 'បញ្ចប់កម្រិត ១០',
    outcomes_km: ['បំបែក header/source', 'ប្រើ CMake មូលដ្ឋាន', 'សរសេរ unit tests', 'debug និងប្រើ sanitizers'],
    estimated_hours: 12,
    lessons: [
      { id: 'l11-headers', unit: 1, title_km: 'ការបំបែក header និង source', title_en: 'Header/source separation', minutes: 25 },
      { id: 'l11-namespaces', unit: 1, title_km: 'Namespaces', title_en: 'Namespaces', minutes: 18 },
      { id: 'l11-cmake', unit: 1, title_km: 'CMake មូលដ្ឋាន', title_en: 'CMake fundamentals', minutes: 25 },
      { id: 'l11-warnings-debug', unit: 2, title_km: 'Warnings និង debugging', title_en: 'Warnings and debugging', minutes: 22 },
      { id: 'l11-testing', unit: 2, title_km: 'Unit testing និង sanitizers', title_en: 'Testing and sanitizers', minutes: 25 },
      { id: 'l11-git-review', unit: 2, title_km: 'Git និង code review', title_en: 'Git and code review', minutes: 20 },
    ],
  },
  {
    id: 12,
    title_km: 'គម្រោង និងការវាយតម្លៃចុងក្រោយ',
    title_en: 'Projects and Final Assessment',
    objective_km: 'អនុវត្តចំណេះដឹងទាំងអស់តាមរយៈគម្រោងពិតប្រាកដ',
    prerequisites_km: 'បញ្ចប់កម្រិត ១១',
    outcomes_km: ['សាងសង់កម្មវិធីពេញលេញដោយខ្លួនឯង', 'រៀបចំកូដជាគម្រោងពិតប្រាកដ', 'បញ្ចប់ capstone project'],
    estimated_hours: 20,
    lessons: [
      { id: 'l12-calculator', unit: 1, title_km: 'គម្រោង៖ ម៉ាស៊ីនគិតលេខខ្មែរ', title_en: 'Project: Calculator', minutes: 60 },
      { id: 'l12-score-manager', unit: 1, title_km: 'គម្រោង៖ កម្មវិធីគ្រប់គ្រងពិន្ទុសិស្ស', title_en: 'Project: Score manager', minutes: 75 },
      { id: 'l12-quiz-app', unit: 2, title_km: 'គម្រោង៖ កម្មវិធីសំណួរ', title_en: 'Project: Quiz app', minutes: 60 },
      { id: 'l12-inventory', unit: 2, title_km: 'គម្រោង៖ កម្មវិធីគ្រប់គ្រងទំនិញ', title_en: 'Project: Inventory manager', minutes: 75 },
      { id: 'l12-capstone', unit: 3, title_km: 'Capstone project', title_en: 'Capstone project', minutes: 180 },
    ],
  },
];

function makePlannedLesson(spec: PlannedLessonSpec, levelId: number, nextId?: string): Lesson {
  return {
    id: spec.id,
    level_id: levelId,
    unit_id: spec.unit,
    title_km: spec.title_km,
    title_en: spec.title_en,
    status: 'planned',
    version: '0.0.0',
    estimated_minutes: spec.minutes,
    prerequisites: [],
    objectives_km: [],
    explanation_km: '',
    examples: [],
    exercises: [],
    summary_km: '',
    next: nextId,
  };
}

export const plannedLessons: Lesson[] = [];
export const plannedLevels: Level[] = plannedSpecs.map((spec) => {
  const units: Level['units'] = [];
  spec.lessons.forEach((ls, i) => {
    const nextId = spec.lessons[i + 1]?.id;
    plannedLessons.push(makePlannedLesson(ls, spec.id, nextId));
    let unit = units.find((u) => u.id === `${spec.id}-${ls.unit}`);
    if (!unit) {
      unit = { id: `${spec.id}-${ls.unit}`, title_km: `ខ្នាតទី ${ls.unit}`, lessonIds: [] };
      units.push(unit);
    }
    unit.lessonIds.push(ls.id);
  });
  return {
    id: spec.id,
    title_km: spec.title_km,
    title_en: spec.title_en,
    status: 'planned',
    objective_km: spec.objective_km,
    prerequisites_km: spec.prerequisites_km,
    outcomes_km: spec.outcomes_km,
    estimated_hours: spec.estimated_hours,
    units,
  };
});
