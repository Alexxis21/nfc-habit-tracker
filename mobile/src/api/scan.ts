import { apiRequest } from './client';
import { getDeviceTimeZone } from '../utils/timeZone';

export interface ScanResponse {
    habitId: number;
    scannedAt: string;
    todayCount: number;
    dailyTargetCount: number;
    completedToday: boolean;
    currentStreak: number;
    pointsAwarded: number;
}

export function scanTag(tagId: string): Promise<ScanResponse> {
  return apiRequest<ScanResponse>('/scan', {
    method: 'POST',
    body: { tagId, timeZone: getDeviceTimeZone() },
  });
}