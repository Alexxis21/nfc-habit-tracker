/**
 * Ułamek (0–1) ukończenia tygodniowego celu nawyku, używany do wypełnienia
 * paska postępu na HabitCard. Ukończenie dzisiaj zawsze daje pełny pasek —
 * niezależnie od tego, jak wypada to na tle celu tygodniowego.
 */
export const getProgressRatio = (
  streak: number,
  targetDaysPerWeek: number,
  completedToday: boolean
): number => {
  if (completedToday) return 1;
  return Math.min(1, streak / Math.max(1, targetDaysPerWeek));
};
