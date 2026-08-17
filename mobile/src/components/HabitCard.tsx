import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Habit } from '../mocks/habits';
import { theme } from '../theme';
import { Card } from './ui/Card';

interface HabitCardProps {
  habit: Habit;
  onPress: (habit: Habit) => void;
  onToggleComplete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress, onToggleComplete }) => {
  const progressRatio = habit.completedToday
    ? 1
    : Math.min(1, habit.streak / Math.max(1, habit.targetDaysPerWeek));

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(habit)}>
      <Card style={styles.cardContainer}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{habit.icon}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {habit.title}
            </Text>
            <Text style={styles.streakText}>🔥 {habit.streak} Day Streak</Text>
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onToggleComplete(habit.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.linkIcon}>{habit.completedToday ? '✓' : '⧉'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
          </View>
        </View>

        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>
            {Math.min(habit.streak, habit.targetDaysPerWeek)}/{habit.targetDaysPerWeek} dni w tyg.
          </Text>
          <Text style={[styles.statusLabel, habit.completedToday ? styles.statusDone : styles.statusPending]}>
            {habit.completedToday ? 'Wykonano' : 'Oczekuje'}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  streakText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
    fontFamily: theme.fonts.label,
  },
  linkButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkIcon: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  progressRow: {
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.label,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.fonts.label,
  },
  statusDone: {
    color: theme.colors.primaryDark,
  },
  statusPending: {
    color: theme.colors.outline,
  },
});
