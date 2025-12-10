import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/theme';

export default function AdminDashboardScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    incidents: 0,
  });

  useEffect(() => {
    // Simulação de dados (Substitua por sua chamada de API real)
    setStats({ users: 15, activeUsers: 12, incidents: 42 });
  }, []);

  // --- COMPONENTE INTERNO: CARTÃO DE ESTATÍSTICA ---
  const StatCard = ({ label, value, icon, color }: any) => {
    // Ajuste de contraste para o fundo do ícone
    // Se for Dark Mode, usamos 25% de opacidade. Se for Light, 15%.
    const iconBgOpacity = isDark ? '40' : '20'; // Hex opacity: 40 = ~25%, 20 = ~12%
    
    return (
      <Card style={[styles.statCard, { borderLeftColor: color }]}>
        <View style={styles.statContent}>
          <View style={styles.textWrapper}>
            {/* CORREÇÃO DO NÚMERO CORTADO: lineHeight ajustado */}
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {value}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.secondary }]}>
              {label}
            </ThemedText>
          </View>
          
          {/* CORREÇÃO DO ÍCONE ESCURO: Opacidade dinâmica */}
          <View style={[styles.iconBox, { backgroundColor: color + iconBgOpacity }]}>
             <Feather name={icon} size={24} color={color} />
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* HEADER */}
        <View style={styles.header}>
          <MaterialIcons name="admin-panel-settings" size={32} color={colors.primary} />
          <View style={{marginLeft: 12}}>
            <ThemedText type="title" style={{ fontSize: 22 }}>
              Painel Administrativo
            </ThemedText>
            <ThemedText style={{ color: colors.secondary, fontSize: 14 }}>
              Gestão do sistema Fyren
            </ThemedText>
          </View>
        </View>

        {/* GRID DE ESTATÍSTICAS */}
        <View style={styles.statsGrid}>
          <StatCard 
            label="Total de Usuários" 
            value={stats.users} 
            icon="users" 
            color="#FF9800" // Laranja
          />
          <StatCard 
            label="Usuários Ativos" 
            value={stats.activeUsers} 
            icon="user-check" 
            color="#00C853" // Verde
          />
          <StatCard 
            label="Total de Ocorrências" 
            value={stats.incidents} 
            icon="file-text" 
            color="#2D74FF" // Azul
          />
        </View>

        {/* SEÇÃO DE AÇÕES */}
        <ThemedText style={styles.sectionTitle}>Ações Administrativas</ThemedText>
        
        <Card style={styles.actionCard}>
          {/* Botão Gestão de Usuários */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { 
                opacity: pressed ? 0.7 : 1, 
                borderBottomWidth: 1, 
                borderBottomColor: colors.border 
              }
            ]}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <View style={[
              styles.actionIcon, 
              { backgroundColor: isDark ? 'rgba(255,152,0,0.25)' : 'rgba(255,152,0,0.1)' }
            ]}>
              <Feather name="users" size={20} color="#FF9800" />
            </View>
            <View style={styles.actionTextContainer}>
              <ThemedText style={styles.actionTitle}>Gestão de Usuários</ThemedText>
              <ThemedText style={styles.actionDesc}>Adicionar, remover ou editar</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={colors.tabIconDefault} />
          </Pressable>

          {/* Botão Auditoria */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={() => navigation.navigate('Audit')}
          >
            <View style={[
              styles.actionIcon, 
              { backgroundColor: isDark ? 'rgba(45,116,255,0.25)' : 'rgba(45,116,255,0.1)' }
            ]}>
              <Feather name="activity" size={20} color="#2D74FF" />
            </View>
            <View style={styles.actionTextContainer}>
              <ThemedText style={styles.actionTitle}>Auditoria do Sistema</ThemedText>
              <ThemedText style={styles.actionDesc}>Logs de atividades recentes</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={colors.tabIconDefault} />
          </Pressable>
        </Card>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: { 
    padding: Spacing.lg, 
    paddingBottom: 100, // Espaço extra para não ficar atrás da TabBar
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  
  // Grid
  statsGrid: { 
    gap: 12, 
    marginBottom: 24 
  },
  
  // Stat Card
  statCard: {
    padding: 16,
    borderLeftWidth: 4,
    // Remover altura fixa para evitar cortes
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 28, 
    fontWeight: '700',
    // IMPORTANTE: lineHeight maior que fontSize evita cortes (ex: em 'g', 'j' ou números grandes)
    lineHeight: 34, 
    marginBottom: 4,
  },
  statLabel: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
  iconBox: {
    width: 48, 
    height: 48,
    borderRadius: 24,
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 12,
  },

  // Actions
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  actionCard: { 
    padding: 0, 
    overflow: 'hidden' 
  },
  actionButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16,
  },
  actionIcon: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextContainer: { 
    flex: 1 
  },
  actionTitle: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  actionDesc: { 
    fontSize: 12, 
    opacity: 0.6, 
    marginTop: 2 
  },
});