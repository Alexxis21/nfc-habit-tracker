import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MOCK_STATS, MOCK_HABITS } from '../mocks/habits';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/CircularProgress';
import { MonthlyStreakHeatmap } from '../components/MonthlyStreakHeatmap';
import { BestStreakBanner } from '../components/BestStreakBanner';

const MONTHLY_HISTORY = [
  { day: 'Tydz 1', count: 24 },
  { day: 'Tydz 2', count: 27 },
  { day: 'Tydz 3', count: 22 },
  { day: 'Tydz 4', count: 28 },
];

type Range = 'weekly' | 'monthly';

export const StatsScreen: React.FC = () => {
  const [range, setRange] = useState<Range>('weekly');

  const bestHabit = [...MOCK_HABITS].sort((a, b) => b.streak - a.streak)[0];
  const mostConsistent = [...MOCK_HABITS]
    .map((h) => ({ ...h, percent: Math.min(100, Math.round((h.streak / h.targetDaysPerWeek) * 100)) }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  const chartData = range === 'weekly'
    ? MOCK_STATS.weeklyHistory.map((d) => ({ label: d.day, count: d.count }))
    : MONTHLY_HISTORY.map((d) => ({ label: d.day, count: d.count }));
  const maxCount = Math.max(...chartData.map((d) => d.count));

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

      {/* Habit Consistency Card */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.cardTitle}>Habit Consistency</Text>
          <Badge label="+12% vs last week" backgroundColor="#DCFCE7" color="#15803D" />
        </View>
        <Text style={styles.chartSub}>Daily completion rate over the last {range === 'weekly' ? '7 days' : '4 weeks'}</Text>

        <View style={styles.barChartContainer}>
          {chartData.map((item) => (
            <View key={item.label} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${(item.count / maxCount) * 100}%` }]} />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Best Active Streak Banner */}
      <BestStreakBanner label="BEST ACTIVE STREAK" streakDays={bestHabit.streak} habitTitle={bestHabit.title} />

      {/* Consistency Score */}
      <Card style={styles.scoreCard}>
        <Text style={styles.cardTitleSmall}>CONSISTENCY SCORE</Text>
        <View style={styles.scoreRow}>
          <CircularProgress percentage={MOCK_STATS.completionRatePercent} size={72} strokeWidth={8} label={`${MOCK_STATS.completionRatePercent}%`} />
          <Text style={styles.scoreText}>Jesteś w top 5% użytkowników w tym miesiącu!</Text>
        </View>
      </Card>

      {/* Most Consistent */}
      <Card style={styles.consistentCard}>
        <Text style={styles.cardTitle}>Most Consistent</Text>
        {mostConsistent.map((h) => (
          <View key={h.id} style={styles.consistentRow}>
            <Text style={styles.consistentName} numberOfLines={1}>
              {h.icon} {h.title}
            </Text>
            <View style={styles.consistentBarBg}>
              <View style={[styles.consistentBarFill, { width: `${h.percent}%`, backgroundColor: h.categoryColor }]} />
            </View>
            <Text style={styles.consistentPercent}>{h.percent}%</Text>
          </View>
        ))}
      </Card>

      {/* Streak Trends Heatmap */}
      <MonthlyStreakHeatmap title="Streak Trends" monthYearLabel="Sierpień 2026" />
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
});
