import { formatScanTime } from '../formatScanTime';

describe('formatScanTime', () => {
  const now = new Date(2026, 9, 7, 12, 0);

  it('pokazuje "Dzisiaj" dla skanu z tego samego dnia', () => {
    const iso = new Date(2026, 9, 7, 9, 5).toISOString();
    expect(formatScanTime(iso, now)).toBe('Dzisiaj, 09:05');
  });

  it('pokazuje "Wczoraj" dla skanu z poprzedniego dnia', () => {
    const iso = new Date(2026, 9, 6, 21, 15).toISOString();
    expect(formatScanTime(iso, now)).toBe('Wczoraj, 21:15');
  });

  it('pokazuje pełną datę dla starszych skanów', () => {
    const iso = new Date(2026, 9, 1, 8, 0).toISOString();
    expect(formatScanTime(iso, now)).toBe('01.10.2026, 08:00');
  });
});