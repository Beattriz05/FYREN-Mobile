import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Spacing, BorderRadius } from '@/constants/theme';
import { clearAllData } from '@/utils/storage';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'user':
        return 'Usuário';
      case 'chief':
        return 'Chefe';
      case 'admin':
        return 'Administrador';
      default:
        return role;
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: theme.secondary + '20' }]}>
            <Feather name="user" size={48} color={theme.secondary} />
          </View>
          <ThemedText style={[styles.name, { color: theme.text }]}>
            {user?.name}
          </ThemedText>
          <ThemedText style={[styles.email, { color: theme.tabIconDefault }]}>
            {user?.email}
          </ThemedText>
          <View style={[styles.roleBadge, { backgroundColor: theme.accent + '20' }]}>
            <ThemedText style={[styles.roleText, { color: theme.accent }]}>
              {getRoleLabel(user?.role || '')}
            </ThemedText>
          </View>
        </Card>

        <Card style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Configurações
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          >
            <Feather name="bell" size={20} color={theme.text} />
            <ThemedText style={[styles.menuText, { color: theme.text }]}>
              Notificações
            </ThemedText>
            <Feather name="chevron-right" size={20} color={theme.tabIconDefault} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          >
            <Feather name="lock" size={20} color={theme.text} />
            <ThemedText style={[styles.menuText, { color: theme.text }]}>
              Privacidade
            </ThemedText>
            <Feather name="chevron-right" size={20} color={theme.tabIconDefault} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          >
            <Feather name="help-circle" size={20} color={theme.text} />
            <ThemedText style={[styles.menuText, { color: theme.text }]}>
              Ajuda
            </ThemedText>
            <Feather name="chevron-right" size={20} color={theme.tabIconDefault} />
          </Pressable>
        </Card>

<Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            { backgroundColor: theme.warning, opacity: pressed ? 0.8 : 1, marginBottom: Spacing.md },
          ]}
          onPress={() => {
            Alert.alert(
              'Resetar Dados',
              'Isso apagará todas as ocorrências locais para evitar erros de compatibilidade. Continuar?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { 
                  text: 'Apagar Tudo', 
                  style: 'destructive', 
                  onPress: async () => {
                    await clearAllData();
                    Alert.alert('Pronto', 'Dados limpos! O app está pronto para a nova estrutura.');
                  }
                },
              ]
            );
          }}
        >
          <Feather name="trash-2" size={20} color={theme.textLight} />
          <ThemedText style={[styles.logoutText, { color: theme.textLight }]}>
            Resetar Dados (Dev)
          </ThemedText>
        </Pressable>
        
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            { backgroundColor: theme.error, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={theme.textLight} />
          <ThemedText style={[styles.logoutText, { color: theme.textLight }]}>
            Sair
          </ThemedText>
        </Pressable>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  profileCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  email: {
    fontSize: 16,
  },
  roleBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
