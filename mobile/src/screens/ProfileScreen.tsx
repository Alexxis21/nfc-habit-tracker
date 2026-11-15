import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const displayName = user?.displayName ?? '';
  const avatarInitial = displayName.charAt(0).toUpperCase() || '?';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.subhead}>Twoje Konto</Text>
        <Text style={styles.title}>Profil</Text>
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitial}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Badge label="🔥 Poziom 4 · 320 XP" backgroundColor={theme.colors.secondaryContainer} color={theme.colors.primaryDark} style={{ marginTop: 10 }} />
      </Card>

      <Card style={styles.comingSoonCard}>
        <Text style={styles.comingSoonIcon}>👥</Text>
        <Text style={styles.comingSoonTitle}>Znajomi i wyzwania</Text>
        <Text style={styles.comingSoonText}>
          Funkcje społecznościowe (ranking, wyzwania grupowe) pojawią się w kolejnym etapie projektu.
        </Text>
      </Card>

      <Button
        title="Wyloguj się"
        onPress={onLogout}
        variant="outline"
        style={styles.logoutButton}
        textStyle={{ color: theme.colors.error }}
      />
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: theme.fonts.headline,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  email: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
    fontFamily: theme.fonts.label,
  },
  comingSoonCard: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  comingSoonIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  comingSoonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 6,
    fontFamily: theme.fonts.headline,
  },
  comingSoonText: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: theme.fonts.body,
  },
  logoutButton: {
    marginTop: 24,
    borderColor: theme.colors.error,
  },
});
