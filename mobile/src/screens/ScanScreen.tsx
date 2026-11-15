import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { Button } from '../components/ui/Button';
import { scanTag, ScanResponse } from '../api/scan';
import { ApiError, UnauthorizedError } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface ScanScreenProps {
  tagId?: string;
  onDone: () => void;
  onLoginRequired: (tagId: string) => void;
}

type ScanState =
  | { status: 'loading' }
  | { status: 'success'; result: ScanResponse }
  | { status: 'error'; message: string; retryable: boolean };

const toErrorState = (err: unknown): ScanState => {
  if (err instanceof UnauthorizedError) {
    return { status: 'error', message: 'Zaloguj się, aby zaliczyć skan.', retryable: false };
  }
  if (err instanceof ApiError) {
    return { status: 'error', message: err.message, retryable: err.status >= 500 };
  }
  return {
    status: 'error',
    message: 'Nie udało się połączyć z serwerem. Sprawdź połączenie z internetem.',
    retryable: true,
  };
};

export const ScanScreen: React.FC<ScanScreenProps> = ({ tagId, onDone, onLoginRequired }) => {
  const { user } = useAuth();
  const [state, setState] = useState<ScanState>({ status: 'loading' });
  const lastScannedTagId = useRef<string | undefined>(undefined);

  const performScan = (id: string) => {
    setState({ status: 'loading' });
    scanTag(id)
      .then((result) => setState({ status: 'success', result }))
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          onLoginRequired(id);
          return;
        }
        setState(toErrorState(err));
      });
  };

  useEffect(() => {
    if (!tagId) {
      setState({
        status: 'error',
        message: 'Nieprawidłowy link: brakuje identyfikatora naklejki.',
        retryable: false,
      });
      return;
    }
    if (lastScannedTagId.current === tagId) return;

    if (!user) {
      onLoginRequired(tagId);
      return;
    }
    lastScannedTagId.current = tagId;

    performScan(tagId);
  }, [tagId, user]);

  const canRetry = state.status === 'error' && state.retryable && !!tagId;

  return (
    <View style={styles.container}>
      {state.status === 'loading' && (
        <>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.line}>Rejestruję skan…</Text>
        </>
      )}

      {state.status === 'success' && (
        <>
          <Text style={styles.icon}>{state.result.completedToday ? '🎉' : '✅'}</Text>
          <Text style={styles.title}>Skan zaliczony</Text>
          <Text style={styles.line}>
            Dzisiaj: {state.result.todayCount}/{state.result.dailyTargetCount}
          </Text>
          <Text style={styles.line}>Passa: {state.result.currentStreak} dni</Text>
          <Text style={styles.points}>+{state.result.pointsAwarded} pkt</Text>
          {state.result.completedToday && <Text style={styles.goal}>Cel na dziś osiągnięty!</Text>}
        </>
      )}

      {state.status === 'error' && (
        <>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Skan nieudany</Text>
          <Text style={styles.error}>{state.message}</Text>
        </>
      )}

      {canRetry && (
        <Button title="Spróbuj ponownie" onPress={() => performScan(tagId!)} style={styles.button} />
      )}
      {state.status !== 'loading' && (
        <Button
          title="Zamknij"
          onPress={onDone}
          variant={canRetry ? 'secondary' : 'primary'}
          style={canRetry ? styles.secondaryButton : styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.containerMargin,
  },
  icon: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
    marginBottom: 16,
  },
  line: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.body,
    marginTop: 6,
  },
  points: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.headline,
    marginTop: 14,
  },
  goal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginTop: 10,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
  },
  button: {
    marginTop: 28,
    alignSelf: 'stretch',
  },
  secondaryButton: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
});