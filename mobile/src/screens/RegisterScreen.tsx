import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register(email, password, displayName);
      onRegisterSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Nie udało się połączyć z serwerem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.wordmark}>HabitTrack</Text>
        <Text style={styles.title}>Załóż konto</Text>
        <Text style={styles.subtitle}>Zacznij budować swoje nawyki ze zbliżeniem NFC.</Text>

        <View style={styles.form}>
          <Input
            label="Imię"
            placeholder="Aleksandra"
            value={displayName}
            onChangeText={setDisplayName}
            icon="👤"
          />
          <Input
            label="E-mail"
            placeholder="jan.kowalski@przyklad.pl"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon="✉️"
          />
          <Input
            label="Hasło"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="🔒"
          />
          <Input
            label="Powtórz hasło"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="🔒"
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Zarejestruj się"
          onPress={handleSubmit}
          size="lg"
          style={styles.submitButton}
          loading={isSubmitting}
          disabled={!email || !password || !confirmPassword || !displayName}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Masz już konto?</Text>
          <TouchableOpacity onPress={onNavigateToLogin} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.footerLink}> Zaloguj się</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.containerMargin,
  },
  wordmark: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.headline,
    marginBottom: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },
  form: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.error,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.body,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.label,
  },
});
