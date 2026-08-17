import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = theme.colors.primaryDark,
  backgroundColor = theme.colors.secondaryContainer,
  style,
  textStyle,
  icon,
}) => {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, { color }, textStyle]}>
        {icon ? `${icon} ${label}` : label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: theme.fonts.label,
  },
});
