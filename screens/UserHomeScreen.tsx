import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function UserHomeScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  // Componente de Botão do Menu (Reutilizável)
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
      {/* Ícone Redondo */}
      <View style={[
        styles.iconContainer, 
        { borderColor: color, borderWidth: 2 } // Borda colorida no ícone
      ]}>
        <Feather name={icon} size={24} color={isDark ? '#FFF' : color} />
      </View>

      {/* Texto Centralizado */}
      <View style={styles.textContainer}>
        <ThemedText style={styles.buttonTitle}>{title}</ThemedText>
      </View>

      {/* Seta */}
      <Feather name="chevron-right" size={24} color={colors.tabIconDefault} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER (Sem Logo, Texto Ajustado) */}
        <View style={styles.header}>
          <ThemedText style={[styles.welcomeTitle, { color: colors.text }]}>
            Bem-vindo!
          </ThemedText>
          {/* Subtítulo agora usa colors.text para ficar da mesma cor do título */}
          <ThemedText style={[styles.subtitle, { color: colors.text }]}>
            O que você gostaria de fazer?
          </ThemedText>
        </View>

        {/* LISTA DE OPÇÕES */}
        <View style={styles.menuContainer}>
          <MenuButton 
            title="Nova Ocorrência" 
            icon="plus" 
            color="#0E2345" // Azul Marinho (Fyren)
            onPress={() => navigation.navigate('RegisterIncident')}
          />

          <MenuButton 
            title="Histórico" 
            icon="list" 
            color="#FF7A00" // Laranja
            onPress={() => navigation.navigate('History')}
          />

          <MenuButton 
            title="Sincronizar" 
            icon="upload-cloud" 
            color="#2D74FF" // Azul Claro
            onPress={() => console.log('Sincronizar')}
          />

          <MenuButton 
            title="Configurações" 
            icon="settings" 
            color="#475569" // Cinza
            onPress={() => navigation.navigate('Profile')} // Redireciona para o perfil/config
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <ThemedText style={[styles.versionText, { color: colors.tabIconDefault }]}>
            Versão 1.0.0 • Última sincronização: Hoje, 10:30
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
    padding: Spacing['2xl'],
    paddingTop: 60, // Espaço superior maior já que removemos a logo
  },
  
  // Header
  header: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.9, // Leve opacidade para dar um toque sutil, mas mantendo a cor
  },

  // Menu Buttons
  menuContainer: {
    gap: 16, // Espaço entre os botões
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center', // ISSO CENTRALIZA VERTICALMENTE
    paddingVertical: 20,  // Aumenta a altura do botão
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderLeftWidth: 6, // Faixa lateral colorida
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1, // Ocupa todo o espaço do meio
    justifyContent: 'center', // Garante centralização
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Footer
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
  },
});