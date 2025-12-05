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
  // Agora aceita um incidente opcional para edição
  RegisterIncident: { incident?: Incident } | undefined; 
  History: undefined;
  IncidentDetail: { incident: Incident };
  Map: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<UserHomeStackParamList>();

export default function UserHomeStackNavigator() {
  const { colors, isDark } = useTheme();
  const commonOptions = getCommonScreenOptions({ colors, isDark }); 

  return (
    <Stack.Navigator screenOptions={commonOptions}>
      <Stack.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{ headerTitle: () => <HeaderTitle title="Fyren" /> }}
      />
      <Stack.Screen
        name="RegisterIncident"
        component={RegisterIncidentScreen}
        options={({ route }) => ({
          // Muda o título dinamicamente
          title: route.params?.incident ? 'Editar Ocorrência' : 'Nova Ocorrência',
        })}
      />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: 'Detalhes' }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}