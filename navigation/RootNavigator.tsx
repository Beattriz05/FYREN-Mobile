import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import UserHomeScreen from '@/screens/UserHomeScreen';
import RegisterIncidentScreen from '@/screens/RegisterIncidentScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import MapScreen from '@/screens/MapScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import LoginScreen from '@/screens/LoginScreen';
import ChiefTabNavigator from './ChiefTabNavigator';
import AdminTabNavigator from './AdminTabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '@/components/HeaderTitle';
import { getCommonScreenOptions } from './screenOptions';
import IncidentDetailScreen from '@/screens/IncidentDetailScreen';
import { Incident } from '@/utils/storage';

type UserTabParamList = {
  UserHome: undefined;
  RegisterIncident: undefined;
  History: undefined;
  Profile: undefined;
};

const UserTab = createBottomTabNavigator<UserTabParamList>();

function UserTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <UserTab.Navigator
      initialRouteName="UserHome"
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: true,
        headerTransparent: true,
        headerTintColor: theme.textLight,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: theme.backgroundRoot,
          }),
        },
      }}
    >
      <UserTab.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{
          title: 'Início',
          headerTitle: () => <HeaderTitle title="Fyren" />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <UserTab.Screen
        name="RegisterIncident"
        component={RegisterIncidentScreen}
        options={{
          title: 'Registrar',
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <UserTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
        }}
      />
      <UserTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </UserTab.Navigator>
  );
}

export type RootStackParamList = {
  Main: undefined;
  Map: undefined;
  IncidentDetail: { incident: Incident };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <LoginScreen />;
  }

  const commonOptions = getCommonScreenOptions({ theme, isDark });

  const MainComponent = user.role === 'chief'
    ? ChiefTabNavigator
    : user.role === 'admin'
    ? AdminTabNavigator
    : UserTabNavigator;

  return (
    <Stack.Navigator screenOptions={commonOptions}>
      <Stack.Screen
        name="Main"
        component={MainComponent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Mapa' }}
      />
      <Stack.Screen
        name="IncidentDetail"
        component={IncidentDetailScreen}
        options={{ title: 'Detalhes' }}
      />
    </Stack.Navigator>
  );
}
