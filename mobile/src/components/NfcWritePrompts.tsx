import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import { theme } from '../theme';
import { Button } from './ui/Button';
import { registerNfcPromptListener } from '../nfc/nfcPrompt';

export const NfcWritePrompt: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    registerNfcPromptListener(setVisible);
    return () => registerNfcPromptListener(null);
  }, []);

  const handleCancel = () => {
    NfcManager.cancelTechnologyRequest().catch(() => {});
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>📶</Text>
          <Text style={styles.title}>Hold your phone near the NFC sticker</Text>
          <Text style={styles.text}>Hold it still until writing finishes.</Text>
          <Button title="Cancel" onPress={handleCancel} variant="secondary" style={styles.button} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.containerMargin,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});