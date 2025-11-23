import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Spacing, BorderRadius } from '@/constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'UserHome'>;

export default function UserHomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <Card style={styles.welcomeCard}>
          <ThemedText style={[styles.welcome, { color: theme.text }]}>
            Olá, {user?.name}!
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.tabIconDefault }]}>
            Bem-vindo ao Fyren
          </ThemedText>
        </Card>

        <View style={styles.actionsGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.card, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => navigation.navigate('RegisterIncident')}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.secondary + '20' }]}>
              <Feather name="alert-circle" size={32} color={theme.secondary} />
            </View>
            <ThemedText style={[styles.actionTitle, { color: theme.text }]}>
              Nova Ocorrência
            </ThemedText>
            <ThemedText style={[styles.actionDesc, { color: theme.tabIconDefault }]}>
              Registrar um novo incidente
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.card, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => navigation.navigate('History')}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
              <Feather name="clock" size={32} color={theme.accent} />
            </View>
            <ThemedText style={[styles.actionTitle, { color: theme.text }]}>
              Histórico
            </ThemedText>
            <ThemedText style={[styles.actionDesc, { color: theme.tabIconDefault }]}>
              Ver ocorrências anteriores
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.card, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.success + '20' }]}>
              <Feather name="map" size={32} color={theme.success} />
            </View>
            <ThemedText style={[styles.actionTitle, { color: theme.text }]}>
              Mapa
            </ThemedText>
            <ThemedText style={[styles.actionDesc, { color: theme.tabIconDefault }]}>
              Ver incidentes no mapa
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.card, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.tabIconDefault + '20' }]}>
              <Feather name="user" size={32} color={theme.tabIconDefault} />
            </View>
            <ThemedText style={[styles.actionTitle, { color: theme.text }]}>
              Perfil
            </ThemedText>
            <ThemedText style={[styles.actionDesc, { color: theme.tabIconDefault }]}>
              Configurações da conta
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  welcomeCard: {
    padding: Spacing.xl,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  actionsGrid: {
    gap: Spacing.lg,
  },
  actionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionDesc: {
    fontSize: 14,
  },
});
