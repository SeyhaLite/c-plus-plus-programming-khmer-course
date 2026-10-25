import type { Achievement } from '../types';

// ============================================================
// សមិទ្ធផល (Achievements) — មានក្បួនច្បាស់លាស់ មិនមែនគ្រាន់តែជាការលើកទឹកចិត្តទទេ
// ============================================================

export const achievements: Achievement[] = [
  { id: 'first-lesson', title_km: 'ជំហានដំបូង', description_km: 'បញ្ចប់មេរៀនដំបូងរបស់អ្នក', icon: 'star' },
  { id: 'level-0-complete', title_km: 'ត្រៀមខ្លួនរួចរាល់', description_km: 'បញ្ចប់កម្រិត ០ ទាំងស្រុង', icon: 'flag' },
  { id: 'level-1-complete', title_km: 'អ្នកសរសេរកូដថ្មី', description_km: 'បញ្ចប់កម្រិត ១ ទាំងស្រុង', icon: 'code' },
  { id: 'level-2-complete', title_km: 'ម្ចាស់អថេរ', description_km: 'បញ្ចប់កម្រិត ២ ទាំងស្រុង', icon: 'box' },
  { id: 'level-3-complete', title_km: 'អ្នកសម្រេចចិត្ត', description_km: 'បញ្ចប់កម្រិត ៣ ទាំងស្រុង', icon: 'lightbulb' },
  { id: 'level-4-complete', title_km: 'អ្នកវិលជុំ', description_km: 'បញ្ចប់កម្រិត ៤ ទាំងស្រុង', icon: 'refresh' },
  { id: 'level-5-complete', title_km: 'ស្ថាបតិកមុខងារ', description_km: 'បញ្ចប់កម្រិត ៥ ទាំងស្រុង', icon: 'book' },
  { id: 'streak-3', title_km: 'ភ្លើងតូច', description_km: 'រៀនជាប់គ្នា ៣ ថ្ងៃ', icon: 'flame' },
  { id: 'streak-7', title_km: 'ភ្លើងធំ', description_km: 'រៀនជាប់គ្នា ៧ ថ្ងៃ', icon: 'flame' },
  { id: 'xp-100', title_km: 'រង្វាន់ ១០០ XP', description_km: 'ប្រមូលបាន ១០០ XP', icon: 'bolt' },
  { id: 'xp-500', title_km: 'រង្វាន់ ៥០០ XP', description_km: 'ប្រមូលបាន ៥០០ XP', icon: 'bolt' },
  { id: 'first-code-run', title_km: 'ដំណើរការកូដដំបូង', description_km: 'ដំណើរការកូដ C++ ដោយជោគជ័យក្នុងកន្លែងហាត់សរសេរកូដ', icon: 'play' },
  { id: 'quiz-taken', title_km: 'បានវាយតម្លៃខ្លួនឯង', description_km: 'បញ្ចប់ពិនិត្យចំណេះដឹង (placement test)', icon: 'clipboard' },
];

export const XP_RULES = {
  lessonComplete: 25,
  exerciseFirstTry: 5,
  quizComplete: 15,
} as const;

export function getAchievement(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}
