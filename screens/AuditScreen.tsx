import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'Ocorrência criada: "Vazamento na tubulação"',
    user: 'João Silva',
    timestamp: new Date().toISOString(),
    type: 'create',
  },
  {
    id: '2',
    action: 'Status atualizado para "Em Andamento"',
    user: 'Maria Santos',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'update',
  },
  {
    id: '3',
    action: 'Usuário ativado: Pedro Costa',
    user: 'Admin Fyren',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'update',
  },
];

export default function AuditScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'create':
        return 'plus-circle';
      case 'update':
        return 'edit-2';
      case 'delete':
        return 'trash-2';
      default:
        return 'activity';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'create':
        return colors.success;
      case 'update':
        return colors.info;
      case 'delete':
        return colors.error;
      default:
        return colors.tabIconDefault;
    }
  };

  const renderItem = ({ item }: { item: AuditLog }) => (
    <Card style={styles.logCard}>
      <View style={styles.logHeader}>
        <View style={[styles.iconCircle, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <Feather
            name={getTypeIcon(item.type) as any}
            size={20}
            color={getTypeColor(item.type)}
          />
        </View>
        <View style={styles.logContent}>
          <ThemedText style={[styles.logAction, { color: colors.text }]}>
            {item.action}
          </ThemedText>
          <ThemedText style={[styles.logUser, { color: colors.tabIconDefault }]}>
            Por: {item.user}
          </ThemedText>
          <ThemedText style={[styles.logTime, { color: colors.tabIconDefault }]}>
            {new Date(item.timestamp).toLocaleString('pt-BR')}
          </ThemedText>
        </View>
      </View>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={mockAuditLogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
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
    gap: Spacing.md,
  },
  logCard: {
    padding: Spacing.lg,
  },
  logHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  logAction: {
    fontSize: 16,
    fontWeight: '600',
  },
  logUser: {
    fontSize: 14,
  },
  logTime: {
    fontSize: 12,
  },
});
