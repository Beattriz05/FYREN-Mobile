import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import ChiefDashboardScreen from '@/screens/ChiefDashboardScreen';
import IncidentListScreen from '@/screens/IncidentListScreen';
import ReportsScreen from '@/screens/ReportsScreen';
import ProfileScreen from '@/screens/ProfileScreen';

export type ChiefTabParamList = {
  ChiefDashboard: undefined;
  IncidentList: undefined;
  Reports: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<ChiefTabParamList>();

export default function ChiefTabNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="ChiefDashboard"
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: colors.backgroundRoot,
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
        headerTintColor: colors.textLight,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: colors.backgroundRoot,
          }),
        },
      }}
    >
      <Tab.Screen
        name="ChiefDashboard"
        component={ChiefDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="IncidentList"
        component={IncidentListScreen}
        options={{
          title: 'Ocorrências',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Relatórios',
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
