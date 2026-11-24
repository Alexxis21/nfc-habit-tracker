import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Habit, mapHabitDtoToHabit, applyScanResult } from '../types/habit';
import { getHabits } from '../api/habits';
import { ApiError } from '../api/client';
import { theme } from '../theme';
import { HabitCard } from '../components/HabitCard';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { scanTag } from '../api/scan';
import { getStats } from '../api/stats';
import { Bar, toDailyBars } from '../utils/statsView';

interface HabitListScreenProps {
  onSelectHabit: (habit: Habit) => void;
  onAddNewHabit: () => void;
}

const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const HabitListScreen: React.FC<HabitListScreenProps> = ({ onSelectHabit, onAddNewHabit }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeklyBars, setWeeklyBars] = useState<Bar[]>([]);


  const loadHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dtos, stats] = await Promise.all([getHabits(), getStats('7d')]);
      setHabits(dtos.map(mapHabitDtoToHabit));
      setWeeklyBars(toDailyBars(stats.days));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not connect to the server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const handleScan = async (habitId: number) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    if (!habit.nfcTagId) {
      Alert.alert('No sticker', 'First assign an NFC sticker to this habit in its details.');
      return;
    }

    try {
      const result = await scanTag(habit.nfcTagId);
      setHabits((prev) => prev.map((h) => (h.id === habitId ? applyScanResult(h, result) : h)));
      getStats('7d').then((stats) => setWeeklyBars(toDailyBars(stats.days))).catch(() => {});
    } catch (err) {
      Alert.alert('Scan failed', err instanceof ApiError ? err.message : 'Could not connect to the server');
    }
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const dailyGoalPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const bestStreak = Math.max(0, ...habits.map((h) => h.streak));

  const today = new Date();
  const dateLabel = `${WEEKDAY_LABELS[today.getDay()][0].toUpperCase()}${WEEKDAY_LABELS[today.getDay()].slice(1)}, ${today.getDate()} ${MONTH_LABELS[today.getMonth()]}`;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Wordmark */}
      <Text style={styles.wordmark}>HabitTrack</Text>

      {/* Date + Greeting */}
      <Text style={styles.dateLabel}>{dateLabel}</Text>
      <Text style={styles.greeting}>Hello</Text>
      <Text style={styles.greetingSub}>
        You're on a {bestStreak}-day streak. Keep it up! 🔥
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Daily Goal Card */}
      <Card style={styles.goalCard}>
        <CircularProgress
          percentage={dailyGoalPercent}
          size={72}
          strokeWidth={8}
          label={`${dailyGoalPercent}%`}
        />
        <View style={styles.goalInfo}>
          <Text style={styles.goalTitle}>Daily Goal</Text>
          <Text style={styles.goalSub}>
            {completedCount} of {habits.length} habits completed
          </Text>
        </View>
      </Card>

      {/* Active Habits Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Habits</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>See all ›</Text>
        </TouchableOpacity>
      </View>

      {habits.length === 0 && !error && (
        <Text style={styles.emptyText}>You have no habits yet — add your first one with the ＋ button.</Text>
      )}

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onPress={onSelectHabit} onToggleComplete={handleScan} />
      ))}

      {/* Weekly Progress Card */}
      <Card style={styles.weeklyCard}>
        <Text style={styles.weeklyTitle}>Weekly Progress</Text>
        <Text style={styles.weeklySub}>Last 7 days</Text>
        <View style={styles.barChartContainer}>
            {weeklyBars.map((item, index) => (
            <View key={`${item.label}-${index}`} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${(item.count / Math.max(1, habits.length)) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
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
  errorText: {
    fontSize: 13,
    color: theme.colors.error,
    fontFamily: theme.fonts.body,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.body,
    marginBottom: 16,
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