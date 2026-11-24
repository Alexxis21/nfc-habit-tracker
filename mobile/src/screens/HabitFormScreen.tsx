import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getHabitTemplates, createHabit, updateHabit, HabitTemplateDto } from '../api/habits';
import { Habit, TIME_OF_DAY_LABELS } from '../types/habit';
import { ApiError } from '../api/client';
import { assignAndWriteTag } from '../nfc/pairTag';

interface HabitFormScreenProps {
  habit? : Habit;
  onBack: () => void;
  onSaveHabit: () => void;
}

const TIME_OF_DAY_OPTIONS = [
  { key: 'Morning', label: 'Morning', icon: '☀️', backendValue: 'MORNING' },
  { key: 'Afternoon', label: 'Afternoon', icon: '🌤️', backendValue: 'AFTERNOON' },
  { key: 'Evening', label: 'Evening', icon: '🌙', backendValue: 'EVENING' },
] as const;

// Konwencja ISO 8601: poniedziałek = 1, ..., niedziela = 7 — tak samo interpretuje to backend.
const DAY_TO_ISO: Record<string, number> = { Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6, Su: 7 };
const ALL_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const HabitFormScreen: React.FC<HabitFormScreenProps> = ({ habit,onBack, onSaveHabit }) => {
  const [templates, setTemplates] = useState<HabitTemplateDto[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pairAfterSave, setPairAfterSave] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

    const initialDays = habit
    ? ALL_DAYS.filter((d) => habit.scheduledDays.includes(DAY_TO_ISO[d]))
    : ALL_DAYS;

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(habit?.templateId ?? null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening'>(
    habit && habit.timeOfDay !== 'All day' ? habit.timeOfDay : 'Afternoon'
  );
  const [frequencyType, setFrequencyType] = useState<'daily' | 'custom'>(
    initialDays.length === ALL_DAYS.length ? 'daily' : 'custom'
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);
  const [dailyTarget, setDailyTarget] = useState<number>(habit?.dailyTargetCount ?? 1);

  const isEditing = habit !== undefined;
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? templates[0];

  useEffect(() => {
    (async () => {
      setIsLoadingTemplates(true);
      setLoadError(null);
      try {
        const data = await getHabitTemplates();
        setTemplates(data);
        if (!habit && data.length > 0) {
          setSelectedTemplateId(data[0].id);
          applyTemplateDefaults(data[0]);
        }
      } catch (err) {
        setLoadError(err instanceof ApiError ? err.message : 'Could not load the habit list');
      } finally {
        setIsLoadingTemplates(false);
      }
    })();
  }, []);

  const applyTemplateDefaults = (template: HabitTemplateDto) => {
    const label = TIME_OF_DAY_LABELS[template.defaultTimeOfDay];
    setDailyTarget(template.defaultDailyTargetCount);
    setTimeOfDay(label === 'All day' ? 'Afternoon' : label);

    if (template.defaultTargetDaysPerWeek >= 7) {
      setFrequencyType('daily');
      setSelectedDays(ALL_DAYS);
    } else {
      setFrequencyType('custom');
      setSelectedDays(ALL_DAYS.slice(0, template.defaultTargetDaysPerWeek));
    }
  };

  const handleSelectTemplate = (template: HabitTemplateDto) => {
    setSelectedTemplateId(template.id);
    setIsDropdownOpen(false);
    if (!habit){
      applyTemplateDefaults(template);
    }
    
  };

  const handleSkipNfc = () => {
    setPairAfterSave(false);
    Alert.alert('Added without a sticker', 'You can assign an NFC sticker later in the habit details.');
  };

    const handleSubmit = async () => {
    if (!selectedTemplate) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const backendTimeOfDay = TIME_OF_DAY_OPTIONS.find((o) => o.key === timeOfDay)!.backendValue;
      const payload = {
        templateId: selectedTemplate.id,
        dailyTargetCount: dailyTarget,
        timeOfDay: backendTimeOfDay,
        targetDaysPerWeek: selectedDays.length,
        scheduledDays: selectedDays.map((d) => DAY_TO_ISO[d]),
        remindersEnabled: habit ? habit.remindersEnabled : true,
      };

      if (habit) {
        await updateHabit(habit.id, payload);
        onSaveHabit();
        return;
      }

      const created = await createHabit(payload);

        if (pairAfterSave) {
        try {
          const outcome = await assignAndWriteTag(created.id);
          if (outcome.status === 'written') {
            Alert.alert('✅ Sticker ready', 'The address was written to the sticker.');
          } else {
            Alert.alert(
              'Sticker assigned but not written',
              `${outcome.reason}\n\nYou can retry writing it in the habit details.`
            );
          }
        } catch (err) {
          const reason = err instanceof ApiError ? err.message : 'Could not connect to the server';
          Alert.alert(
            'Habit saved, but without a sticker',
            `${reason}\n\nYou can assign an NFC sticker later in the habit details.`
          );
        }
      }
      onSaveHabit();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not connect to the server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTemplates) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (loadError || !selectedTemplate) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{loadError ?? 'No habit templates available'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{habit ? 'Edit Habit' : 'Add Habit'}</Text>
        <Text style={styles.menuIcon}>⋮</Text>
      </View>
      
      {/* NFC Hero Card */} 
      {!habit && (  
      <Card style={styles.nfcCard}>
        <View style={styles.nfcTopRow}>
          <View style={styles.nfcTextCol}>
            <View style={styles.nfcReadyRow}>
              <View style={styles.readyDot} />
              <Text style={styles.nfcReadyLabel}>NFC READY</Text>
            </View>
            <Text style={styles.nfcCardTitle}>Assign an NFC sticker</Text>
            <Text style={styles.nfcCardSub}>You will assign the sticker right after saving the habit.</Text>
          </View>
          <View style={styles.nfcIconBox}>
            <Text style={styles.nfcIconEmoji}>📶</Text>
          </View>
        </View>

        {pairAfterSave ? (
          <View style={styles.pairedSuccessBox}>
            <Text style={styles.pairedText}>✅ The sticker will be assigned after saving</Text>
            <Button
              title="Cancel"
              onPress={() => setPairAfterSave(false)}
              variant="secondary"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          <View style={styles.nfcButtonRow}>
            <Button
              title="Assign after saving"
              onPress={() => setPairAfterSave(true)}
              variant="outline"
              style={styles.nfcButtonHalf}
            />
            <Button
              title="Add later"
              onPress={handleSkipNfc}
              variant="secondary"
              style={styles.nfcButtonHalf}
            />
          </View>
        )}
      </Card> )}

      {/* Habit Name — predefined dropdown */}
      <Text style={styles.sectionLabel}>Habit name</Text>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        activeOpacity={0.8}
        disabled={isEditing}
      >
        <View style={styles.dropdownLeft}>
          <View style={styles.dropdownIconCircle}>
            <Text style={styles.dropdownIconEmoji}>{selectedTemplate.icon}</Text>
          </View>
          <View style={styles.dropdownInfo}>
            <Text style={styles.dropdownSelectedTitle}>{selectedTemplate.title}</Text>
            <Text style={styles.dropdownSelectedSub}>
              {selectedTemplate.category} • {TIME_OF_DAY_LABELS[selectedTemplate.defaultTimeOfDay]}
            </Text>
          </View>
        </View>
        <Text style={styles.dropdownArrow}>{isEditing ? '🔒' : isDropdownOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isDropdownOpen && !isEditing && (
        <View style={styles.dropdownListContainer}>
          {templates.map((item) => {
            const isSelected = item.id === selectedTemplateId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.dropdownOptionItem, isSelected && styles.dropdownOptionActive]}
                onPress={() => handleSelectTemplate(item)}
              >
                <Text style={styles.optionEmoji}>{item.icon}</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, isSelected && styles.optionTitleActive]}>{item.title}</Text>
                  <Text style={styles.optionSub}>
                    {item.category} • {TIME_OF_DAY_LABELS[item.defaultTimeOfDay]}
                  </Text>
                </View>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

            {/* Daily target */}
      <Text style={styles.sectionLabel}>Times per day</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={[styles.stepperBtn, dailyTarget <= 1 && styles.stepperBtnDisabled]}
          onPress={() => setDailyTarget((n) => Math.max(1, n - 1))}
          disabled={dailyTarget <= 1}
        >
          <Text style={styles.stepperBtnText}>−</Text>
        </TouchableOpacity>
        <View style={styles.stepperValueBox}>
          <Text style={styles.stepperValue}>{dailyTarget}</Text>
          <Text style={styles.stepperUnit}>{dailyTarget === 1 ? 'time' : 'times'} per day</Text>
        </View>
        <TouchableOpacity
          style={[styles.stepperBtn, dailyTarget >= 20 && styles.stepperBtnDisabled]}
          onPress={() => setDailyTarget((n) => Math.min(20, n + 1))}
          disabled={dailyTarget >= 20}
        >
          <Text style={styles.stepperBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Frequency */}
      <Text style={styles.sectionLabel}>Frequency</Text>
      <View style={styles.frequencySegmentContainer}>
        <TouchableOpacity
          style={[styles.frequencySegmentBtn, frequencyType === 'daily' && styles.frequencySegmentActive]}
          onPress={() => {
            setFrequencyType('daily');
            setSelectedDays(ALL_DAYS);
          }}
        >
          <Text style={[styles.frequencySegmentText, frequencyType === 'daily' && styles.frequencySegmentTextActive]}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.frequencySegmentBtn, frequencyType === 'custom' && styles.frequencySegmentActive]}
          onPress={() => setFrequencyType('custom')}
        >
          <Text style={[styles.frequencySegmentText, frequencyType === 'custom' && styles.frequencySegmentTextActive]}>
            Selected days
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
      <Text style={styles.sectionLabel}>Time of day</Text>
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

      {submitError && <Text style={styles.errorText}>{submitError}</Text>}

      {/* Submit Button */}
      <Button
        title={habit ? 'Save changes' : 'Save Habit'}
        onPress={handleSubmit}
        size="lg"
        style={styles.saveButton}
        loading={isSubmitting}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.containerMargin,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.error,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginBottom: 8,
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
    stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: 8,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  stepperBtnText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  stepperValueBox: {
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: theme.fonts.headline,
  },
  stepperUnit: {
    fontSize: 12,
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