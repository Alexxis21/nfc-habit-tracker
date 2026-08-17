import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MOCK_HABITS, MOCK_STATS, Habit } from '../mocks/habits';
import { theme } from '../theme';
import { HabitCard } from '../components/HabitCard';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';

interface HabitListScreenProps {
  onSelectHabit: (habit: Habit) => void;
  onAddNewHabit: () => void;
}

const WEEKDAY_LABELS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const MONTH_LABELS = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

export const HabitListScreen: React.FC<HabitListScreenProps> = ({ onSelectHabit, onAddNewHabit }) => {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);

  const toggleComplete = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const newCompleted = !h.completedToday;
          return {
            ...h,
            completedToday: newCompleted,
            streak: newCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
            lastScannedAt: newCompleted ? 'Przed chwilą (Skan NFC)' : h.lastScannedAt,
          };
        }
        return h;
      })
    );
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const dailyGoalPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const bestStreak = Math.max(0, ...habits.map((h) => h.streak));

  const today = new Date();
  const dateLabel = `${WEEKDAY_LABELS[today.getDay()][0].toUpperCase()}${WEEKDAY_LABELS[today.getDay()].slice(1)}, ${today.getDate()} ${MONTH_LABELS[today.getMonth()]}`;

  return (
    <View style={styles.root}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Wordmark */}
      <Text style={styles.wordmark}>HabitTrack</Text>

      {/* Date + Greeting */}
      <Text style={styles.dateLabel}>{dateLabel}</Text>
      <Text style={styles.greeting}>Dzień dobry, Aleksandro</Text>
      <Text style={styles.greetingSub}>
        Jesteś na {bestStreak}-dniowej passie. Tak trzymaj! 🔥
      </Text>

      {/* Daily Goal Card */}
      <Card style={styles.goalCard}>
        <CircularProgress
          percentage={dailyGoalPercent}
          size={72}
          strokeWidth={8}
          label={`${dailyGoalPercent}%`}
        />
        <View style={styles.goalInfo}>
          <Text style={styles.goalTitle}>Dzienny Cel</Text>
          <Text style={styles.goalSub}>
            {completedCount} z {habits.length} nawyków wykonanych
          </Text>
        </View>
      </Card>

      {/* Active Habits Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Aktywne Nawyki</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>Zobacz wszystkie ›</Text>
        </TouchableOpacity>
      </View>

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onPress={onSelectHabit} onToggleComplete={toggleComplete} />
      ))}

      {/* Weekly Progress Card */}
      <Card style={styles.weeklyCard}>
        <Text style={styles.weeklyTitle}>Postęp Tygodniowy</Text>
        <Text style={styles.weeklySub}>Ostatnie 7 dni</Text>
        <View style={styles.barChartContainer}>
          {MOCK_STATS.weeklyHistory.map((item) => (
            <View key={item.day} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${(item.count / 5) * 100}%` }]} />
              </View>
              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>

    <TouchableOpacity style={styles.fab} onPress={onAddNewHabit} activeOpacity={0.85}>
      <Text style={styles.fabIcon}>＋</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: 16,
    paddingBottom: 90,
  },
  wordmark: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.headline,
    marginBottom: 18,
  },
  dateLabel: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.label,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  greetingSub: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
    marginBottom: 18,
    fontFamily: theme.fonts.body,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  goalInfo: {
    marginLeft: 16,
    flex: 1,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  goalSub: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
    fontFamily: theme.fonts.label,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.label,
  },
  weeklyCard: {
    marginTop: 8,
    marginBottom: 24,
    paddingBottom: 20,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  weeklySub: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
    fontFamily: theme.fonts.label,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 84,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  barLabel: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginTop: 6,
    fontFamily: theme.fonts.label,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.active,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 34,
  },
});
