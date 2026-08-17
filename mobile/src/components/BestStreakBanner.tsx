import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface BestStreakBannerProps {
  label?: string;
  streakDays?: number;
  habitTitle?: string;
}

export const BestStreakBanner: React.FC<BestStreakBannerProps> = ({
  label = 'BEST ACTIVE STREAK',
  streakDays = 14,
  habitTitle = 'Poranne picie szklanki wody',
}) => {
  return (
    <View style={styles.banner}>
      <View style={styles.leftContent}>
        <Text style={styles.subhead}>{label}</Text>
        <View style={styles.numberRow}>
          <Text style={styles.number}>{streakDays}</Text>
          <Text style={styles.unit}> Dni</Text>
        </View>
        <Text style={styles.habitTitle} numberOfLines={1}>
          {habitTitle}
        </Text>
      </View>

      {/* Right Watermark Icon Box */}
      <View style={styles.rightWatermark}>
        <View style={styles.watermarkInner}>
          <Text style={styles.flameIcon}>🔥</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#006B5C', // Deep Teal ze Stitcha
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    overflow: 'hidden',
    ...theme.shadows.active,
  },
  leftContent: {
    flex: 1,
    paddingRight: 10,
  },
  subhead: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1.2,
    marginBottom: 6,
    fontFamily: theme.fonts.label,
    textTransform: 'uppercase',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  number: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: theme.fonts.headline,
  },
  unit: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: theme.fonts.headline,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: theme.fonts.body,
  },
  rightWatermark: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkInner: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameIcon: {
    fontSize: 34,
    opacity: 0.9,
  },
});
