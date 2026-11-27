import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { FriendsSection } from '../components/FriendsSection';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const displayName = user?.displayName ?? '';
  const avatarInitial = displayName.charAt(0).toUpperCase() || '?';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.subhead}>Your Account</Text>
        <Text style={styles.title}>Profile</Text>
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitial}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </Card>

      <FriendsSection />


      <Button
        title="Log out"
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
  logoutButton: {
    marginTop: 24,
    borderColor: theme.colors.error,
  },
});
