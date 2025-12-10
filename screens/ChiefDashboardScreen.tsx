import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { getIncidents } from '@/utils/storage';

export default function ChiefDashboardScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock de dados (substitua pela lógica real depois)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const loadData = async () => {
    const data = await getIncidents();
    setStats({
      total: data.length,
      pending: data.filter(i => i.status === 'pending').length,
      inProgress: data.filter(i => i.status === 'in_progress').length,
      resolved: data.filter(i => i.status === 'resolved').length,
    });
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Componente de Card de Estatística Pequeno
  const StatCard = ({ label, value, icon, color, onPress }: any) => (
    <TouchableOpacity 
      style={[styles.statCardWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <View>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        <ThemedText style={[styles.statLabel, { color: colors.secondary }]}>{label}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header Fixo */}
      <View style={[styles.header, { backgroundColor: colors.backgroundRoot }]}>
        <View>
          <ThemedText style={styles.greeting}>Olá, Comandante</ThemedText>
          <ThemedText type="title" style={styles.userName}>{user?.name}</ThemedText>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
           <View style={[styles.profileBtn, { backgroundColor: colors.card }]}>
             <Feather name="user" size={24} color={colors.primary} />
           </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        
        {/* Grid de Estatísticas */}
        <ThemedText style={styles.sectionTitle}>Visão Geral</ThemedText>
        <View style={styles.gridContainer}>
          <StatCard 
            label="Total" 
            value={stats.total} 
            icon="layers" 
            color={colors.text}
            onPress={() => navigation.navigate('IncidentList')} 
          />
          <StatCard 
            label="Pendentes" 
            value={stats.pending} 
            icon="clock" 
            color="#FF9800" // Laranja Warning
            onPress={() => navigation.navigate('IncidentList', { filter: 'pending' })} 
          />
          <StatCard 
            label="Em Andamento" 
            value={stats.inProgress} 
            icon="activity" 
            color="#2196F3" // Azul Info
            onPress={() => navigation.navigate('IncidentList', { filter: 'in_progress' })} 
          />
          <StatCard 
            label="Resolvidos" 
            value={stats.resolved} 
            icon="check-circle" 
            color="#4CAF50" // Verde Success
            onPress={() => navigation.navigate('IncidentList', { filter: 'resolved' })} 
          />
        </View>

        {/* Ações Rápidas */}
        <ThemedText style={styles.sectionTitle}>Ações de Comando</ThemedText>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.bigButton, { backgroundColor: colors.bombeiros?.primary }]}
            onPress={() => navigation.navigate('IncidentList')}
          >
            <View style={styles.bigButtonContent}>
              <MaterialIcons name="view-list" size={32} color="#FFF" />
              <View style={{marginLeft: 12}}>
                <ThemedText style={styles.bigButtonTitle}>Gerenciar Ocorrências</ThemedText>
                <ThemedText style={styles.bigButtonSubtitle}>Visualizar e despachar equipes</ThemedText>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.bigButton, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Reports')}
          >
            <View style={styles.bigButtonContent}>
              <MaterialIcons name="assessment" size={32} color={colors.primary} />
              <View style={{marginLeft: 12}}>
                <ThemedText style={[styles.bigButtonTitle, { color: colors.text }]}>Relatórios</ThemedText>
                <ThemedText style={[styles.bigButtonSubtitle, { color: colors.secondary }]}>Estatísticas operacionais</ThemedText>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>

        {/* Dica do dia ou Aviso */}
        <Card style={[styles.infoCard, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
           <Feather name="info" size={20} color={Colors.light.accent} />
           <ThemedText style={[styles.infoText, { color: colors.text }]}>
             Toque nos cards acima para filtrar a lista de ocorrências automaticamente.
           </ThemedText>
        </Card>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 14, opacity: 0.8 },
  userName: { fontSize: 24, fontWeight: 'bold' },
  profileBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)'
  },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  sectionTitle: {
    fontSize: 18, fontWeight: '700',
    marginBottom: 12, marginTop: 8,
  },
  
  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCardWrapper: {
    width: '48%', // Quase metade da tela
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 36, height: 36,
    borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, fontWeight: '500' },

  // Big Buttons
  actionsContainer: { gap: 12, marginBottom: 24 },
  bigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bigButtonContent: { flexDirection: 'row', alignItems: 'center' },
  bigButtonTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  bigButtonSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 0,
  },
  infoText: { fontSize: 13, flex: 1 },
});