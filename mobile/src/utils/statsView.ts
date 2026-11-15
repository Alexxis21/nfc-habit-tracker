import { DayStatsDto, HabitStatsDto } from '../api/stats';

export interface Bar {
  label: string;
  count: number;
}

const WEEKDAY_SHORT = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];

export const toDailyBars = (days: DayStatsDto[]): Bar[] =>
  days.map((day) => ({
    label: WEEKDAY_SHORT[new Date(`${day.date}T00:00:00`).getDay()],
    count: day.completedHabits,
  }));

export const toWeeklyBars = (days: DayStatsDto[], weeks = 4): Bar[] => {
  const lastDays = days.slice(-weeks * 7);
  return Array.from({ length: weeks }, (_, week) => ({
    label: `Tydz ${week + 1}`,
    count: lastDays
      .slice(week * 7, week * 7 + 7)
      .reduce((sum, day) => sum + day.completedHabits, 0),
  }));
};

export const maxBarCount = (bars: Bar[]): number => Math.max(1, ...bars.map((bar) => bar.count));

export const pickBestStreak = (habits: HabitStatsDto[]): HabitStatsDto | null =>
  habits.reduce<HabitStatsDto | null>(
    (best, habit) => (best === null || habit.currentStreak > best.currentStreak ? habit : best),
    null
  );

export const topConsistent = (habits: HabitStatsDto[], limit = 3): HabitStatsDto[] =>
  [...habits].sort((a, b) => b.completionPercentage - a.completionPercentage).slice(0, limit);