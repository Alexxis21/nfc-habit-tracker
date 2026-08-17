import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  style?: ViewStyle;
}

const TICK_COUNT = 56;

// Dial-style progress ring built from radially-placed dots (no SVG dependency,
// avoids the geometry pitfalls of rotate-based half-circle overlay tricks).
export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 96,
  strokeWidth = 10,
  color = theme.colors.primary,
  trackColor = theme.colors.secondaryContainer,
  label,
  sublabel,
  style,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const filledTicks = Math.round((clamped / 100) * TICK_COUNT);
  const radius = (size - strokeWidth) / 2;
  const tickSize = strokeWidth;
  const innerSize = size - strokeWidth * 2 - 4;

  const ticks = Array.from({ length: TICK_COUNT }).map((_, i) => {
    const angle = (i / TICK_COUNT) * 2 * Math.PI - Math.PI / 2;
    const cx = size / 2 + radius * Math.cos(angle) - tickSize / 2;
    const cy = size / 2 + radius * Math.sin(angle) - tickSize / 2;
    const isFilled = i < filledTicks;
    return { key: i, left: cx, top: cy, backgroundColor: isFilled ? color : trackColor };
  });

  return (
    <View style={[{ width: size, height: size }, style]}>
      {ticks.map((tick) => (
        <View
          key={tick.key}
          style={[
            styles.tick,
            {
              width: tickSize,
              height: tickSize,
              borderRadius: tickSize / 2,
              left: tick.left,
              top: tick.top,
              backgroundColor: tick.backgroundColor,
            },
          ]}
        />
      ))}

      <View
        style={[
          styles.centerHole,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            top: (size - innerSize) / 2,
            left: (size - innerSize) / 2,
          },
        ]}
      >
        {label && <Text style={styles.label}>{label}</Text>}
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tick: {
    position: 'absolute',
  },
  centerHole: {
    position: 'absolute',
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  sublabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.label,
    marginTop: 2,
  },
});
