import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinkingOptions, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { ScanScreen } from '../screens/ScanScreen';


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Scan: { tagId?: string };
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['habitapp://'],
  config: {
    screens: {
      Scan: 'scan',
    },
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [pendingTagId, setPendingTagId] = useState<string | undefined>(undefined);


  const takePendingTagId = () => {
    const tagId = pendingTagId;
    setPendingTagId(undefined);
    return tagId;
  };

  useEffect(() => {
    if (!user && navigationRef.isReady() && navigationRef.getCurrentRoute()?.name === 'Main') {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator
        initialRouteName={user ? 'Main' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen
              onLoginSuccess={() => {
                const tagId = takePendingTagId();
                if (tagId) navigation.replace('Scan', { tagId });
                else navigation.replace('Main');
              }}
              onNavigateToRegister={() => navigation.navigate('Register')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {({ navigation }) => (
            <RegisterScreen
              onRegisterSuccess={() => {
                const tagId = takePendingTagId();
                if (tagId) navigation.replace('Scan', { tagId });
                else navigation.replace('Main');
              }}
              onNavigateToLogin={() => navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Main">
          {({ navigation }) => (
            <TabNavigator
              onLogout={async () => {
                await logout();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Scan">
          {({ route, navigation }) => (
            <ScanScreen
              tagId={route.params?.tagId}
              onDone={() => navigation.replace('Main')}
              onLoginRequired={(tagId) => {
                setPendingTagId(tagId);
                navigation.replace('Login');
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
