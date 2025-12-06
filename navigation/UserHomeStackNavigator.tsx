// navigation/UserHomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoryScreen from '@/screens/HistoryScreen';
import IncidentDetailScreen from '@/screens/IncidentDetailScreen'; // Você precisa criar esta tela
import UserHomeScreen from '@/screens/UserHomeScreen';
import { Incident } from '@/utils/storage';
import { HeaderTitle } from '@/components/HeaderTitle';
import { useTheme } from '@/hooks/useTheme';

// Exporte o tipo dos parâmetros
export type UserHomeStackParamList = {
  Home: undefined;
  History: undefined;
  IncidentDetail: { incident: Incident };
  // Adicione outras rotas conforme necessário
};

const Stack = createNativeStackNavigator<UserHomeStackParamList>();

export default function UserHomeStackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <HeaderTitle
              title="Início"
              subtitle="Painel principal"
              icon="home"
            />
          ),
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
          headerBackTitle: "Voltar",
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
          headerBackTitle: "Voltar",
        })}
      />
    </Stack.Navigator>
  );
}