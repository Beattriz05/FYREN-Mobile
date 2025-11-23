import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, FlatList, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { getIncidents, Incident, updateIncident } from '@/utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChiefTabParamList } from '@/navigation/ChiefTabNavigator';

type Props = NativeStackScreenProps<ChiefTabParamList, 'IncidentList'>;

export default function IncidentListScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    loadIncidents();
  }, [filter]);

  const loadIncidents = async () => {
    const data = await getIncidents();
    const filtered = filter === 'all' ? data : data.filter(i => i.status === filter);
    setIncidents(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIncidents();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (incident: Incident, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    if (incident.id) {
      await updateIncident(incident.id, { status: newStatus });
      await loadIncidents();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.warning;
      case 'in_progress':
        return theme.info;
      case 'resolved':
        return theme.success;
      default:
        return theme.tabIconDefault;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'resolved':
        return 'Resolvido';
      default:
        return status;
    }
  };

  const renderItem = ({ item }: { item: Incident }) => (
    <Card style={styles.incidentCard}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: theme.text }]}>
          {item.title}
        </ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={[styles.description, { color: theme.tabIconDefault }]} numberOfLines={2}>
        {item.description}
      </ThemedText>
      <View style={styles.actions}>
        {item.status !== 'in_progress' ? (
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: theme.info + '20', opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => handleStatusUpdate(item, 'in_progress')}
          >
            <ThemedText style={[styles.actionBtnText, { color: theme.info }]}>
              Iniciar
            </ThemedText>
          </Pressable>
        ) : null}
        {item.status !== 'resolved' ? (
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: theme.success + '20', opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => handleStatusUpdate(item, 'resolved')}
          >
            <ThemedText style={[styles.actionBtnText, { color: theme.success }]}>
              Resolver
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.filterContainer, { backgroundColor: theme.card }]}>
        <Pressable
          style={({ pressed }) => [
            styles.filterBtn,
            filter === 'all' && { backgroundColor: theme.secondary },
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => setFilter('all')}
        >
          <ThemedText style={[styles.filterText, { color: filter === 'all' ? theme.textLight : theme.text }]}>
            Todas
          </ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.filterBtn,
            filter === 'pending' && { backgroundColor: theme.warning },
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => setFilter('pending')}
        >
          <ThemedText style={[styles.filterText, { color: filter === 'pending' ? theme.textLight : theme.text }]}>
            Pendentes
          </ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.filterBtn,
            filter === 'in_progress' && { backgroundColor: theme.info },
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => setFilter('in_progress')}
        >
          <ThemedText style={[styles.filterText, { color: filter === 'in_progress' ? theme.textLight : theme.text }]}>
            Andamento
          </ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.filterBtn,
            filter === 'resolved' && { backgroundColor: theme.success },
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => setFilter('resolved')}
        >
          <ThemedText style={[styles.filterText, { color: filter === 'resolved' ? theme.textLight : theme.text }]}>
            Resolvidos
          </ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.createdAt}-${index}`}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.secondary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={64} color={theme.tabIconDefault} />
            <ThemedText style={[styles.emptyText, { color: theme.tabIconDefault }]}>
              Nenhuma ocorrência encontrada
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  incidentCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['5xl'],
    gap: Spacing.lg,
  },
  emptyText: {
    fontSize: 16,
  },
});
