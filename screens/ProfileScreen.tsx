import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';

import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import Button from '../components/Button';
import { Card } from '../components/Card';
import SettingRow from '../components/SettingRow';
import Avatar from '../components/Avatar';
import { Colors } from '../constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { mode, colors, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
            showToast('success', 'Sessão encerrada');
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const isAdmin = user.role && ['admin', 'chefe'].includes(user.role);

  return (
    <ThemedView style={styles.container}>
      {/* HEADER PERSONALIZADO TIPO FYREN */}
      <View style={[styles.headerBar, { backgroundColor: colors.backgroundRoot }]}>
        <View style={styles.headerLogoContainer}>
          <MaterialIcons name="local-fire-department" size={28} color={Colors.light.secondary} />
          <ThemedText style={styles.headerTitle}>Fyren</ThemedText>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Feather name={mode === 'dark' ? 'sun' : 'moon'} size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={[styles.iconButton, { marginLeft: 8 }]}>
             <Feather name="log-out" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CARTÃO DE PERFIL PRINCIPAL */}
        <View style={styles.profileSection}>
           <View style={styles.avatarWrapper}>
             <Avatar 
                size={90} 
                name={user.name} 
                email={user.email} 
                role={user.role} 
             />
             <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
           </View>
           
           <ThemedText style={styles.userName}>{user.name}</ThemedText>
           <ThemedText style={[styles.userRole, { color: colors.secondary }]}>
             {user.role ? user.role.toUpperCase() : 'USUÁRIO'} • {user.email}
           </ThemedText>

           <Button 
             title="Editar Perfil" 
             variant="outline" 
             size="small" 
             style={styles.editButton}
             onPress={() => {}}
           />
        </View>

        {/* SEÇÃO CONTA */}
        <ThemedText style={styles.sectionTitle}>Minha Conta</ThemedText>
        <Card style={styles.card}>
          <SettingRow 
            icon="notifications" 
            label="Notificações" 
            showChevron 
            onPress={() => {}} 
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow 
            icon="lock" 
            label="Segurança e Senha" 
            showChevron 
            onPress={() => {}} 
          />
        </Card>

        {/* SEÇÃO ADMIN (Condicional) */}
        {isAdmin && (
          <>
            <ThemedText style={styles.sectionTitle}>Administração</ThemedText>
            <View style={styles.adminGrid}>
               <TouchableOpacity style={[styles.adminBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                 <Feather name="users" size={24} color={Colors.light.secondary} />
                 <ThemedText style={styles.adminBtnText}>Usuários</ThemedText>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.adminBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                 <Feather name="bar-chart-2" size={24} color={Colors.light.secondary} />
                 <ThemedText style={styles.adminBtnText}>Relatórios</ThemedText>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.adminBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                 <Feather name="activity" size={24} color={Colors.light.secondary} />
                 <ThemedText style={styles.adminBtnText}>Auditoria</ThemedText>
               </TouchableOpacity>
            </View>
          </>
        )}

        {/* SEÇÃO SUPORTE */}
        <ThemedText style={styles.sectionTitle}>Suporte</ThemedText>
        <Card style={styles.card}>
          <SettingRow 
            icon="help" 
            label="Central de Ajuda" 
            showChevron 
            onPress={() => Linking.openURL('https://cbmpe.gov.br')} 
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow 
            icon="info" 
            label="Sobre o App" 
            description="Versão 1.0.0" 
          />
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header Tipo Fyren
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Ajuste conforme SafeArea
    paddingBottom: 20,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },

  scrollContent: {
    padding: 20,
  },

  // Perfil
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 3,
    borderColor: '#1E293B', // Cor fixa para contraste ou use colors.backgroundRoot
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  editButton: {
    minWidth: 120,
    height: 40,
  },

  // Seções
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
    opacity: 0.8,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    opacity: 0.5,
  },

  // Grid Admin
  adminGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  adminBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  adminBtnText: {
    fontSize: 12,
    fontWeight: '600',
  }
});