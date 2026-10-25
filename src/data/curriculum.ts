import type { Level, Lesson } from '../types';
import { level00Lessons } from '../curriculum/levels/level-00/lessons';
import { level01Lessons } from '../curriculum/levels/level-01/lessons';
import { level02Lessons } from '../curriculum/levels/level-02/lessons';
import { level03Lessons } from '../curriculum/levels/level-03/lessons';
import { level04Lessons } from '../curriculum/levels/level-04/lessons';
import { plannedLevels, plannedLessons } from '../curriculum/levels/planned-levels';

// ============================================================
// Curriculum index — ប្រភពតែមួយសម្រាប់ទិន្នន័យកម្រិត និងមេរៀន
// ============================================================

export const APP_NAME = 'Khmer C++ Academy';
export const APP_VERSION = '1.0.0';
export const CPP_STANDARD = 'C++17';

export const allLessons: Lesson[] = [...level00Lessons, ...level01Lessons, ...level02Lessons, ...level03Lessons, ...level04Lessons, ...plannedLessons];

const lessonMap = new Map<string, Lesson>(allLessons.map((l) => [l.id, l]));

export const publishedLevels: Level[] = [
  {
    id: 0,
    title_km: 'ការត្រៀមខ្លួន',
    title_en: 'Getting Ready',
    status: 'published',
    objective_km: 'យល់ពីមូលដ្ឋាននៃការសរសេរកម្មវិធី និងរបៀបប្រើគេហទំព័រនេះ',
    prerequisites_km: 'គ្មាន — សម្រាប់អ្នកចាប់ផ្តើមដំបូង',
    outcomes_km: ['ដឹងថា C++ ជាអ្វី និងគេប្រើនៅឯណា', 'យល់ពីតួនាទី compiler', 'ចេះប្រើគេហទំព័រដើម្បីរៀន'],
    estimated_hours: 1,
    units: [
      { id: '0-1', title_km: 'ខ្នាតទី ១ — ស្គាល់ C++', lessonIds: level00Lessons.map((l) => l.id) },
    ],
  },
  {
    id: 1,
    title_km: 'មូលដ្ឋាន C++',
    title_en: 'C++ Basics',
    status: 'published',
    objective_km: 'សរសេរ និងដំណើរការកម្មវិធី C++ សាមញ្ញ ដោយប្រើ cout និង cin',
    prerequisites_km: 'បញ្ចប់កម្រិត ០ ឬមានចំណេះដឹងមូលដ្ឋានអំពីកុំព្យូទ័រ',
    outcomes_km: ['សរសេរកម្មវិធីដំបូងបាន', 'យល់ពី main() និង statements', 'បញ្ចេញ និងទទួលទិន្នន័យដោយ cout/cin'],
    estimated_hours: 3,
    units: [
      { id: '1-1', title_km: 'ខ្នាតទី ១ — កម្មវិធីដំបូង', lessonIds: level01Lessons.map((l) => l.id) },
    ],
  },
  {
    id: 2,
    title_km: 'អថេរ និងទិន្នន័យ',
    title_en: 'Variables and Data',
    status: 'published',
    objective_km: 'ផ្ទុក គណនា និងបំលែងទិន្នន័យដោយប្រើអថេរ និងប្រភេទទិន្នន័យមូលដ្ឋាន',
    prerequisites_km: 'បញ្ចប់កម្រិត ១',
    outcomes_km: ['បង្កើត និងប្រើអថេរ/ថេរ', 'ជ្រើសរើសប្រភេទទិន្នន័យត្រឹមត្រូវ', 'ប្រើ arithmetic, comparison និង assignment operators', 'បំលែងប្រភេទទិន្នន័យដោយ static_cast'],
    estimated_hours: 4,
    units: [
      { id: '2-1', title_km: 'ខ្នាតទី ១ — ទិន្នន័យ និងការគណនា', lessonIds: level02Lessons.map((l) => l.id) },
    ],
  },
  {
    id: 3,
    title_km: 'លក្ខខណ្ឌ និងតក្កវិជ្ជា',
    title_en: 'Conditionals and Logic',
    status: 'published',
    objective_km: 'ប្រើ if/else, else if, switch និង logical operators ដើម្បីសម្រេចចិត្តក្នុងកម្មវិធី',
    prerequisites_km: 'បញ្ចប់កម្រិត ២ (អថេរ និង operators)',
    outcomes_km: ['ប្រើ if / else if / else', 'ប្រើ switch', 'ប្រើ && || !', 'ជៀសវាងកំហុស logic ទូទៅ'],
    estimated_hours: 5,
    units: [
      { id: '3-1', title_km: 'ខ្នាតទី ១ — លក្ខខណ្ឌមូលដ្ឋាន', lessonIds: ['l3-if-else', 'l3-else-if', 'l3-switch'] },
      { id: '3-2', title_km: 'ខ្នាតទី ២ — តក្កវិជ្ជាកម្រិតមធ្យម', lessonIds: ['l3-logical-ops', 'l3-nested-conditions', 'l3-logic-mistakes'] },
    ],
  },
  {
    id: 4,
    title_km: 'រង្វិលជុំ (Loops)',
    title_en: 'Loops',
    status: 'published',
    objective_km: 'ប្រើ for, while, do-while និងគ្រប់គ្រងរង្វិលជុំដោយ break/continue',
    prerequisites_km: 'បញ្ចប់កម្រិត ៣',
    outcomes_km: ['ប្រើ for / while / do-while', 'ប្រើ break និង continue', 'trace ការដំណើរការរង្វិលជុំ', 'សរសេរ nested loops'],
    estimated_hours: 6,
    units: [
      { id: '4-1', title_km: 'ខ្នាតទី ១ — រង្វិលមូលដ្ឋាន', lessonIds: ['l4-for', 'l4-while', 'l4-do-while'] },
      { id: '4-2', title_km: 'ខ្នាតទី ២ — គ្រប់គ្រងរង្វិល', lessonIds: ['l4-break-continue', 'l4-nested-loops', 'l4-loop-tracing'] },
    ],
  },
  ...plannedLevels,
];

export const allLevels: Level[] = publishedLevels;

export function getLevel(id: number): Level | undefined {
  return allLevels.find((l) => l.id === id);
}

export function getLesson(id: string): Lesson | undefined {
  return lessonMap.get(id);
}

export function lessonsOfLevel(levelId: number): Lesson[] {
  const level = getLevel(levelId);
  if (!level) return [];
  const ids = level.units.flatMap((u) => u.lessonIds);
  return ids.map((id) => lessonMap.get(id)).filter((l): l is Lesson => Boolean(l));
}

export function isLessonUnlocked(lesson: Lesson, completed: Record<string, unknown>): boolean {
  if (lesson.status !== 'published') return false;
  return lesson.prerequisites.every((p) => {
    const prereq = lessonMap.get(p);
    if (!prereq) return true; // unknown prereq ids are ignored (validated separately)
    if (prereq.status !== 'published') return false;
    return Boolean(completed[p]);
  });
}

/** មេរៀនបន្ទាប់ដែលណែនាំឲ្យរៀន (lesson ដំបូងដែលមិនទាន់បញ្ចប់ និង unlock) */
export function nextRecommendedLesson(completed: Record<string, unknown>, fromLevel: number): Lesson | undefined {
  for (const level of allLevels.slice().sort((a, b) => Math.abs(a.id - fromLevel) - Math.abs(b.id - fromLevel))) {
    for (const lesson of lessonsOfLevel(level.id)) {
      if (lesson.status === 'published' && !completed[lesson.id] && isLessonUnlocked(lesson, completed)) {
        return lesson;
      }
    }
  }
  return undefined;
}

export function totalPublishedLessons(): number {
  return allLessons.filter((l) => l.status === 'published').length;
}
