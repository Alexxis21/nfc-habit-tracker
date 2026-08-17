// System Projektowy Kinetic Flow wyciągnięty ze Stitch MCP dla NFC Habit Tracker

export const theme = {
  colors: {
    primary: '#00bfa5',
    primaryDark: '#006b5c',
    primaryContainer: '#00473c',
    primaryLight: '#68fadd',
    secondary: '#516161',
    secondaryContainer: '#d4e6e5',
    tertiary: '#546067',
    background: '#F8FAFB',
    surface: '#FFFFFF',
    surfaceContainer: '#ECEEEF',
    surfaceContainerHigh: '#E6E8E9',
    onSurface: '#191C1D',
    onSurfaceVariant: '#3C4A46',
    outline: '#6C7A76',
    outlineVariant: '#BBCAC4',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    success: '#00BFA5',
  },
  fonts: {
    headline: 'System', // Inter fallback
    body: 'System',     // Inter fallback
    label: 'System',    // Geist fallback
  },
  spacing: {
    unit: 8,
    containerMargin: 24,
    gutter: 16,
    cardPadding: 20,
    stackGap: 12,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    card: {
      shadowColor: '#191C1D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    active: {
      shadowColor: '#00BFA5',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 5,
    },
  },
};
