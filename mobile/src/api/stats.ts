import { apiRequest } from './client';
import { getDeviceTimeZone } from '../utils/timeZone';

export type StatsRange = '7d' | '30d' | '90d';

export interface DayStatsDto {
  date: string;
  scans: number;
  completedHabits: number;
}

export interface CategoryStatsDto {
  category: string;
  categoryColor: string;
  scans: number;
}

export interface HabitStatsDto {
  habitId: number;
  title: string;
  icon: string;
  categoryColor: string;
  currentStreak: number;
  completionPercentage: number;
}

export interface StatsDto {
  range: string;
  totalScans: number;
  completionRatePercentage: number;
  days: DayStatsDto[];
  categoryBreakdown: CategoryStatsDto[];
  habits: HabitStatsDto[];
}

export function getStats(range: StatsRange): Promise<StatsDto> {
  return apiRequest<StatsDto>(
    `/stats?range=${range}&timeZone=${encodeURIComponent(getDeviceTimeZone())}`
  );
}