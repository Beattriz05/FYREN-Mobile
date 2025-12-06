import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
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
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { HeaderTitle } from '@/components/HeaderTitle';
import IncidentDetailScreen from '@/screens/IncidentDetailScreen';
import { Incident } from '@/utils/storage';
import LoadingScreen from '@/screens/LoadingScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';

type UserTabParamList = {
  UserHome: undefined;
  RegisterIncident: undefined;
  History: undefined;
  Profile: undefined;
};

const UserTab = createBottomTabNavigator<UserTabParamList>();

function UserTabNavigator() {
  const { colors, isDark } = useTheme();

  // Configurações do tabBar para usuários comuns
  const tabBarOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: colors.bombeiros?.primary || '#2196F3',
    tabBarInactiveTintColor: (colors as any).secondary || '#757575',
    tabBarStyle: {
      position: 'absolute' as const,
      backgroundColor: Platform.select({
        ios: 'transparent',
        android: isDark ? 'rgba(18, 18, 18, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      }),
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
          intensity={90}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark 
                ? 'rgba(18, 18, 18, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)',
            },
          ]}
        />
      ),
    headerShown: true,
    headerTransparent: Platform.OS === 'ios',
    headerTintColor: colors.text,
    headerTitleAlign: 'center' as const,
    headerStyle: {
      backgroundColor: Platform.select({
        ios: 'transparent',
        android: (colors as any).background || (colors as any).backgroundRoot || (isDark ? '#121212' : '#FFFFFF'),
      }),
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    headerTitleStyle: {
      fontWeight: '700' as const,
      fontSize: 18,
      color: colors.text,
    },
  };

  return (
    <UserTab.Navigator
      initialRouteName="UserHome"
      screenOptions={tabBarOptions}
    >
      <UserTab.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{
          title: 'Início',
          headerTitle: () => <HeaderTitle title="Fyren" subtitle="CBM-PE" />,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="home" size={focused ? size + 2 : size} color={color} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
        }}
      />
      <UserTab.Screen
        name="RegisterIncident"
        component={RegisterIncidentScreen}
        options={{
          title: 'Registrar',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="plus-circle" size={focused ? size + 2 : size} color={color} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => <HeaderTitle title="Registrar Ocorrência" />,
        }}
      />
      <UserTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="clock" size={focused ? size + 2 : size} color={color} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => <HeaderTitle title="Histórico de Ocorrências" />,
        }}
      />
      <UserTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="user" size={focused ? size + 2 : size} color={color} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
          headerShown: false,
        }}
      />
    </UserTab.Navigator>
  );
}

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
  Map: { incidentId?: string };
  IncidentDetail: { incident: Incident };
  Loading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
  const { colors, isDark } = useTheme();

  // Opções comuns para todas as telas do stack
  const commonStackOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: (colors as any).background || (colors as any).backgroundRoot || (isDark ? '#121212' : '#FFFFFF'),
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: '700' as const,
      fontSize: 18,
    },
    headerBackTitleVisible: false,
    contentStyle: {
      backgroundColor: (colors as any).background || (colors as any).backgroundRoot,
    },
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Se não completou onboarding, mostra tela de onboarding
  if (!hasCompletedOnboarding) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  // Se não está autenticado, mostra login
  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  // Definir componente principal baseado no papel do usuário
  const getMainComponent = () => {
    const role = user.role?.toLowerCase();
    
    if (role === 'chief' || role === 'comandante' || role === 'chefe') {
      return ChiefTabNavigator;
    }
    
    if (role === 'admin' || role === 'administrador' || role === 'administrator') {
      return AdminTabNavigator;
    }
    
    return UserTabNavigator;
  };

  const MainComponent = getMainComponent();

  return (
    <Stack.Navigator screenOptions={commonStackOptions}>
      <Stack.Screen
        name="Main"
        component={MainComponent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ 
          title: 'Mapa de Ocorrências',
          presentation: 'modal' as const,
        }}
      />
      <Stack.Screen
        name="IncidentDetail"
        component={IncidentDetailScreen}
        options={({ route }) => ({
          title: `Ocorrência #${route.params.incident.id.substring(0, 8)}`,
          headerBackTitle: 'Voltar',
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});