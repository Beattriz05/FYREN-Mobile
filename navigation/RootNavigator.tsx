import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

// Hooks
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

// Telas
import UserHomeScreen from '@/screens/UserHomeScreen';
import RegisterIncidentScreen from '@/screens/RegisterIncidentScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import MapScreen from '@/screens/MapScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import LoginScreen from '@/screens/LoginScreen';
import IncidentDetailScreen from '@/screens/IncidentDetailScreen';
import LoadingScreen from '@/screens/LoadingScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import UserManagementScreen from '@/screens/UserManagementScreen';
import AuditScreen from '@/screens/AuditScreen';

// Navigators (Certifique-se que estes arquivos existem em src/navigation/)
import ChiefTabNavigator from './ChiefTabNavigator';
import AdminTabNavigator from './AdminTabNavigator';

// Tipos e Componentes
import { RootStackParamList, UserHomeStackParamList } from '@/types/navigation';
import { HeaderTitle } from '@/components/HeaderTitle';

const UserTab = createBottomTabNavigator<UserHomeStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function UserTabNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <UserTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          paddingTop: 10,
          position: 'absolute',
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : null,
        headerStyle: {
          backgroundColor: isDark ? '#121212' : '#FFFFFF',
        },
        headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.text },
      }}
    >
      <UserTab.Screen
        name="Home"
        component={UserHomeScreen}
        options={{
          title: 'Início',
          headerTitle: () => <HeaderTitle title="Fyren" subtitle="CBM-PE" />,
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Feather name="home" size={size} color={color} />
            </View>
          ),
        }}
      />
      <UserTab.Screen
        name="RegisterIncident"
        component={RegisterIncidentScreen}
        options={{
          title: 'Registrar',
          headerTitle: () => <HeaderTitle title="Registrar Ocorrência" />,
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Feather name="plus-circle" size={size} color={color} />
            </View>
          ),
        }}
      />
      <UserTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          headerTitle: () => <HeaderTitle title="Histórico" />,
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Feather name="clock" size={size} color={color} />
            </View>
          ),
        }}
      />
      <UserTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Feather name="user" size={size} color={color} />
            </View>
          ),
        }}
      />
    </UserTab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
  const { colors, isDark } = useTheme();

  
  const commonStackOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: isDark ? '#121212' : '#FFFFFF',
    },
    headerTintColor: colors.text,
    // CORREÇÃO: Substituímos headerBackTitleVisible por headerBackTitle: ''
    // Isso remove o texto "Voltar" no iOS e corrige o erro de tipagem
    headerBackTitle: '', 
    contentStyle: {
      backgroundColor: isDark ? '#000000' : '#F5F5F5',
    },
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  
if (!hasCompletedOnboarding) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  const MainComponent = 
    user.role === 'admin' ? AdminTabNavigator :
    user.role === 'chief' ? ChiefTabNavigator :
    UserTabNavigator;

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
        options={{ presentation: 'modal', title: 'Mapa' }} 
      />
      <Stack.Screen
        name="IncidentDetail"
        component={IncidentDetailScreen}
        options={({ route }) => ({
          // CORREÇÃO: Verificação segura para evitar crash se params for undefined
          title: route.params?.incident?.id 
            ? `Ocorrência #${route.params.incident.id.substring(0, 8)}` 
            : 'Detalhes',
        })}
      />
      <Stack.Screen 
        name="UserManagement" 
        component={UserManagementScreen} 
        options={{ title: 'Gerenciar Usuários' }} 
      />
      <Stack.Screen 
        name="Audit" 
        component={AuditScreen} 
        options={{ title: 'Auditoria' }} 
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
});