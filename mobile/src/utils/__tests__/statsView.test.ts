import { DayStatsDto, HabitStatsDto } from '../../api/stats';
import { maxBarCount, pickBestStreak, toDailyBars, toWeeklyBars, topConsistent } from '../statsView';

const pad = (n: number) => String(n).padStart(2, '0');

// dni od niedzieli 4.10.2026; miesiące w konstruktorze Date liczone od 0
const makeDays = (counts: number[]): DayStatsDto[] =>
  counts.map((completedHabits, i) => {
    const d = new Date(2026, 9, 4 + i);
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      scans: completedHabits,
      completedHabits,
    };
  });

const habit = (id: number, currentStreak: number, completionPercentage: number): HabitStatsDto => ({
  habitId: id,
  title: `Nawyk ${id}`,
  icon: '💧',
  categoryColor: '#0EA5E9',
  currentStreak,
  completionPercentage,
});

describe('toDailyBars', () => {
  it('podpisuje słupki skrótami dni tygodnia', () => {
    const bars = toDailyBars(makeDays([1, 2, 3, 4, 5, 6, 7]));

    expect(bars.map((b) => b.label)).toEqual(['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']);
    expect(bars.map((b) => b.count)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('toWeeklyBars', () => {
  it('sumuje ostatnie 28 dni w 4 tygodnie i pomija starsze dni', () => {
    const counts = [100, 100, ...Array(28).fill(1)];

    const bars = toWeeklyBars(makeDays(counts));

    expect(bars).toEqual([
      { label: 'Tydz 1', count: 7 },
      { label: 'Tydz 2', count: 7 },
      { label: 'Tydz 3', count: 7 },
      { label: 'Tydz 4', count: 7 },
    ]);
  });
});

describe('maxBarCount', () => {
  it('zwraca największy słupek', () => {
    expect(maxBarCount([{ label: 'a', count: 2 }, { label: 'b', count: 5 }])).toBe(5);
  });

  it('nie schodzi poniżej 1, żeby uniknąć dzielenia przez zero', () => {
    expect(maxBarCount([{ label: 'a', count: 0 }])).toBe(1);
    expect(maxBarCount([])).toBe(1);
  });
});

describe('pickBestStreak', () => {
  it('zwraca nawyk z najdłuższą passą', () => {
    expect(pickBestStreak([habit(1, 3, 10), habit(2, 9, 10), habit(3, 5, 10)])?.habitId).toBe(2);
  });

  it('zwraca null, gdy nie ma nawyków', () => {
    expect(pickBestStreak([])).toBeNull();
  });
});

describe('topConsistent', () => {
  it('sortuje po regularności malejąco i ogranicza liczbę', () => {
    const result = topConsistent([habit(1, 0, 40), habit(2, 0, 90), habit(3, 0, 70), habit(4, 0, 10)], 3);

    expect(result.map((h) => h.habitId)).toEqual([2, 3, 1]);
  });
});