import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { MonthlyStreakHeatmap } from '../components/MonthlyStreakHeatmap';
import { BestStreakBanner } from '../components/BestStreakBanner';
import { getStats, StatsDto } from '../api/stats';
import { ApiError } from '../api/client';
import { maxBarCount, pickBestStreak, toDailyBars, toWeeklyBars, topConsistent } from '../utils/statsView';

type Range = 'weekly' | 'monthly';

export const StatsScreen: React.FC = () => {
  const [range, setRange] = useState<Range>('weekly');
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getStats(range === 'weekly' ? '7d' : '30d')
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Could not connect to the server');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  const chartData = stats ? (range === 'weekly' ? toDailyBars(stats.days) : toWeeklyBars(stats.days)) : [];
  const maxCount = maxBarCount(chartData);
  const bestHabit = stats ? pickBestStreak(stats.habits) : null;
  const mostConsistent = stats ? topConsistent(stats.habits) : [];
  const periodLabel = range === 'weekly' ? '7 days' : '30 days';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.subhead}>YOUR MOMENTUM</Text>
      <Text style={styles.title}>Weekly Overview</Text>

      {/* Weekly / Monthly Toggle */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, range === 'weekly' && styles.segmentBtnActive]}
          onPress={() => setRange('weekly')}
        >
          <Text style={[styles.segmentText, range === 'weekly' && styles.segmentTextActive]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, range === 'monthly' && styles.segmentBtnActive]}
          onPress={() => setRange('monthly')}
        >
          <Text style={[styles.segmentText, range === 'monthly' && styles.segmentTextActive]}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.statusBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {!isLoading && error && <Text style={styles.errorText}>{error}</Text>}

      {!isLoading && !error && stats && stats.habits.length === 0 && (
        <Text style={styles.emptyText}>Add your first habit to see your stats.</Text>
      )}

      {!isLoading && !error && stats && stats.habits.length > 0 && (
        <>
          {/* Habit Consistency Card */}
          <Card style={styles.chartCard}>
            <View style={styles.chartHeaderRow}>
              <Text style={styles.cardTitle}>Habit Consistency</Text>
            </View>
            <Text style={styles.chartSub}>
              Habits completed per day over the last {range === 'weekly' ? '7 days' : '4 weeks'}
            </Text>

            <View style={styles.barChartContainer}>
              {chartData.map((item, index) => (
                <View key={`${item.label}-${index}`} style={styles.barColumn}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${(item.count / maxCount) * 100}%` }]} />
                  </View>
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Best Active Streak Banner */}
          {bestHabit && (
            <BestStreakBanner
              label="BEST ACTIVE STREAK"
              streakDays={bestHabit.currentStreak}
              habitTitle={bestHabit.title}
            />
          )}

          {/* Consistency Score */}
          <Card style={styles.scoreCard}>
            <Text style={styles.cardTitleSmall}>CONSISTENCY SCORE</Text>
            <View style={styles.scoreRow}>
              <CircularProgress
                percentage={stats.completionRatePercentage}
                size={72}
                strokeWidth={8}
                label={`${stats.completionRatePercentage}%`}
              />
              <Text style={styles.scoreText}>
                That many scheduled days completed in the last {periodLabel}.
              </Text>
            </View>
          </Card>

          {/* Most Consistent */}
          <Card style={styles.consistentCard}>
            <Text style={styles.cardTitle}>Most Consistent</Text>
            {mostConsistent.map((h) => (
              <View key={h.habitId} style={styles.consistentRow}>
                <Text style={styles.consistentName} numberOfLines={1}>
                  {h.icon} {h.title}
                </Text>
                <View style={styles.consistentBarBg}>
                  <View
                    style={[styles.consistentBarFill, { width: `${h.completionPercentage}%`, backgroundColor: h.categoryColor }]}
                  />
                </View>
                <Text style={styles.consistentPercent}>{h.completionPercentage}%</Text>
              </View>
            ))}
          </Card>

          {/* Streak Trends Heatmap (na razie mock) */}
          <MonthlyStreakHeatmap title="Streak Trends" monthYearLabel="August 2026" />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.containerMargin,
    paddingBottom: 40,
  },
  subhead: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 1,
    fontFamily: theme.fonts.label,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
    marginTop: 2,
    marginBottom: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.full,
    padding: 4,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  segmentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.full,
  },
  segmentBtnActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.label,
  },
  segmentTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  chartCard: {
    marginBottom: 16,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  cardTitleSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.6,
    fontFamily: theme.fonts.label,
    marginBottom: 12,
  },
  chartSub: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
    fontFamily: theme.fonts.label,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 8,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 16,
    height: 110,
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
  scoreCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    lineHeight: 20,
    fontFamily: theme.fonts.body,
  },
  consistentCard: {
    marginBottom: 16,
  },
  consistentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  consistentName: {
    width: 130,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.label,
  },
  consistentBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  consistentBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  consistentPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    width: 36,
    textAlign: 'right',
  },
    statusBox: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.error,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginVertical: 24,
  },
});
