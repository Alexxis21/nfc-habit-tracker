export interface Habit {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  streak: number;
  targetDaysPerWeek: number;
  completedToday: boolean;
  lastScannedAt?: string;
  nfcTagId?: string;
  icon: string;
  timeOfDay: 'Rano' | 'Popołudnie' | 'Wieczór' | 'Cały dzień';
}

export interface PredefinedHabit {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  icon: string;
  timeOfDay: 'Rano' | 'Popołudnie' | 'Wieczór' | 'Cały dzień';
  targetDaysPerWeek: number;
}

export const PREDEFINED_HABITS: PredefinedHabit[] = [
  {
    id: 'p1',
    title: 'Poranne picie szklanki wody',
    category: 'Zdrowie',
    categoryColor: '#0EA5E9',
    icon: '💧',
    timeOfDay: 'Rano',
    targetDaysPerWeek: 7,
  },
  {
    id: 'p2',
    title: 'Czytanie książki 20 minut',
    category: 'Rozwój',
    categoryColor: '#00bfa5',
    icon: '📖',
    timeOfDay: 'Wieczór',
    targetDaysPerWeek: 5,
  },
  {
    id: 'p3',
    title: 'Nitkowanie i mycie zębów',
    category: 'Higiena',
    categoryColor: '#8B5CF6',
    icon: '🪥',
    timeOfDay: 'Wieczór',
    targetDaysPerWeek: 7,
  },
  {
    id: 'p4',
    title: 'Trening siłowy lub cardio',
    category: 'Fit',
    categoryColor: '#F59E0B',
    icon: '🏋️',
    timeOfDay: 'Popołudnie',
    targetDaysPerWeek: 4,
  },
  {
    id: 'p5',
    title: 'Medytacja i ćwiczenia oddechowe',
    category: 'Rozwój',
    categoryColor: '#00bfa5',
    icon: '🧘',
    timeOfDay: 'Rano',
    targetDaysPerWeek: 7,
  },
  {
    id: 'p6',
    title: 'Jedzenie warzyw do obiadów',
    category: 'Zdrowie',
    categoryColor: '#0EA5E9',
    icon: '🥗',
    timeOfDay: 'Popołudnie',
    targetDaysPerWeek: 7,
  },
  {
    id: 'p7',
    title: 'Bez ekranów 30 min przed snem',
    category: 'Rozwój',
    categoryColor: '#00bfa5',
    icon: '📵',
    timeOfDay: 'Wieczór',
    targetDaysPerWeek: 6,
  },
  {
    id: 'p8',
    title: 'Spacer minimum 8000 kroków',
    category: 'Fit',
    categoryColor: '#F59E0B',
    icon: '🚶',
    timeOfDay: 'Cały dzień',
    targetDaysPerWeek: 5,
  },
];

export const MOCK_HABITS: Habit[] = [
  {
    id: 'h1',
    title: 'Poranne picie szklanki wody',
    category: 'Zdrowie',
    categoryColor: '#0EA5E9',
    streak: 14,
    targetDaysPerWeek: 7,
    completedToday: true,
    lastScannedAt: 'Dzisiaj, 07:30',
    nfcTagId: 'NFC-KUCHNA-01',
    icon: '💧',
    timeOfDay: 'Rano',
  },
  {
    id: 'h2',
    title: 'Czytanie książki (20 min)',
    category: 'Rozwój',
    categoryColor: '#00bfa5',
    streak: 8,
    targetDaysPerWeek: 5,
    completedToday: false,
    lastScannedAt: 'Wczoraj, 21:15',
    nfcTagId: 'NFC-BIURKO-02',
    icon: '📖',
    timeOfDay: 'Wieczór',
  },
  {
    id: 'h3',
    title: 'Wieczorna medytacja i rozciąganie',
    category: 'Rozwój',
    categoryColor: '#00bfa5',
    streak: 5,
    targetDaysPerWeek: 7,
    completedToday: false,
    lastScannedAt: '2 dni temu',
    nfcTagId: 'NFC-SYPIALNIA-03',
    icon: '🧘',
    timeOfDay: 'Wieczór',
  },
  {
    id: 'h4',
    title: 'Trening siłowy / Rozgrzewka',
    category: 'Fit',
    categoryColor: '#F59E0B',
    streak: 3,
    targetDaysPerWeek: 4,
    completedToday: true,
    lastScannedAt: 'Dzisiaj, 11:00',
    nfcTagId: 'NFC-TORBA-04',
    icon: '🏋️',
    timeOfDay: 'Popołudnie',
  },
];

export const MOCK_STATS = {
  totalScansThisWeek: 28,
  activeStreaksCount: 4,
  completionRatePercent: 86,
  weeklyHistory: [
    { day: 'Pn', count: 4, isTargetMet: true },
    { day: 'Wt', count: 4, isTargetMet: true },
    { day: 'Śr', count: 3, isTargetMet: true },
    { day: 'Cz', count: 4, isTargetMet: true },
    { day: 'Pt', count: 5, isTargetMet: true },
    { day: 'Sob', count: 4, isTargetMet: true },
    { day: 'Niedz', count: 4, isTargetMet: true },
  ],
};
