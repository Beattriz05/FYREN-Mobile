import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useScreenInsets } from '@/hooks/useScreenInsets'; // Importando hook de insets

export default function UserHomeScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets(); // Hook para pegar áreas seguras

  // Componente de Botão do Menu Padronizado
  const MenuButton = ({ title, icon, color, onPress, style }: any) => (
    <TouchableOpacity
      style={[
        styles.menuButton,
        { 
          backgroundColor: colors.card, 
          borderColor: colors.border,
          borderLeftColor: color // Cor da faixa lateral
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer, 
        { borderColor: color, borderWidth: 2 } 
      ]}>
        <Feather name={icon} size={24} color={isDark ? '#FFF' : color} />
      </View>

      <View style={styles.textContainer}>
        <ThemedText style={styles.buttonTitle}>{title}</ThemedText>
      </View>

      <Feather name="chevron-right" size={24} color={colors.tabIconDefault} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 60 } // Correção do corte: Inset + margem
        ]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* HEADER LIMPO (Sem ícone) */}
        <View style={styles.header}>
          <ThemedText style={[styles.welcomeTitle, { color: colors.text }]}>
            Bem-vindo, {user?.name?.split(' ')[0]}!
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.text }]}>
            O que você gostaria de fazer hoje?
          </ThemedText>
        </View>

        {/* LISTA DE OPÇÕES */}
        <View style={styles.menuContainer}>
          <MenuButton 
            title="Nova Ocorrência" 
            icon="plus" 
            color="#0E2345" 
            onPress={() => navigation.navigate('RegisterIncident')}
          />

          <MenuButton 
            title="Histórico" 
            icon="clock" 
            color="#FF7A00" 
            onPress={() => navigation.navigate('History')}
          />

          <MenuButton 
            title="Configurações" 
            icon="settings" 
            color="#475569" 
            onPress={() => navigation.navigate('Profile')}
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <ThemedText style={[styles.versionText, { color: colors.tabIconDefault }]}>
            Versão 1.0.0 • CBM-PE
          </ThemedText>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.8,
  },
  menuContainer: {
    gap: 16,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
  },
});