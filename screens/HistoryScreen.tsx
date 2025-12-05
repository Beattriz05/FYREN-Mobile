import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, FlatList, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';
import { getIncidents, Incident } from '@/utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const loadIncidents = async () => {
    const data = await getIncidents();
    setIncidents(data);
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIncidents();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'in_progress':
        return colors.info;
      case 'resolved':
        return colors.success;
      default:
        return colors.tabIconDefault;
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
    <Pressable
      onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
    >
      <Card style={styles.incidentCard}>
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            {item.title}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusLabel(item.status)}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.description, { color: colors.tabIconDefault }]} numberOfLines={2}>
          {item.description}
        </ThemedText>
        <View style={styles.footer}>
          <View style={styles.iconRow}>
            {item.location ? (
              <Feather name="map-pin" size={16} color={colors.secondary} />
            ) : null}
            {item.images && item.images.length > 0 ? (
              <Feather name="image" size={16} color={colors.secondary} />
            ) : null}
          </View>
          <ThemedText style={[styles.date, { color: colors.tabIconDefault }]}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </ThemedText>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.createdAt}-${index}`}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.secondary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={64} color={colors.tabIconDefault} />
            <ThemedText style={[styles.emptyText, { color: colors.tabIconDefault }]}>
              Nenhuma ocorrência registrada
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  date: {
    fontSize: 12,
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
