import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { useState } from 'react';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const TEST_URI = 'https://example.com/test';

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
  const [nfcResult, setNfcResult] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    NfcManager.start();
  }, []);

  const handleWriteTest = async () => {
    setIsWriting(true);
    setNfcResult(null);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(TEST_URI)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
      }
      setNfcResult(`✅ Written to tag: ${TEST_URI}`);
    } catch (error) {
      setNfcResult(`❌ Write error: ${String(error)}`);
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
      setIsWriting(false);
    }
  };

  const handleReadTest = async () => {
    setIsReading(true);
    setNfcResult(null);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const record = tag?.ndefMessage?.[0];
      const uri = record ? Ndef.uri.decodePayload(Uint8Array.from(record.payload)) : null;
      setNfcResult(
        uri
          ? `✅ Tag read. URI: ${uri}\nTag ID: ${tag?.id}`
          : `✅ Tag read (no URI record).\nTag ID: ${tag?.id}\nRaw data: ${JSON.stringify(tag)}`
      );
    } catch (error) {
      setNfcResult(`❌ Read error: ${String(error)}`);
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
      setIsReading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.subhead}>Configuration</Text>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Card style={styles.card}>
        <SettingsRow icon="🔔" label="Reminder notifications" value={notifications} onChange={setNotifications} />
        <SettingsRow icon="📡" label="Auto-open after NFC scan" value={nfcAutoOpen} onChange={setNfcAutoOpen} />
        <SettingsRow icon="🌙" label="Dark mode" value={darkMode} onChange={setDarkMode} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.diagTitle}>🧪 PoC Stage 1: NDEF Write / Read</Text>
        <Text style={styles.diagSub}>
          Hold your phone near an NTAG215 sticker when the system scan panel appears.
        </Text>
        <View style={styles.nfcButtonRow}>
          <Button
            title="Write test tag"
            onPress={handleWriteTest}
            variant="outline"
            loading={isWriting}
            style={styles.nfcButtonHalf}
          />
          <Button
            title="Read tag"
            onPress={handleReadTest}
            variant="secondary"
            loading={isReading}
            style={styles.nfcButtonHalf}
          />
        </View>
        {nfcResult && <Text style={styles.diagResult}>{nfcResult}</Text>}
      </Card>

      <Card style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>HabitTrack NFC</Text>
        <Text style={styles.aboutText}>Version 1.0.0 (build in progress — Stage 1)</Text>
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
  diagTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  diagSub: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 17,
    fontFamily: theme.fonts.body,
  },
  nfcButtonRow: {
    flexDirection: 'row',
  },
  nfcButtonHalf: {
    flex: 1,
    marginRight: 8,
  },
  diagResult: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginTop: 12,
    padding: 10,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.fonts.label,
  },
});
