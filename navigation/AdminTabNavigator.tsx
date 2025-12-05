import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme'; // Agora com isDark!
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

  // Configurações do tabBar
  const tabBarConfig = {
    activeTintColor: colors.bombeiros?.primary || '#2196F3',
    inactiveTintColor: colors.textSecondary || '#757575',
    style: {
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
    },
    labelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 4,
    },
    tabStyle: {
      paddingTop: 5,
    },
  };

  return (
    <Tab.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: tabBarConfig.activeTintColor,
        tabBarInactiveTintColor: tabBarConfig.inactiveTintColor,
        tabBarStyle: tabBarConfig.style,
        tabBarLabelStyle: tabBarConfig.labelStyle,
        tabBarItemStyle: tabBarConfig.tabStyle,
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
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#333' : '#EEE',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: colors.text,
        },
        headerTintColor: colors.text,
        // Esconder header na tela de perfil
        ...(route.name === 'Profile' && {
          headerShown: false,
        }),
      })}
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
              <Feather name="home" size={22} color={colors.bombeiros?.primary} />
              <Text style={[styles.headerTitleText, { color: colors.text, marginLeft: 8 }]}>
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
              <Feather name="users" size={22} color={colors.bombeiros?.primary} />
              <Text style={[styles.headerTitleText, { color: colors.text, marginLeft: 8 }]}>
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
              <Feather name="file-text" size={22} color={colors.bombeiros?.primary} />
              <Text style={[styles.headerTitleText, { color: colors.text, marginLeft: 8 }]}>
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