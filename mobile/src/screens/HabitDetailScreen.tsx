import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Habit } from '../mocks/habits';
import { theme } from '../theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ConsistencyMap } from '../components/ConsistencyMap';

interface HabitDetailScreenProps {
  habit: Habit;
  onBack: () => void;
}

const MILESTONE_THRESHOLDS = [7, 14, 30, 60, 100];

const getMilestoneTier = (streak: number) => {
  if (streak >= 30) return { icon: '👑', label: 'Legenda Passy' };
  if (streak >= 14) return { icon: '🏆', label: 'Master Practitioner' };
  if (streak >= 7) return { icon: '🥈', label: 'Wytrwały Praktyk' };
  return { icon: '🥉', label: 'Nowicjusz' };
};

export const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({ habit, onBack }) => {
  const nextThreshold = MILESTONE_THRESHOLDS.find((t) => t > habit.streak) ?? MILESTONE_THRESHOLDS[MILESTONE_THRESHOLDS.length - 1];
  const daysUntilNext = Math.max(0, nextThreshold - habit.streak);
  const milestonePercent = Math.min(100, (habit.streak / nextThreshold) * 100);
  const tier = getMilestoneTier(habit.streak);
  const isLinked = !!habit.nfcTagId;

  const handleSimulateScan = () => {
    Alert.alert('✅ Skan NFC Udany!', `Nawyk "${habit.title}" został zarejestrowany. Streak wzrósł!`);
  };

  const handleLinkTag = () => {
    Alert.alert('📡 Parowanie naklejki', 'Zbliż telefon do naklejki NFC, aby ją połączyć z tym nawykiem.');
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
            sublabel="DNI"
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
            <Text style={styles.sectionTitle}>🏷️ Zmapowany Tag NFC</Text>
            <View style={styles.nfcDetailRow}>
              <Text style={styles.nfcLabel}>Identyfikator NDEF:</Text>
              <Text style={styles.nfcVal}>{habit.nfcTagId}</Text>
            </View>
            <View style={styles.nfcDetailRow}>
              <Text style={styles.nfcLabel}>Ostatni skan:</Text>
              <Text style={styles.nfcVal}>{habit.lastScannedAt || 'Brak skanów'}</Text>
            </View>

            <Button title="Przetestuj Skan Tego Tagu" onPress={handleSimulateScan} icon="📡" style={{ marginTop: 14 }} />
          </Card>

          {/* Recent History Log */}
          <Card style={styles.historyCard}>
            <Text style={styles.sectionTitle}>📜 Historia Zbliżeń NFC</Text>
            <View style={styles.historyItem}>
              <Text style={styles.histIcon}>✅</Text>
              <View style={styles.histInfo}>
                <Text style={styles.histTitle}>Zarejestrowano skan NFC</Text>
                <Text style={styles.histDate}>Dzisiaj, 07:30 • Naklejka Kuchnia</Text>
              </View>
              <Badge label="+10 pkt" color={theme.colors.primaryDark} backgroundColor={theme.colors.secondaryContainer} />
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.histIcon}>✅</Text>
              <View style={styles.histInfo}>
                <Text style={styles.histTitle}>Zarejestrowano skan NFC</Text>
                <Text style={styles.histDate}>Wczoraj, 07:45 • Naklejka Kuchnia</Text>
              </View>
              <Badge label="+10 pkt" color={theme.colors.primaryDark} backgroundColor={theme.colors.secondaryContainer} />
            </View>
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
              <Text style={styles.stepTitle}>Zdobądź naklejkę NFC</Text>
              <Text style={styles.stepDesc}>Naklejki samoprzylepne działają najlepiej. Umieść ją np. na kubku lub macie do jogi.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Połącz naklejkę</Text>
              <Text style={styles.stepDesc}>Dotknij „Połącz naklejkę" poniżej i zbliż telefon do naklejki.</Text>
            </View>
          </View>

          <View style={[styles.stepRow, { marginBottom: 0 }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Bez wysiłku</Text>
              <Text style={styles.stepDesc}>Gdy skończysz, wystarczy zbliżyć telefon. Nawigacja w aplikacji nie jest potrzebna.</Text>
            </View>
          </View>

          <Button title="Połącz naklejkę" onPress={handleLinkTag} icon="📡" variant="outline" style={{ marginTop: 18 }} />
        </Card>
      )}

      {/* Habit Details Table */}
      <Card style={styles.tableCard}>
        <Text style={styles.sectionTitle}>Habit Details</Text>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Frequency</Text>
          <Text style={styles.tableValueBold}>Daily ({habit.targetDaysPerWeek}x/tyg)</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Time of Day</Text>
          <Text style={styles.tableValueBold}>
            {habit.timeOfDay} ({habit.timeOfDay === 'Rano' ? '6:00 - 10:00' : habit.timeOfDay === 'Popołudnie' ? '12:00 - 16:00' : '18:00 - 22:00'})
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
  historyCard: {
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainer,
  },
  histIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  histInfo: {
    flex: 1,
  },
  histTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  histDate: {
    fontSize: 11,
    color: theme.colors.outline,
    marginTop: 2,
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
