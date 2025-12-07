import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { getUsers, updateUser, AppUser } from '@/utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function UserManagementScreen() {
  const { colors } = useTheme();
  const [users, setUsers] = useState<AppUser[]>([]);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const toggleUserStatus = async (user: AppUser) => {
    Alert.alert(
      user.active ? 'Desativar Usuário' : 'Ativar Usuário',
      `Deseja ${user.active ? 'desativar' : 'ativar'} ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await updateUser(user.id, { active: !user.active });
            await loadUsers();
          },
        },
      ],
    );
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'user':
        return 'Usuário';
      case 'chief':
        return 'Chefe';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user':
        return colors.info;
      case 'chief':
        return colors.secondary;
      case 'admin':
        return colors.error;
      default:
        return colors.tabIconDefault;
    }
  };

  const renderItem = ({ item }: { item: AppUser }) => (
    <Card style={styles.userCard}>
      <View style={styles.userHeader}>
        <View
          style={[styles.avatar, { backgroundColor: colors.secondary + '20' }]}
        >
          <Feather name="user" size={24} color={colors.secondary} />
        </View>
        <View style={styles.userInfo}>
          <ThemedText style={[styles.userName, { color: colors.text }]}>
            {item.name}
          </ThemedText>
          <ThemedText
            style={[styles.userEmail, { color: colors.tabIconDefault }]}
          >
            {item.email}
          </ThemedText>
        </View>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(item.role) + '20' },
          ]}
        >
          <ThemedText
            style={[styles.roleText, { color: getRoleColor(item.role) }]}
          >
            {getRoleLabel(item.role)}
          </ThemedText>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.statusButton,
          {
            backgroundColor: item.active
              ? colors.error + '20'
              : colors.success + '20',
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        onPress={() => toggleUserStatus(item)}
      >
        <ThemedText
          style={[
            styles.statusText,
            { color: item.active ? colors.error : colors.success },
          ]}
        >
          {item.active ? 'Desativar' : 'Ativar'}
        </ThemedText>
      </Pressable>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={users}
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
    gap: Spacing.lg,
  },
  userCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
  },
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
