import { getProgressRatio, getDailyStatusLabel } from '../habitProgress';

describe('getProgressRatio', () => {
  it('zwraca 1, gdy nawyk jest ukończony dzisiaj — niezależnie od streaka', () => {
    expect(getProgressRatio(0, 7, true)).toBe(1);
    expect(getProgressRatio(2, 7, true)).toBe(1);
  });

  it('liczy proporcję streaka do celu tygodniowego, gdy nieukończony', () => {
    expect(getProgressRatio(3, 6, false)).toBe(0.5);
    expect(getProgressRatio(0, 7, false)).toBe(0);
  });

  it('nie przekracza 1, nawet gdy streak jest większy niż cel', () => {
    expect(getProgressRatio(14, 7, false)).toBe(1);
  });

  it('nie dzieli przez zero, gdy cel tygodniowy wynosi 0', () => {
    expect(getProgressRatio(3, 0, false)).toBe(1);
  });
});

describe('getDailyStatusLabel', () => {
  it('zwraca "Done", gdy cel dnia jest domknięty', () => {
    expect(getDailyStatusLabel(8, 8, true)).toBe('Done');
    expect(getDailyStatusLabel(1, 1, true)).toBe('Done');
  });

  it('dla celu 1 pokazuje po prostu "Pending"', () => {
    expect(getDailyStatusLabel(0, 1, false)).toBe('Pending');
  });

  it('dla celu większego niż 1 pokazuje postęp i liczbę pozostałych skanów', () => {
    expect(getDailyStatusLabel(3, 8, false)).toBe('Today 3/8 * 5 left');
    expect(getDailyStatusLabel(0, 3, false)).toBe('Today 0/3 * 3 left');
  });
});