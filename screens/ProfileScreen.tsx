import React from 'react';
import { View, StyleSheet, Pressable, Alert, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Spacing, BorderRadius } from '@/constants/theme';
import { clearAllData } from '@/utils/storage';

export default function ProfileScreen() {
  const { theme, themeMode, setThemeMode, isHighContrast, setHighContrast, fontScale, setFontScale } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'user': return 'Usuário';
      case 'chief': return 'Chefe';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: theme.secondary + '20' }]}>
            <Feather name="user" size={48} color={theme.secondary} />
          </View>
          <ThemedText style={[styles.name, { color: theme.text }]}>{user?.name}</ThemedText>
          <ThemedText style={[styles.email, { color: theme.tabIconDefault }]}>{user?.email}</ThemedText>
          <View style={[styles.roleBadge, { backgroundColor: theme.accent + '20' }]}>
            <ThemedText style={[styles.roleText, { color: theme.accent }]}>{getRoleLabel(user?.role || '')}</ThemedText>
          </View>
        </Card>

        {/* F-15: Acessibilidade e Aparência */}
        <Card style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Aparência e Acessibilidade</ThemedText>

          {/* Tema */}
          <View style={styles.settingRow}>
            <ThemedText>Tema do App</ThemedText>
            <View style={styles.themeSelector}>
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <Pressable
                  key={mode}
                  style={[
                    styles.modeButton,
                    { 
                      backgroundColor: themeMode === mode ? theme.secondary : theme.backgroundRoot,
                      borderColor: theme.border 
                    }
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Feather 
                    name={mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'smartphone'} 
                    size={16} 
                    color={themeMode === mode ? theme.textLight : theme.text} 
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Alto Contraste */}
          <View style={styles.settingRow}>
            <View>
              <ThemedText>Alto Contraste</ThemedText>
              <ThemedText type="small" style={{ opacity: 0.7 }}>Melhora legibilidade</ThemedText>
            </View>
            <Switch
              value={isHighContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: theme.backgroundRoot, true: theme.secondary }}
              thumbColor={theme.textLight}
            />
          </View>

          {/* Tamanho da Fonte */}
          <View style={styles.settingRow}>
            <View>
              <ThemedText>Tamanho da Fonte</ThemedText>
              <ThemedText type="small" style={{ opacity: 0.7 }}>Escala: {(fontScale * 100).toFixed(0)}%</ThemedText>
            </View>
            <View style={styles.fontControls}>
              <Pressable 
                onPress={() => setFontScale(Math.max(0.8, fontScale - 0.1))}
                style={[styles.fontBtn, { backgroundColor: theme.backgroundRoot }]}
              >
                <Feather name="minus" size={16} color={theme.text} />
              </Pressable>
              <Pressable 
                onPress={() => setFontScale(Math.min(1.5, fontScale + 0.1))}
                style={[styles.fontBtn, { backgroundColor: theme.backgroundRoot }]}
              >
                <Feather name="plus" size={16} color={theme.text} />
              </Pressable>
            </View>
          </View>
        </Card>

        {/* Configurações Gerais */}
        <Card style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Sistema</ThemedText>
          <Pressable
            style={({ pressed }) => [styles.menuItem, { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 }]}
            onPress={() => Alert.alert('Info', 'Versão 1.0.0 (M1)')}
          >
            <Feather name="info" size={20} color={theme.text} />
            <ThemedText style={styles.menuText}>Sobre</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.tabIconDefault} />
          </Pressable>
        </Card>

        {/* Botão Resetar Dados (Mantido) */}
        <Pressable
          style={({ pressed }) => [styles.logoutButton, { backgroundColor: theme.warning, opacity: pressed ? 0.8 : 1, marginBottom: Spacing.md }]}
          onPress={() => {
            Alert.alert('Resetar Dados', 'Apagar tudo?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Apagar', style: 'destructive', onPress: async () => { await clearAllData(); Alert.alert('Pronto!'); }}
            ]);
          }}
        >
          <Feather name="trash-2" size={20} color={theme.textLight} />
          <ThemedText style={[styles.logoutText, { color: theme.textLight }]}>Resetar Dados (Dev)</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.logoutButton, { backgroundColor: theme.error, opacity: pressed ? 0.8 : 1 }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={theme.textLight} />
          <ThemedText style={[styles.logoutText, { color: theme.textLight }]}>Sair</ThemedText>
        </Pressable>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, gap: Spacing.lg },
  profileCard: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.md },
  avatar: { width: 96, height: 96, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 24, fontWeight: '700' },
  email: { fontSize: 16 },
  roleBadge: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.xs },
  roleText: { fontSize: 14, fontWeight: '600' },
  section: { padding: Spacing.lg, gap: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg, borderRadius: BorderRadius.sm },
  menuText: { fontSize: 16, flex: 1 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md, height: Spacing.buttonHeight, borderRadius: BorderRadius.sm },
  logoutText: { fontSize: 18, fontWeight: '600' },
  // Novos Estilos para Acessibilidade
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  themeSelector: { flexDirection: 'row', gap: 8 },
  modeButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  fontControls: { flexDirection: 'row', gap: 12 },
  fontBtn: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});