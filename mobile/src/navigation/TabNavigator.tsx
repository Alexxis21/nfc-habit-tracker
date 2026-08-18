import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitListScreen } from '../screens/HabitListScreen';
import { HabitFormScreen } from '../screens/HabitFormScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { HabitDetailScreen } from '../screens/HabitDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Habit } from '../mocks/habits';
import { theme } from '../theme';

type Tab = 'home' | 'stats' | 'profile' | 'settings';
type Overlay = 'none' | 'form' | 'detail';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'stats', label: 'Statystyki', icon: '📊' },
  { key: 'profile', label: 'Profil', icon: '👤' },
  { key: 'settings', label: 'Ustawienia', icon: '⚙️' },
];

interface TabNavigatorProps {
  onLogout: () => void;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [overlay, setOverlay] = useState<Overlay>('none');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleSelectHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setOverlay('detail');
  };

  const closeOverlay = () => setOverlay('none');

  const renderTabScreen = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsScreen />;
      case 'profile':
        return <ProfileScreen onLogout={onLogout} />;
      case 'settings':
        return <SettingsScreen />;
      case 'home':
      default:
        return (
          <HabitListScreen
            onSelectHabit={handleSelectHabit}
            onAddNewHabit={() => setOverlay('form')}
          />
        );
    }
  };

  const renderScreen = () => {
    if (overlay === 'form') {
      return <HabitFormScreen onBack={closeOverlay} onSaveHabit={closeOverlay} />;
    }
    if (overlay === 'detail' && selectedHabit) {
      return <HabitDetailScreen habit={selectedHabit} onBack={closeOverlay} />;
    }
    return renderTabScreen();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = overlay === 'none' && activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => {
                setOverlay('none');
                setActiveTab(tab.key);
              }}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceContainer,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
    ...theme.shadows.card,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.lg,
  },
  tabItemActive: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.outline,
    marginTop: 2,
    fontFamily: theme.fonts.label,
  },
  tabLabelActive: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
});
