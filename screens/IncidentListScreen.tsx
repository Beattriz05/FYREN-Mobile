import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { Colors, Spacing } from '@/constants/theme';
import { getIncidents, Incident } from '@/utils/storage';

export default function IncidentListScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');

  const loadData = async () => {
    const data = await getIncidents();
    // Filtro simples no front (num app real seria na API)
    if (filter === 'all') setIncidents(data);
    else setIncidents(data.filter(i => i.status === filter));
  };

  useEffect(() => { loadData(); }, [filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Cores dos status
  const getStatusColor = (status: string) => {
    if (status === 'resolved') return '#4CAF50';
    if (status === 'in_progress') return '#2196F3';
    return '#FF9800';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'resolved') return 'Resolvido';
    if (status === 'in_progress') return 'Em Andamento';
    return 'Pendente';
  };

  // Botão de Filtro (Pílula)
  const FilterPill = ({ label, value }: any) => {
    const isActive = filter === value;
    return (
      <TouchableOpacity
        style={[
          styles.filterPill,
          isActive 
            ? { backgroundColor: colors.bombeiros?.primary || Colors.bombeiros.primary }
            : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }
        ]}
        onPress={() => setFilter(value)}
      >
        <ThemedText style={{ 
          color: isActive ? '#FFF' : colors.text,
          fontWeight: isActive ? '700' : '500',
          fontSize: 13
        }}>
          {label}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: Incident }) => (
    <TouchableOpacity onPress={() => navigation.navigate('IncidentDetail', { incident: item })}>
      <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.idBadge}>
            <ThemedText style={styles.idText}>#{item.id?.substring(0,4) || '000'}</ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusLabel(item.status)}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText style={[styles.cardDesc, { color: colors.secondary }]} numberOfLines={2}>
          {item.description}
        </ThemedText>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.cardFooter}>
          <View style={styles.iconRow}>
             <Feather name="map-pin" size={14} color={colors.secondary} />
             <ThemedText style={[styles.footerText, { color: colors.secondary }]}>
               {item.location ? 'Localização Definida' : 'Sem local'}
             </ThemedText>
          </View>
          <ThemedText style={[styles.dateText, { color: colors.secondary }]}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </ThemedText>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header com Filtros Horizontais */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          <FilterPill label="Todas" value="all" />
          <FilterPill label="Pendentes" value="pending" />
          <FilterPill label="Em Andamento" value="in_progress" />
          <FilterPill label="Resolvidos" value="resolved" />
        </ScrollView>
      </View>

      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={colors.border} />
            <ThemedText style={{ marginTop: 16, color: colors.secondary }}>Nenhuma ocorrência encontrada</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterContainer: {
    paddingVertical: 12,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 100,
  },
  
  // Card Styles
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 4,
  },
  idText: { fontSize: 12, fontWeight: '700', opacity: 0.6 },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardTitle: {
    fontSize: 16, fontWeight: '700', marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14, lineHeight: 20, marginBottom: 12,
  },
  divider: { height: 1, width: '100%', marginBottom: 12 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12 },
  dateText: { fontSize: 12 },
  
  emptyContainer: {
    alignItems: 'center', justifyContent: 'center',
    paddingTop: 60,
  }
});