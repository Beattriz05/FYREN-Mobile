import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import AdminDashboardScreen from '@/screens/AdminDashboardScreen';
import UserManagementScreen from '@/screens/UserManagementScreen';
import AuditScreen from '@/screens/AuditScreen';
import ProfileScreen from '@/screens/ProfileScreen';

export type AdminTabParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  Audit: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminTabNavigator() {
  const { colors, isDark } = useTheme();

  // Extrair cores de forma segura
  const backgroundColor = (colors as any).background || (colors as any).backgroundRoot || (isDark ? '#121212' : '#FFFFFF');
  const secondaryColor = (colors as any).secondary || '#757575';
  const primaryColor = colors.bombeiros?.primary || '#2196F3';
  const textColor = colors.text || (isDark ? '#FFFFFF' : '#000000');

  // Configurações de tabBar
  const tabBarStyle = {
    backgroundColor: isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 5,
    paddingTop: 10,
  };

  // Configurações de header
  const headerStyle = {
    backgroundColor,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#EEE',
  };

  const headerTitleStyle = {
    fontWeight: '700' as const,
    fontSize: 18,
    color: textColor,
  };

  // Configurações comuns para todas as telas
  const commonScreenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: primaryColor,
    tabBarInactiveTintColor: secondaryColor,
    tabBarStyle,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
      marginTop: 4,
    },
    tabBarItemStyle: {
      paddingTop: 5,
    },
    tabBarBackground: () =>
      Platform.OS === 'ios' ? (
        <BlurView
          intensity={80}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark 
                ? 'rgba(18, 18, 18, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
            },
          ]}
        />
      ),
    headerShown: true,
    headerStyle,
    headerTitleStyle,
    headerTintColor: textColor,
    headerTitleAlign: 'center' as const,
  };

  return (
    <Tab.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={commonScreenOptions}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="home" 
                size={focused ? size + 2 : size} 
                color={color} 
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Feather name="home" size={22} color={primaryColor} />
              <Text style={[styles.headerTitleText, { color: textColor, marginLeft: 8 }]}>
                Dashboard Administrativo
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          title: 'Usuários',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="users" 
                size={focused ? size + 2 : size} 
                color={color} 
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Feather name="users" size={22} color={primaryColor} />
              <Text style={[styles.headerTitleText, { color: textColor, marginLeft: 8 }]}>
                Gerenciamento de Usuários
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Audit"
        component={AuditScreen}
        options={{
          title: 'Auditoria',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="file-text" 
                size={focused ? size + 2 : size} 
                color={color} 
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Feather name="file-text" size={22} color={primaryColor} />
              <Text style={[styles.headerTitleText, { color: textColor, marginLeft: 8 }]}>
                Auditoria do Sistema
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="user" 
                size={focused ? size + 2 : size} 
                color={color} 
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
  },
});