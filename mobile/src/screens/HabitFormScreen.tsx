import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PREDEFINED_HABITS, PredefinedHabit } from '../mocks/habits';

interface HabitFormScreenProps {
  onBack: () => void;
  onSaveHabit: (newHabit: any) => void;
}

const TIME_OF_DAY_OPTIONS = [
  { key: 'Rano', label: 'Rano', icon: '☀️' },
  { key: 'Popołudnie', label: 'Popołudnie', icon: '🌤️' },
  { key: 'Wieczór', label: 'Wieczór', icon: '🌙' },
] as const;

const ALL_DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export const HabitFormScreen: React.FC<HabitFormScreenProps> = ({ onBack, onSaveHabit }) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string>(PREDEFINED_HABITS[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedHabit = PREDEFINED_HABITS.find((p) => p.id === selectedHabitId) || PREDEFINED_HABITS[0];

  const [timeOfDay, setTimeOfDay] = useState<'Rano' | 'Popołudnie' | 'Wieczór'>('Popołudnie');
  const [frequencyType, setFrequencyType] = useState<'daily' | 'custom'>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(ALL_DAYS);
  const [nfcTagId, setNfcTagId] = useState('');
  const [isPairingNfc, setIsPairingNfc] = useState(false);

  const handleSelectPredefined = (predefined: PredefinedHabit) => {
    setSelectedHabitId(predefined.id);
    setIsDropdownOpen(false);

    const tod = predefined.timeOfDay === 'Cały dzień' ? 'Popołudnie' : predefined.timeOfDay;
    setTimeOfDay(tod);

    if (predefined.targetDaysPerWeek >= 7) {
      setFrequencyType('daily');
      setSelectedDays(ALL_DAYS);
    } else {
      setFrequencyType('custom');
      setSelectedDays(ALL_DAYS.slice(0, predefined.targetDaysPerWeek));
    }
  };

  const handlePairNfc = () => {
    setIsPairingNfc(true);
    setTimeout(() => {
      const generatedTagId = `NFC-TAG-${Math.floor(1000 + Math.random() * 9000)}`;
      setNfcTagId(generatedTagId);
      setIsPairingNfc(false);
      Alert.alert('✅ Naklejka NFC Skonfigurowana!', `Przypisano identyfikator: ${generatedTagId}`);
    }, 1500);
  };

  const handleSkipNfc = () => {
    Alert.alert('Dodano bez naklejki', 'Naklejkę NFC możesz sparować później w szczegółach nawyku.');
  };

  const handleSubmit = () => {
    const newHabit = {
      id: `h_${Date.now()}`,
      title: selectedHabit.title,
      category: selectedHabit.category,
      categoryColor: selectedHabit.categoryColor,
      streak: 0,
      targetDaysPerWeek: selectedDays.length,
      completedToday: false,
      icon: selectedHabit.icon,
      timeOfDay,
      nfcTagId: nfcTagId || undefined,
    };

    onSaveHabit(newHabit);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Dodaj Nawyk</Text>
        <Text style={styles.menuIcon}>⋮</Text>
      </View>

      {/* NFC Hero Card */}
      <Card style={styles.nfcCard}>
        <View style={styles.nfcTopRow}>
          <View style={styles.nfcTextCol}>
            <View style={styles.nfcReadyRow}>
              <View style={styles.readyDot} />
              <Text style={styles.nfcReadyLabel}>NFC READY</Text>
            </View>
            <Text style={styles.nfcCardTitle}>Sparuj tag NFC</Text>
            <Text style={styles.nfcCardSub}>Dotknij tagu, aby natychmiastowo połączyć.</Text>
          </View>
          <View style={styles.nfcIconBox}>
            <Text style={styles.nfcIconEmoji}>📶</Text>
          </View>
        </View>

        {nfcTagId ? (
          <View style={styles.pairedSuccessBox}>
            <Text style={styles.pairedText}>✅ Sparowano Tag: {nfcTagId}</Text>
          </View>
        ) : (
          <View style={styles.nfcButtonRow}>
            <Button
              title="Skanuj teraz"
              onPress={handlePairNfc}
              variant="outline"
              loading={isPairingNfc}
              style={styles.nfcButtonHalf}
            />
            <Button
              title="Dodaj później"
              onPress={handleSkipNfc}
              variant="secondary"
              style={styles.nfcButtonHalf}
            />
          </View>
        )}
      </Card>

      {/* Habit Name — predefined dropdown */}
      <Text style={styles.sectionLabel}>Nazwa nawyku</Text>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        activeOpacity={0.8}
      >
        <View style={styles.dropdownLeft}>
          <View style={styles.dropdownIconCircle}>
            <Text style={styles.dropdownIconEmoji}>{selectedHabit.icon}</Text>
          </View>
          <View style={styles.dropdownInfo}>
            <Text style={styles.dropdownSelectedTitle}>{selectedHabit.title}</Text>
            <Text style={styles.dropdownSelectedSub}>
              {selectedHabit.category} • {selectedHabit.timeOfDay}
            </Text>
          </View>
        </View>
        <Text style={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownListContainer}>
          {PREDEFINED_HABITS.map((item) => {
            const isSelected = item.id === selectedHabitId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.dropdownOptionItem, isSelected && styles.dropdownOptionActive]}
                onPress={() => handleSelectPredefined(item)}
              >
                <Text style={styles.optionEmoji}>{item.icon}</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, isSelected && styles.optionTitleActive]}>{item.title}</Text>
                  <Text style={styles.optionSub}>
                    {item.category} • {item.timeOfDay}
                  </Text>
                </View>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Frequency */}
      <Text style={styles.sectionLabel}>Częstotliwość</Text>
      <View style={styles.frequencySegmentContainer}>
        <TouchableOpacity
          style={[styles.frequencySegmentBtn, frequencyType === 'daily' && styles.frequencySegmentActive]}
          onPress={() => {
            setFrequencyType('daily');
            setSelectedDays(ALL_DAYS);
          }}
        >
          <Text style={[styles.frequencySegmentText, frequencyType === 'daily' && styles.frequencySegmentTextActive]}>
            Codziennie
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.frequencySegmentBtn, frequencyType === 'custom' && styles.frequencySegmentActive]}
          onPress={() => setFrequencyType('custom')}
        >
          <Text style={[styles.frequencySegmentText, frequencyType === 'custom' && styles.frequencySegmentTextActive]}>
            Wybrane dni
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {ALL_DAYS.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayCircle, isSelected ? styles.dayCircleActive : styles.dayCircleInactive]}
              onPress={() => {
                if (frequencyType === 'daily') setFrequencyType('custom');
                if (isSelected) {
                  if (selectedDays.length > 1) setSelectedDays(selectedDays.filter((d) => d !== day));
                } else {
                  setSelectedDays([...selectedDays, day]);
                }
              }}
            >
              <Text style={[styles.dayCircleText, isSelected && styles.whiteText]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Time of Day */}
      <Text style={styles.sectionLabel}>Pora dnia</Text>
      <View style={styles.timeOfDayRow}>
        {TIME_OF_DAY_OPTIONS.map((option) => {
          const isSelected = timeOfDay === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.timeOfDayBox, isSelected && styles.timeOfDayBoxActive]}
              onPress={() => setTimeOfDay(option.key)}
            >
              <Text style={styles.timeOfDayIcon}>{option.icon}</Text>
              <Text style={[styles.timeOfDayLabel, isSelected && styles.whiteText]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit Button */}
      <Button title="Zapisz Nawyk" onPress={handleSubmit} size="lg" style={styles.saveButton} />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backArrow: {
    fontSize: 22,
    color: theme.colors.primaryDark,
    fontWeight: '700',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  menuIcon: {
    fontSize: 20,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '800',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginTop: 18,
    marginBottom: 8,
    fontFamily: theme.fonts.label,
  },
  nfcCard: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
    borderWidth: 1,
  },
  nfcTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nfcTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  nfcReadyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  nfcReadyLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#16A34A',
    fontFamily: theme.fonts.label,
  },
  nfcCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 4,
    fontFamily: theme.fonts.headline,
  },
  nfcCardSub: {
    fontSize: 13,
    color: '#115E59',
    lineHeight: 18,
    fontFamily: theme.fonts.body,
  },
  nfcIconBox: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcIconEmoji: {
    fontSize: 26,
  },
  nfcButtonRow: {
    flexDirection: 'row',
  },
  nfcButtonHalf: {
    flex: 1,
    marginRight: 8,
  },
  pairedSuccessBox: {
    backgroundColor: '#CCFBF1',
    padding: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  pairedText: {
    color: '#0F766E',
    fontWeight: '700',
    fontSize: 14,
  },
  whiteText: {
    color: '#FFFFFF',
  },
  frequencySegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: theme.borderRadius.full,
    padding: 4,
    marginBottom: 16,
  },
  frequencySegmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencySegmentActive: {
    backgroundColor: '#FFFFFF',
    ...theme.shadows.card,
  },
  frequencySegmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: theme.fonts.label,
  },
  frequencySegmentTextActive: {
    color: '#0F766E',
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#0F766E',
  },
  dayCircleInactive: {
    backgroundColor: '#E2E8F0',
  },
  dayCircleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    fontFamily: theme.fonts.label,
  },
  timeOfDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeOfDayBox: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surfaceContainer,
    alignItems: 'center',
  },
  timeOfDayBoxActive: {
    backgroundColor: '#0F766E',
  },
  timeOfDayIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  timeOfDayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.fonts.label,
  },
  saveButton: {
    marginTop: 28,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1.5,
    borderColor: theme.colors.primaryDark,
    borderRadius: theme.borderRadius.lg,
    padding: 12,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dropdownIconEmoji: {
    fontSize: 22,
  },
  dropdownInfo: {
    flex: 1,
  },
  dropdownSelectedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  dropdownSelectedSub: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
    fontFamily: theme.fonts.label,
  },
  dropdownArrow: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    fontWeight: '800',
    paddingLeft: 8,
  },
  dropdownListContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.borderRadius.lg,
    marginTop: 8,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  dropdownOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainer,
  },
  dropdownOptionActive: {
    backgroundColor: '#F0FDFA',
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.body,
  },
  optionTitleActive: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  optionSub: {
    fontSize: 11,
    color: theme.colors.outline,
    marginTop: 2,
    fontFamily: theme.fonts.label,
  },
  checkMark: {
    fontSize: 16,
    color: theme.colors.primaryDark,
    fontWeight: '800',
  },
});
