import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { getCommonScreenOptions } from '@/navigation/screenOptions';
import UserHomeScreen from '@/screens/UserHomeScreen';
import RegisterIncidentScreen from '@/screens/RegisterIncidentScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import IncidentDetailScreen from '@/screens/IncidentDetailScreen';
import MapScreen from '@/screens/MapScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { HeaderTitle } from '@/components/HeaderTitle';
import { Incident } from '@/utils/storage';

export type UserHomeStackParamList = {
  UserHome: undefined;
  RegisterIncident: undefined;
  History: undefined;
  IncidentDetail: { incident: Incident };
  Map: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<UserHomeStackParamList>();

export default function UserHomeStackNavigator() {
  const { theme, isDark } = useTheme();
  const commonOptions = getCommonScreenOptions({ theme, isDark });

  return (
    <Stack.Navigator screenOptions={commonOptions}>
      <Stack.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Fyren" />,
        }}
      />
      <Stack.Screen
        name="RegisterIncident"
        component={RegisterIncidentScreen}
        options={{
          title: 'Nova Ocorrência',
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
        }}
      />
      <Stack.Screen
        name="IncidentDetail"
        component={IncidentDetailScreen}
        options={{
          title: 'Detalhes da Ocorrência',
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Mapa',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
        }}
      />
    </Stack.Navigator>
  );
}
