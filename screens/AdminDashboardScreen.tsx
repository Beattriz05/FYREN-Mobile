import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { getUsers, getIncidents } from '@/utils/storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminTabParamList } from '@/navigation/AdminTabNavigator';

type Props = NativeStackScreenProps<AdminTabParamList, 'AdminDashboard'>;

export default function AdminDashboardScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [stats, setStats] = useState({ users: 0, incidents: 0, activeUsers: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const users = await getUsers();
    const incidents = await getIncidents();
    setStats({
      users: users.length,
      activeUsers: users.filter(u => u.active).length,
      incidents: incidents.length,
    });
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <Card style={styles.welcomeCard}>
          <ThemedText style={[styles.title, { color: theme.text }]}>
            Painel Administrativo
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.tabIconDefault }]}>
            Gestão do sistema Fyren
          </ThemedText>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={StyleSheet.flatten([styles.statCard, { borderLeftColor: theme.secondary, borderLeftWidth: 4 }])}>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {stats.users}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
              Total de Usuários
            </ThemedText>
          </Card>

          <Card style={StyleSheet.flatten([styles.statCard, { borderLeftColor: theme.success, borderLeftWidth: 4 }])}>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {stats.activeUsers}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
              Usuários Ativos
            </ThemedText>
          </Card>

          <Card style={StyleSheet.flatten([styles.statCard, { borderLeftColor: theme.accent, borderLeftWidth: 4 }])}>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {stats.incidents}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
              Total de Ocorrências
            </ThemedText>
          </Card>
        </View>

        <Card style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Ações Administrativas
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Feather name="users" size={24} color={theme.secondary} />
            <ThemedText style={[styles.actionText, { color: theme.text }]}>
              Gestão de Usuários
            </ThemedText>
            <Feather name="chevron-right" size={20} color={theme.tabIconDefault} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => navigation.navigate('Audit')}
          >
            <Feather name="file-text" size={24} color={theme.accent} />
            <ThemedText style={[styles.actionText, { color: theme.text }]}>
              Auditoria do Sistema
            </ThemedText>
            <Feather name="chevron-right" size={20} color={theme.tabIconDefault} />
          </Pressable>
        </Card>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  welcomeCard: {
    padding: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  statsGrid: {
    gap: Spacing.md,
  },
  statCard: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  actionText: {
    fontSize: 16,
    flex: 1,
  },
});
