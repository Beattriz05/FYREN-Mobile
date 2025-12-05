import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/theme';
import { getIncidents } from '@/utils/storage';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const [report, setReport] = useState({
    totalToday: 0,
    totalWeek: 0,
    totalMonth: 0,
    avgResolutionTime: '0h',
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const incidents = await getIncidents();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    setReport({
      totalToday: incidents.filter(i => new Date(i.createdAt) >= today).length,
      totalWeek: incidents.filter(i => new Date(i.createdAt) >= weekAgo).length,
      totalMonth: incidents.filter(i => new Date(i.createdAt) >= monthAgo).length,
      avgResolutionTime: '2.5h',
    });
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Relatório de Ocorrências
          </ThemedText>

          <View style={styles.reportRow}>
            <ThemedText style={[styles.label, { color: colors.tabIconDefault }]}>
              Hoje:
            </ThemedText>
            <ThemedText style={[styles.value, { color: colors.text }]}>
              {report.totalToday}
            </ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={[styles.label, { color: colors.tabIconDefault }]}>
              Últimos 7 dias:
            </ThemedText>
            <ThemedText style={[styles.value, { color: colors.text }]}>
              {report.totalWeek}
            </ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={[styles.label, { color: colors.tabIconDefault }]}>
              Último mês:
            </ThemedText>
            <ThemedText style={[styles.value, { color: colors.text }]}>
              {report.totalMonth}
            </ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={[styles.label, { color: colors.tabIconDefault }]}>
              Tempo médio de resolução:
            </ThemedText>
            <ThemedText style={[styles.value, { color: colors.text }]}>
              {report.avgResolutionTime}
            </ThemedText>
          </View>
        </Card>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  card: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
  },
});
