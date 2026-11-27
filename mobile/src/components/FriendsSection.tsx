import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert } from 'react-native';
import { theme } from '../theme';
import { Card } from './ui/Card';
import { FriendDto, FriendRelation, getFriends, inviteFriend, lookupFriend, acceptInvitation, removeFriendship } from '../api/friends';
import { ApiError } from '../api/client';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  type LookupState =
    | { status: 'idle' }
    | { status: 'found'; displayName: string }
    | { status: 'error'; message: string };

  const errorMessage = (err: unknown) =>
    err instanceof ApiError ? err.message : 'Could not connect to the server';

export const FriendsSection: React.FC = () => {
  const [friends, setFriends] = useState<FriendDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    try {
        setError(null);
        setFriends(await getFriends());
    } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Could not connect to the server');
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const [email, setEmail] = useState('');
  const [lookup, setLookup] = useState<LookupState>({ status: 'idle' });
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const candidate = email.trim();
    setLookup({ status: 'idle'});
    if (!EMAIL_PATTERN.test(candidate)) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await lookupFriend(candidate);
        if (!cancelled) setLookup({ status: 'found', displayName: result.displayName });
      } catch (err) {
        if (!cancelled) setLookup({ status: 'error', message: errorMessage(err) });
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [email]);

  const handleInvite = async () => {
    setIsSending(true);
    try {
      const result = await inviteFriend(email.trim());
      setInviteMessage(
        result.relation === 'FRIEND'
          ? `You and ${result.displayName} are now friends`
          : `Invitation sent to ${result.displayName}`
      );
      setEmail('');
      await loadFriends();
    } catch (err) {
      setLookup({ status: 'error', message: errorMessage(err) });
    } finally {
      setIsSending(false);
    }
  };

    const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const runAction = async (friendshipId: number, action: () => Promise<unknown>) => {
    setBusyId(friendshipId);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      await loadFriends();
      setBusyId(null);
    }
  };

  const confirmRemove = (f: FriendDto) => {
    Alert.alert('Remove friend?', `${f.displayName} will be removed from your friends.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => runAction(f.friendshipId, () => removeFriendship(f.friendshipId)),
      },
    ]);
  };

  const renderActions = (f: FriendDto) => {
    const isBusy = busyId === f.friendshipId;
    const isLocked = busyId !== null;
    const remove = () => runAction(f.friendshipId, () => removeFriendship(f.friendshipId));

    switch (f.relation) {
      case 'INVITATION_RECEIVED':
        return (
          <>
            <Button
              title="Accept"
              size="sm"
              loading={isBusy}
              disabled={isLocked}
              onPress={() => runAction(f.friendshipId, () => acceptInvitation(f.friendshipId))}
            />
            <Button title="Decline" size="sm" variant="outline" disabled={isLocked} onPress={remove} />
          </>
        );
      case 'INVITATION_SENT':
        return (
          <Button title="Cancel" size="sm" variant="outline" loading={isBusy} disabled={isLocked} onPress={remove} />
        );
      case 'FRIEND':
        return (
          <Button title="Remove" size="sm" variant="outline" loading={isBusy} disabled={isLocked} onPress={() => confirmRemove(f)} />
        );
    }
  };

  const renderGroup = (title: string, relation: FriendRelation) => {
    const items = friends.filter((f) => f.relation === relation);
    if(items.length === 0) return null;

    return (
        <View>
        <Text style={styles.groupTitle}>{title}</Text>
          {items.map((f) => (
          <View key={f.friendshipId} style={styles.row}>
            <View style={styles.previewText}>
              <Text style={styles.name}>{f.displayName}</Text>
              <Text style={styles.email}>{f.email}</Text>
            </View>
            {renderActions(f)}
          </View>
        ))}
      </View>
    )
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Friends</Text>
      {isLoading && <ActivityIndicator color={theme.colors.primary} />}

      {error && <Text style={styles.error}>{error}</Text>}

      <Input
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setInviteMessage(null);
        }}
        placeholder="Friend's e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={lookup.status === 'error' ? lookup.message : undefined}
      />

      {lookup.status === 'found' && (
        <View style={styles.preview}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{lookup.displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.previewText}>
            <Text style={styles.name}>{lookup.displayName}</Text>
            <Text style={styles.email}>{email.trim()}</Text>
          </View>
          <Button title="Invite" onPress={handleInvite} loading={isSending} size="sm" />
        </View>
      )}

      {inviteMessage && <Text style={styles.info}>{inviteMessage}</Text>}

      {!isLoading && !error && friends.length === 0 && (
        <Text style={styles.info}>No friends yet</Text>
      )}

      {actionError && <Text style={styles.error}>{actionError}</Text>}
      {renderGroup('Invitations received', 'INVITATION_RECEIVED')}
      {renderGroup('Friends', 'FRIEND')}
      {renderGroup('Sent invitations', 'INVITATION_SENT')}
    </Card>


  );
};

const styles = StyleSheet.create({
  card: { paddingVertical: 20 },
  title: { fontSize: 18, fontWeight: '800', color: theme.colors.onSurface, fontFamily: theme.fonts.headline },
  groupTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.primaryDark, marginTop: 16, fontFamily: theme.fonts.label },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  name: { fontSize: 15, fontWeight: '700', color: theme.colors.onSurface, fontFamily: theme.fonts.body },
  email: { fontSize: 12, color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.label },
  info: { fontSize: 13, color: theme.colors.onSurfaceVariant, marginTop: 10, fontFamily: theme.fonts.body },
  error: { fontSize: 13, color: theme.colors.error, marginTop: 10, fontFamily: theme.fonts.body },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.secondaryContainer },
  previewText: { flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
});