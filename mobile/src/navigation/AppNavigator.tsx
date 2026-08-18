import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { TabNavigator } from './TabNavigator';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen
              onLoginSuccess={() => navigation.replace('Main')}
              onNavigateToRegister={() => navigation.navigate('Register')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {({ navigation }) => (
            <RegisterScreen
              onRegisterSuccess={() => navigation.replace('Main')}
              onNavigateToLogin={() => navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Main">
          {({ navigation }) => (
            <TabNavigator
              onLogout={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
