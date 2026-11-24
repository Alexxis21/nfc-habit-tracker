import { HabitDto } from '../api/habits';
import { ScanResponse } from '../api/scan';

export interface Habit {
  id: number;
  templateId: number;
  scheduledDays: number[];
  remindersEnabled: boolean;
  title: string;
  category: string;
  categoryColor: string;
  streak: number;
  targetDaysPerWeek: number;
  icon: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'All day';
  dailyTargetCount: number;
  todayCount: number;
  completedToday: boolean;
  lastScannedAt?: string;
  nfcTagId?: string;
  nfcTagUrl?: string;
}

export const TIME_OF_DAY_LABELS: Record<HabitDto['timeOfDay'], Habit['timeOfDay']> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
  ALL_DAY: 'All day',
};

export function mapHabitDtoToHabit(dto: HabitDto): Habit {
  return {
    id: dto.id,
    templateId: dto.templateId,
    scheduledDays: dto.scheduledDays,
    remindersEnabled: dto.remindersEnabled,
    title: dto.title,
    category: dto.category,
    categoryColor: dto.categoryColor,
    streak: dto.currentStreak,
    targetDaysPerWeek: dto.targetDaysPerWeek,
    icon: dto.icon,
    timeOfDay: TIME_OF_DAY_LABELS[dto.timeOfDay],
    dailyTargetCount: dto.dailyTargetCount,
    todayCount: dto.todayCount,
    completedToday: dto.todayCount >= dto.dailyTargetCount,
    lastScannedAt: dto.lastScannedAt || undefined,
    nfcTagId: dto.nfcTagId || undefined,
    nfcTagUrl: dto.nfcTagUrl || undefined,
  };
}

export function applyScanResult(habit: Habit, scan: ScanResponse): Habit {
  return {
    ...habit,
    streak: scan.currentStreak,
    todayCount: scan.todayCount,
    completedToday: scan.completedToday,
    lastScannedAt: scan.scannedAt,
  };
}