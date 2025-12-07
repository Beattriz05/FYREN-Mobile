// screens/UserHomeScreen.tsx
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';

// Define as props da tela
type Props = NativeStackScreenProps<UserHomeStackParamList, 'Home'>;

export default function UserHomeScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const menuItems = [
    {
      title: 'Nova Ocorrência',
      subtitle: 'Registrar nova ocorrência',
      icon: 'plus-circle' as const,
      color: colors.primary,
      onPress: () => navigation.navigate('RegisterIncident'),
    },
    {
      title: 'Histórico',
      subtitle: 'Ver ocorrências registradas',
      icon: 'list' as const,
      color: colors.secondary,
      onPress: () => navigation.navigate('History'),
    },
    {
      title: 'Sincronizar',
      subtitle: 'Enviar dados para nuvem',
      icon: 'cloud-upload' as const,
      color: colors.accent,
      onPress: () => {
        // Adicione função de sincronização aqui
        console.log('Sincronizar');
      },
    },
    {
      title: 'Configurações',
      subtitle: 'Ajustes do aplicativo',
      icon: 'settings' as const,
      color: colors.text,
      onPress: () => {
        // Adicione navegação para configurações aqui
        console.log('Configurações');
      },
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundRoot }]}
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.welcomeTitle}>
          Bem-vindo!
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.welcomeSubtitle, { color: colors.textLight }]}
        >
          O que você gostaria de fazer?
        </ThemedText>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={item.onPress}
          >
            <Card
              style={[
                styles.card,
                { borderLeftColor: item.color, borderLeftWidth: 4 },
              ]}
            >
              <View style={styles.menuContent}>
                <Feather name={item.icon} size={32} color={item.color} />
                <View style={styles.menuText}>
                  <ThemedText type="h4" style={styles.menuTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText
                    type="caption"
                    style={[styles.menuSubtitle, { color: colors.textLight }]}
                  >
                    {item.subtitle}
                  </ThemedText>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={colors.tabIconDefault}
                />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <ThemedText
          type="caption"
          style={[styles.footerText, { color: colors.tabIconDefault }]}
        >
          Versão 1.0.0 • Última sincronização: Hoje, 10:30
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  menuGrid: {
    gap: Spacing.lg,
  },
  menuItem: {
    borderRadius: BorderRadius.lg,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
  },
  footer: {
    marginTop: Spacing['3xl'],
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
  },
});
