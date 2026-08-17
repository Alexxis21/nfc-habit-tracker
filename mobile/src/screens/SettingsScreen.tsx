import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { useState } from 'react';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';

interface SettingsRowProps {
  icon: string;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, value, onChange }) => (
  <View style={styles.row}>
    <Text style={styles.rowIcon}>{icon}</Text>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: theme.colors.surfaceContainerHigh, true: theme.colors.primary }}
      thumbColor="#FFFFFF"
    />
  </View>
);

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [nfcAutoOpen, setNfcAutoOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.subhead}>Konfiguracja</Text>
        <Text style={styles.title}>Ustawienia</Text>
      </View>

      <Card style={styles.card}>
        <SettingsRow icon="🔔" label="Powiadomienia o przypomnieniach" value={notifications} onChange={setNotifications} />
        <SettingsRow icon="📡" label="Auto-otwieranie po skanie NFC" value={nfcAutoOpen} onChange={setNfcAutoOpen} />
        <SettingsRow icon="🌙" label="Tryb ciemny" value={darkMode} onChange={setDarkMode} />
      </Card>

      <Card style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>HabitTrack NFC</Text>
        <Text style={styles.aboutText}>Wersja 1.0.0 (build w toku — Etap 1)</Text>
      </Card>
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
  header: {
    marginBottom: 16,
  },
  subhead: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.label,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainer,
  },
  rowIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.body,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  aboutText: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 4,
    fontFamily: theme.fonts.label,
  },
});
