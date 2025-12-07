import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { getIncidents } from '@/utils/storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChiefTabParamList } from '@/navigation/ChiefTabNavigator';

type Props = NativeStackScreenProps<ChiefTabParamList, 'ChiefDashboard'>;

export default function ChiefDashboardScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const incidents = await getIncidents();
    setStats({
      total: incidents.length,
      pending: incidents.filter((i) => i.status === 'pending').length,
      inProgress: incidents.filter((i) => i.status === 'in_progress').length,
      resolved: incidents.filter((i) => i.status === 'resolved').length,
    });
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <Card style={styles.welcomeCard}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Dashboard do Chefe
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: colors.tabIconDefault }]}
          >
            Visão geral das ocorrências
          </ThemedText>
        </Card>

        <View style={styles.statsGrid}>
          <Card
            style={StyleSheet.flatten([
              styles.statCard,
              { borderLeftColor: colors.secondary, borderLeftWidth: 4 },
            ])}
          >
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {stats.total}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: colors.tabIconDefault }]}
            >
              Total
            </ThemedText>
          </Card>

          <Card
            style={StyleSheet.flatten([
              styles.statCard,
              { borderLeftColor: colors.warning, borderLeftWidth: 4 },
            ])}
          >
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {stats.pending}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: colors.tabIconDefault }]}
            >
              Pendentes
            </ThemedText>
          </Card>

          <Card
            style={StyleSheet.flatten([
              styles.statCard,
              { borderLeftColor: colors.info, borderLeftWidth: 4 },
            ])}
          >
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {stats.inProgress}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: colors.tabIconDefault }]}
            >
              Em Andamento
            </ThemedText>
          </Card>

          <Card
            style={StyleSheet.flatten([
              styles.statCard,
              { borderLeftColor: colors.success, borderLeftWidth: 4 },
            ])}
          >
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {stats.resolved}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: colors.tabIconDefault }]}
            >
              Resolvidos
            </ThemedText>
          </Card>
        </View>

        <Card style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Ações Rápidas
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.backgroundDefault,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => navigation.navigate('IncidentList')}
          >
            <Feather name="list" size={24} color={colors.secondary} />
            <ThemedText style={[styles.actionText, { color: colors.text }]}>
              Ver Todas as Ocorrências
            </ThemedText>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.tabIconDefault}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.backgroundDefault,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => navigation.navigate('Reports')}
          >
            <Feather name="bar-chart-2" size={24} color={colors.accent} />
            <ThemedText style={[styles.actionText, { color: colors.text }]}>
              Relatórios
            </ThemedText>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.tabIconDefault}
            />
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
