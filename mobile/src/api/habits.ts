import { apiRequest } from './client';
import { getDeviceTimeZone } from '../utils/timeZone';

export interface HabitDto {
  id: number;
  templateId: number;
  title: string;
  icon: string;
  category: string;
  categoryColor: string;
  dailyTargetCount: number;
  timeOfDay: 'RANO' | 'POPOLUDNIE' | 'WIECZOR' | 'CALY_DZIEN';
  targetDaysPerWeek: number;
  scheduledDays: number[];
  currentStreak: number;
  remindersEnabled: boolean;
  createdAt: string;
  nfcTagId: string | null;
  nfcTagUrl: string | null;
  todayCount: number;
  lastScannedAt: string | null;
}

export interface HabitTemplateDto {
  id: number;
  title: string;
  icon: string;
  category: string;
  categoryColor: string;
  defaultDailyTargetCount: number;
  unitLabel: string | null;
  defaultTimeOfDay: 'RANO' | 'POPOLUDNIE' | 'WIECZOR' | 'CALY_DZIEN';
  defaultTargetDaysPerWeek: number;
}

export interface CreateHabitPayload {
  templateId: number;
  dailyTargetCount: number;
  timeOfDay: string;
  targetDaysPerWeek: number;
  scheduledDays: number[];
  remindersEnabled?: boolean;
}

export interface TagDto {
  id: number;
  habitId: number;
  tagId: string;
  ndefUrl: string;
  createdAt: string;
}

export function getHabits(): Promise<HabitDto[]> {
  return apiRequest<HabitDto[]>('/habits?timeZone=' + encodeURIComponent(getDeviceTimeZone()));
}

export function assignTag(habitId: number): Promise<TagDto> {
  return apiRequest<TagDto>(`/habits/${habitId}/tags`, { method: 'POST' });
}

export function getHabitTemplates(): Promise<HabitTemplateDto[]> {
  return apiRequest<HabitTemplateDto[]>('/habit-templates');
}

export function createHabit(payload: CreateHabitPayload): Promise<HabitDto> {
  return apiRequest<HabitDto>('/habits', { method: 'POST', body: payload });
}

export function deleteHabit(id: number): Promise<void> {
  return apiRequest<void>(`/habits/${id}`, { method: 'DELETE' });
}

export function updateHabit(id: number, payload: CreateHabitPayload): Promise<HabitDto> {
  return apiRequest<HabitDto>(`/habits/${id}`, { method: 'PUT', body: payload });
}