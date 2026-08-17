import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme';
import { Card } from './ui/Card';

interface DayHeatmapData {
  dayNumber: number;
  dateStr: string;
  intensity: 0 | 1 | 2 | 3; // 0: brak, 1: niski, 2: wykonany, 3: intensywny streak
  count: number;
}

interface MonthlyStreakHeatmapProps {
  title?: string;
  monthYearLabel?: string;
}

// Generowanie mockowych danych dla miesiąca (31 dni w 5 rzędach po 7 kolumn)
const generateMockMonthlyData = (): DayHeatmapData[] => {
  const intensities: (0 | 1 | 2 | 3)[] = [
    1, 1, 2, 3, 2, 1, 0,
    2, 3, 3, 3, 2, 1, 1,
    3, 3, 3, 3, 2, 3, 3,
    1, 1, 0, 1, 2, 2, 3,
    3, 2, 3,
  ];

  return intensities.map((intensity, idx) => ({
    dayNumber: idx + 1,
    dateStr: `${idx + 1} Sierpnia 2026`,
    intensity,
    count: intensity === 0 ? 0 : intensity === 1 ? 1 : intensity === 2 ? 3 : 5,
  }));
};

export const MonthlyStreakHeatmap: React.FC<MonthlyStreakHeatmapProps> = ({
  title = 'Trendy Passy (Streak Trends)',
  monthYearLabel = 'Sierpień 2026',
}) => {
  const days = generateMockMonthlyData();

  const getTileColor = (intensity: 0 | 1 | 2 | 3) => {
    switch (intensity) {
      case 3:
        return '#006B5C'; // Ciemny, głęboki turkus (najwyższa aktywność)
      case 2:
        return theme.colors.primary; // Energetyczny teal #00bfa5
      case 1:
        return '#A7F3D0'; // Jasna mięta
      case 0:
      default:
        return '#ECEEEF'; // Szary podkład
    }
  };

  const handleTilePress = (day: DayHeatmapData) => {
    Alert.alert(
      `📅 ${day.dateStr}`,
      day.count > 0
        ? `Liczba zbliżeń NFC: ${day.count}\nStatus: Streak Utrzymany 🔥`
        : 'Brak zarejestrowanych skanów NFC w tym dniu.'
    );
  };

  return (
    <Card style={styles.card}>
      {/* Card Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.monthLabel}>{monthYearLabel}</Text>
      </View>

      {/* Heatmap Grid (7 kolumn) */}
      <View style={styles.grid}>
        {days.map((day) => (
          <TouchableOpacity
            key={day.dayNumber}
            style={[
              styles.tile,
              { backgroundColor: getTileColor(day.intensity) },
            ]}
            onPress={() => handleTilePress(day)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayText, day.intensity >= 2 && styles.whiteText]}>
              {day.dayNumber}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Heatmap Legend Footer */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>Mniej</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, { backgroundColor: '#ECEEEF' }]} />
          <View style={[styles.legendBox, { backgroundColor: '#A7F3D0' }]} />
          <View style={[styles.legendBox, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.legendBox, { backgroundColor: '#006B5C' }]} />
        </View>
        <Text style={styles.legendText}>Więcej</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.outline,
    fontFamily: theme.fonts.label,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -3,
    marginBottom: 14,
  },
  tile: {
    width: '12.5%', // 7 kolumn z marginesami
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
    margin: '0.8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.label,
  },
  whiteText: {
    color: '#FFFFFF',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceContainer,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.outline,
    fontWeight: '600',
    fontFamily: theme.fonts.label,
  },
  legendRow: {
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});
