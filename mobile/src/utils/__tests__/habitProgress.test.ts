import { getProgressRatio } from '../habitProgress';

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
