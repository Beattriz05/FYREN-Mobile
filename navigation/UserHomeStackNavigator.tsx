// navigation/UserHomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoryScreen from '@/screens/HistoryScreen';
import IncidentDetailScreen from '@/screens/IncidentDetailScreen';
import UserHomeScreen from '@/screens/UserHomeScreen';
import RegisterIncidentScreen from '@/screens/RegisterIncidentScreen';
import { Incident } from '@/utils/storage';
import { HeaderTitle } from '@/components/HeaderTitle';
import { useTheme } from '@/hooks/useTheme';

// Exporte o tipo dos parâmetros
export type UserHomeStackParamList = {
  Home: undefined;
  History: undefined;
  IncidentDetail: { incident: Incident };
  RegisterIncident: { incident?: Incident };
};

const Stack = createNativeStackNavigator<UserHomeStackParamList>();

export default function UserHomeStackNavigator() {
  const { colors } = useTheme();

  // Use cores que existem no seu tema
  const headerBackgroundColor =
    colors.backgroundRoot || colors.backgroundDefault || '#FFFFFF';
  const contentBackgroundColor =
    colors.backgroundRoot || colors.backgroundDefault || '#FFFFFF';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: contentBackgroundColor,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={UserHomeScreen}
        options={{
          headerShown: false, // Tela Home geralmente não tem header
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerTitle: () => (
            <HeaderTitle
              title="Histórico"
              subtitle="Ocorrências registradas"
              icon="list"
            />
          ),
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="IncidentDetail"
        component={IncidentDetailScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <HeaderTitle
              title="Detalhes"
              subtitle={route.params.incident.title}
              icon="alert-circle"
            />
          ),
          headerBackTitle: 'Voltar',
        })}
      />
      <Stack.Screen
        name="RegisterIncident"
        component={RegisterIncidentScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <HeaderTitle
              title={
                route.params?.incident ? 'Editar Ocorrência' : 'Nova Ocorrência'
              }
              subtitle="Registro de ocorrência"
              icon="edit-3"
            />
          ),
          headerBackTitle: 'Voltar',
        })}
      />
    </Stack.Navigator>
  );
}
