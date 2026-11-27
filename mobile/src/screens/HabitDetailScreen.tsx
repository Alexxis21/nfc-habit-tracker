import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Habit, applyScanResult } from '../types/habit';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ConsistencyMap } from '../components/ConsistencyMap';
import { scanTag } from '../api/scan';
import { ApiError } from '../api/client';
import { assignAndWriteTag } from '../nfc/pairTag';
import { writeFailureMessage, writeNdefUrl } from '../nfc/writeNdefUrl';
import { formatScanTime } from '../utils/formatScanTime';
import { deleteHabit } from '../api/habits';

interface HabitDetailScreenProps {
  habit: Habit;
  onBack: () => void;
  onEdit: () => void;
}

const MILESTONE_THRESHOLDS = [7, 14, 30, 60, 100];

const getMilestoneTier = (streak: number) => {
  if (streak >= 30) return { icon: '👑', label: 'Streak Legend' };
  if (streak >= 14) return { icon: '🏆', label: 'Master Practitioner' };
  if (streak >= 7) return { icon: '🥈', label: 'Persistent Practitioner' };
  return { icon: '🥉', label: 'Beginner' };
};

export const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({ habit: initialHabit, onBack, onEdit }) => {
  const [habit, setHabit] = useState<Habit>(initialHabit);
  const nextThreshold = MILESTONE_THRESHOLDS.find((t) => t > habit.streak) ?? MILESTONE_THRESHOLDS[MILESTONE_THRESHOLDS.length - 1];
  const daysUntilNext = Math.max(0, nextThreshold - habit.streak);
  const milestonePercent = Math.min(100, (habit.streak / nextThreshold) * 100);
  const tier = getMilestoneTier(habit.streak);
  const isLinked = !!habit.nfcTagId;

  const errorMessage = (err: unknown) =>
    err instanceof ApiError ? err.message : 'Could not connect to the server';

  const handleScan = async () => {
    if (!habit.nfcTagId) return;
    try {
      const result = await scanTag(habit.nfcTagId);
      setHabit(applyScanResult(habit, result));
      const pointsText = result.pointsAwarded > 0 ? `+${result.pointsAwarded} pts` : 'no points (goal reached)';
      Alert.alert('✅ NFC scan successful!', `${pointsText} • streak: ${result.currentStreak} days`);
    } catch (err) {
      Alert.alert('Scan failed', errorMessage(err));
    }
  };

    const handleLinkTag = async () => {
      try {
        const outcome = await assignAndWriteTag(habit.id);
        setHabit({ ...habit, nfcTagId: outcome.tag.tagId, nfcTagUrl: outcome.tag.ndefUrl });
        if (outcome.status === 'written') {
          Alert.alert('✅ Sticker ready', 'The address was written to the sticker. Hold your phone near it to log the habit.');
        } else {
          Alert.alert(
            'Sticker assigned but not written',
            `${outcome.reason}\n\nUse the “Rewrite on sticker” button.`
          );
        }
      } catch (err) {
        Alert.alert('Could not assign the sticker', errorMessage(err));
      }
    };

    const handleRewriteTag = async () => {
      if (!habit.nfcTagUrl) return;
      const result = await writeNdefUrl(habit.nfcTagUrl);
      if (result.status === 'written') {
        Alert.alert('Written', writeFailureMessage(result));
      } else if (result.status === 'failed') {
        Alert.alert('Could not write', writeFailureMessage(result));
      }
    };

    const handleDelete = () => {
      Alert.alert(
        'Delete habit?',
        `“${habit.title}” will be deleted along with its scan history and statistics. This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteHabit(habit.id);
                onBack();
              } catch (err) {
                Alert.alert('Could not delete the habit', errorMessage(err));
              }
            },
          },
        ]
      );
    };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {habit.title}
        </Text>
        <Badge label={`⚡ ${habit.streak} Day Streak`} backgroundColor={theme.colors.secondaryContainer} color={theme.colors.primaryDark} />
      </View>

      {/* Consistency Map */}
      <ConsistencyMap />

      {/* Milestone Card */}
      <Card style={styles.milestoneCard}>
        <Text style={styles.sectionTitle}>Milestone</Text>
        <Text style={styles.milestoneSub}>
          {daysUntilNext} dni do odznaki {nextThreshold}-dniowej
        </Text>

        <View style={styles.ringWrapper}>
          <CircularProgress
            percentage={milestonePercent}
            size={140}
            strokeWidth={12}
            label={`${habit.streak}`}
            sublabel="DAYS"
          />
        </View>

        <Badge
          label={tier.label}
          icon={tier.icon}
          backgroundColor={theme.colors.surfaceContainer}
          color={theme.colors.onSurface}
          style={styles.tierBadge}
        />
      </Card>

      {isLinked ? (
        <>
          {/* NFC Mapping Card */}
          <Card style={styles.nfcCard}>
            <Text style={styles.sectionTitle}>🏷️ Linked NFC Tag</Text>
            <View style={styles.nfcDetailRow}>
              <Text style={styles.nfcLabel}>NDEF identifier:</Text>
              <Text style={styles.nfcVal}>{habit.nfcTagId}</Text>
            </View>
            <View style={styles.nfcDetailRow}>
              <Text style={styles.nfcLabel}>Last scan:</Text>
              <Text style={styles.nfcVal}>{habit.lastScannedAt ? formatScanTime(habit.lastScannedAt) : 'No scans'}</Text>
            </View>

            <Button title="Test Scan of This Tag" onPress={handleScan} icon="📡" style={{ marginTop: 14 }} />
            <Button
              title="Rewrite on sticker"
              onPress={handleRewriteTag}
              variant="outline"
              style={{ marginTop: 10 }}
            />
          </Card>

        </>
      ) : (
        /* How it works — onboarding for a not-yet-linked habit */
        <Card style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>How it works</Text>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Get an NFC sticker</Text>
              <Text style={styles.stepDesc}>Adhesive stickers work best. Place it, for example, on a mug or a yoga mat.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Link sticker</Text>
              <Text style={styles.stepDesc}>Tap “Link sticker” below and hold your phone near the sticker.</Text>
            </View>
          </View>

          <View style={[styles.stepRow, { marginBottom: 0 }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Effortless</Text>
              <Text style={styles.stepDesc}>Once done, just hold your phone near it. No need to navigate the app.</Text>
            </View>
          </View>

          <Button title="Link sticker" onPress={handleLinkTag} icon="📡" variant="outline" style={{ marginTop: 18 }} />
        </Card>
      )}

      {/* Habit Details Table */}
      <Card style={styles.tableCard}>
        <Text style={styles.sectionTitle}>Habit Details</Text>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Daily goal</Text>
          <Text style={styles.tableValueBold}>
            {habit.dailyTargetCount} {habit.dailyTargetCount === 1 ? 'time' : 'times'} per day
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Frequency</Text>
          <Text style={styles.tableValueBold}>Daily ({habit.targetDaysPerWeek}x/week)</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Time of Day</Text>
          <Text style={styles.tableValueBold}>
            {habit.timeOfDay} ({habit.timeOfDay === 'Morning' ? '6:00 - 10:00' : habit.timeOfDay === 'Afternoon' ? '12:00 - 16:00' : '18:00 - 22:00'})
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Reminders</Text>
          <Text style={styles.reminderActiveText}>Enabled 🔔</Text>
        </View>

        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.tableLabel}>Linked Tag</Text>
          <Text style={[styles.tableValueBold, !habit.nfcTagId && styles.italicText]}>
            {habit.nfcTagId ? habit.nfcTagId : 'None linked'}
          </Text>
        </View>
      </Card>
      <Button title="Edit habit" onPress={onEdit} variant="outline" style={{ marginTop: 24 }} />
      <Button title="Delete habit" onPress={handleDelete} variant="danger" style={{ marginTop: 12 }} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 22,
    color: theme.colors.primaryDark,
    marginRight: 12,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
    fontFamily: theme.fonts.headline,
  },
  milestoneCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  milestoneSub: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    alignSelf: 'flex-start',
    marginBottom: 18,
    fontFamily: theme.fonts.label,
  },
  ringWrapper: {
    marginBottom: 18,
  },
  tierBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  nfcCard: {
    marginBottom: 16,
  },
  nfcDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainer,
  },
  nfcLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  nfcVal: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  howItWorksCard: {
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 2,
    fontFamily: theme.fonts.headline,
  },
  stepDesc: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
    fontFamily: theme.fonts.body,
  },
  tableCard: {
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: theme.fonts.label,
  },
  tableValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: theme.fonts.body,
  },
  reminderActiveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
    fontFamily: theme.fonts.body,
  },
  italicText: {
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#94A3B8',
  },
});
