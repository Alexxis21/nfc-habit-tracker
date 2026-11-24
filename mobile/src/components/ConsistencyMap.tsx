import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { Card } from './ui/Card';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ConsistencyMapProps {
  weeks?: (0 | 1 | 2 | 3)[][];
  todayIndex?: number; // index within the last row (0-6), -1 to hide
}

const generateMockWeeks = (): (0 | 1 | 2 | 3)[][] => [
  [2, 2, 0, 1, 2, 2, 1],
  [2, 2, 2, 2, 2, 1, 1],
  [2, 2, 2, 2, 1, 0, 0],
  [2, 2, 2, 2, 0, 0, 0],
];

const getTileColor = (intensity: 0 | 1 | 2 | 3) => {
  switch (intensity) {
    case 3:
      return '#006B5C';
    case 2:
      return theme.colors.primary;
    case 1:
      return '#A7F3D0';
    case 0:
    default:
      return theme.colors.surfaceContainer;
  }
};

export const ConsistencyMap: React.FC<ConsistencyMapProps> = ({
  weeks = generateMockWeeks(),
  todayIndex = 3,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Consistency Map</Text>
        <View style={styles.legendDots}>
          {['#ECEEEF', '#A7F3D0', theme.colors.primary, '#006B5C'].map((c) => (
            <View key={c} style={[styles.legendDot, { backgroundColor: c }]} />
          ))}
        </View>
      </View>

      <View style={styles.headerRow}>
        {DAY_HEADERS.map((d) => (
          <Text key={d} style={styles.dayHeaderText}>
            {d}
          </Text>
        ))}
      </View>

      {weeks.map((week, rowIdx) => {
        const isLastRow = rowIdx === weeks.length - 1;
        return (
          <View key={rowIdx} style={styles.row}>
            {week.map((intensity, colIdx) => {
              const isToday = isLastRow && colIdx === todayIndex;
              return (
                <View
                  key={colIdx}
                  style={[
                    styles.tile,
                    { backgroundColor: getTileColor(intensity) },
                    isToday && styles.todayTile,
                  ]}
                />
              );
            })}
          </View>
        );
      })}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  legendDots: {
    flexDirection: 'row',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginLeft: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.outline,
    fontFamily: theme.fonts.label,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 3,
    borderRadius: theme.borderRadius.sm,
  },
  todayTile: {
    borderWidth: 1.5,
    borderColor: theme.colors.primaryDark,
    borderStyle: 'dashed',
  },
});
