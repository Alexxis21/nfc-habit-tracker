import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'flat' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'elevated' }) => {
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'flat':
        return {
          backgroundColor: theme.colors.surfaceContainer,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.card,
        };
    }
  };

  return <View style={[styles.card, getCardStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.cardPadding,
    marginVertical: 6,
    width: '100%',
  },
});
