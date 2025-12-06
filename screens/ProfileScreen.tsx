import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import Button from '../components/Button';
import { Card } from '../components/Card';
import Spacer from '../components/Spacer';
import SettingRow from '../components/SettingRow';
import Avatar from '@/contexts/Avatar';
import ThemeToggle from '../components/ThemeToggle';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { 
    mode, 
    fontSizeScale, 
    isHighContrast, 
    colors,
    toggleTheme, 
    setFontSize, 
    toggleHighContrast,
  } = useTheme();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Saída',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              showToast('success', 'Logout realizado com sucesso!');
            } catch (error) {
              showToast('error', 'Erro ao fazer logout');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const fontSizeOptions = [
    { label: 'Pequeno', value: 0.8 },
    { label: 'Padrão', value: 1.0 },
    { label: 'Grande', value: 1.1 },
    { label: 'Extra Grande', value: 1.2 },
  ];

  const getAppVersion = () => {
    return '1.0.0';
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.bombeiros.ms.gov.br/politica-de-privacidade');
  };

  const openTerms = () => {
    Linking.openURL('https://www.bombeiros.ms.gov.br/termos-de-uso');
  };

  // CORREÇÃO 1: Verificar se o usuário é administrador de forma segura
  const isAdmin = user?.role && ['Admin', 'Administrador', 'admin'].includes(user.role);

  // CORREÇÃO 2: Converter mode para tipo aceito pelo ThemeToggle
  const themeMode = mode === 'highContrast' ? 'auto' : (mode === 'light' || mode === 'dark' || mode === 'auto' ? mode : 'auto');

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Cabeçalho do Perfil */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              size={100}
              name={user?.name}
              email={user?.email}
              role={user?.role}
              onPress={() => {
                // Navegar para tela de edição de perfil
              }}
            />
            
            <Spacer size="l" />
            
            <View style={styles.userInfo}>
              <ThemedText type="title" style={styles.userName}>
                {user?.name || 'Administrador'}
              </ThemedText>
              
              {/* CORREÇÃO 3: Remover type="default" que não existe no ThemedText */}
              <ThemedText style={styles.userEmail}>
                {user?.email || 'admin@cbmpe.com'}
              </ThemedText>
              
              <View style={styles.roleContainer}>
                <View style={[styles.roleBadge, { backgroundColor: colors.bombeiros?.primary || Colors.bombeiros.primary }]}>
                  <MaterialIcons name="verified" size={16} color="#FFF" />
                  <Spacer size="xs" horizontal />
                  <ThemedText style={styles.roleText}>
                    {user?.role || 'Administrador'}
                  </ThemedText>
                </View>
              </View>
            </View>
            
            <Spacer size="l" />
            
            <Button
              title="Editar Perfil"
              variant="outline"
              size="medium"
              icon="edit"
              onPress={() => {
                // Navegar para edição de perfil
              }}
            />
          </View>
        </Card>

        <Spacer size="l" />

        {/* Seção de Aparência */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="palette" size={20} color={colors.text} />
            <Spacer size="s" horizontal />
            <ThemedText style={styles.sectionTitleText}>Aparência</ThemedText>
          </View>

          <Spacer size="m" />

          <SettingRow
            label="Tema"
            description="Escolha o tema do aplicativo"
            value={mode === 'light' ? 'Claro' : mode === 'dark' ? 'Escuro' : 'Automático'}
          >
            {/* CORREÇÃO 4: Usar themeMode convertido */}
            <ThemeToggle value={themeMode} onChange={toggleTheme} />
          </SettingRow>

          <View style={styles.divider} />

          <SettingRow
            icon="format-size"
            label="Tamanho da Fonte"
            description={`Escala: ${Math.round(fontSizeScale * 100)}%`}
          >
            <View style={styles.fontSizeContainer}>
              {fontSizeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.fontSizeOption,
                    fontSizeScale === option.value && styles.fontSizeOptionActive,
                    fontSizeScale === option.value && {
                      backgroundColor: colors.bombeiros?.primary || Colors.bombeiros.primary,
                    },
                  ]}
                  onPress={() => setFontSize(option.value)}
                >
                  <ThemedText
                    style={[
                      styles.fontSizeText,
                      fontSizeScale === option.value && styles.fontSizeTextActive,
                    ]}
                  >
                    {option.label.charAt(0)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </SettingRow>

          <View style={styles.divider} />

          <SettingRow
            icon="contrast"
            label="Alto Contraste"
            description="Melhora a legibilidade"
            showSwitch
            switchValue={isHighContrast}
            onSwitchChange={toggleHighContrast}
          />
        </Card>

        <Spacer size="l" />

        {/* Seção de Preferências */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="settings" size={20} color={colors.text} />
            <Spacer size="s" horizontal />
            <ThemedText style={styles.sectionTitleText}>Preferências</ThemedText>
          </View>

          <Spacer size="m" />

          <SettingRow
            icon="notifications"
            label="Notificações"
            description="Gerencie suas notificações"
            showChevron
            onPress={() => {
              // Navegar para configurações de notificação
            }}
          />

          <View style={styles.divider} />

          <SettingRow
            icon="language"
            label="Idioma"
            description="Português (Brasil)"
            showChevron
            onPress={() => {
              // Navegar para seleção de idioma
            }}
          />

          <View style={styles.divider} />

          <SettingRow
            icon="security"
            label="Segurança"
            description="Alterar senha e autenticação"
            showChevron
            onPress={() => {
              // Navegar para configurações de segurança
            }}
          />
        </Card>

        <Spacer size="l" />

        {/* Seção do Sistema */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="info" size={20} color={colors.text} />
            <Spacer size="s" horizontal />
            <ThemedText style={styles.sectionTitleText}>Sistema</ThemedText>
          </View>

          <Spacer size="m" />

          <SettingRow
            label="Versão do App"
            description={`FYREN Mobile v${getAppVersion()}`}
          />

          <View style={styles.divider} />

          <SettingRow
            label="Política de Privacidade"
            showChevron
            onPress={openPrivacyPolicy}
          />

          <View style={styles.divider} />

          <SettingRow
            label="Termos de Uso"
            showChevron
            onPress={openTerms}
          />

          <View style={styles.divider} />

          <SettingRow
            label="Suporte"
            description="suporte@cbmpe.gov.br"
            showChevron
            onPress={() => {
              Linking.openURL('mailto:suporte@cbmpe.gov.br');
            }}
          />
        </Card>

        <Spacer size="l" />

        {/* CORREÇÃO 5: Botão de Sair - corrigir estilo do Card */}
        <Card style={StyleSheet.compose(styles.sectionCard, styles.dangerCard)}>
          <SettingRow
            icon="logout"
            label="Sair da Conta"
            description="Encerrar sessão atual"
            type="danger"
          >
            <Button
              title="Sair"
              variant="danger"
              size="small"
              loading={loading}
              onPress={handleLogout}
            />
          </SettingRow>
        </Card>

        {/* Informações para Administradores */}
        {isAdmin && (
          <>
            <Spacer size="l" />
            
            <Card style={styles.adminCard}>
              <View style={styles.sectionTitleContainer}>
                <MaterialIcons name="admin-panel-settings" size={20} color={Colors.bombeiros.info} />
                <Spacer size="s" horizontal />
                <ThemedText style={[styles.sectionTitleText, styles.adminTitle]}>
                  Painel de Administração
                </ThemedText>
              </View>

              <Spacer size="m" />

              <View style={styles.adminGrid}>
                <Button
                  title="Usuários"
                  variant="outline"
                  icon="people"
                  style={styles.adminButton}
                  onPress={() => {
                    // Navegar para UserManagementScreen
                  }}
                />

                <Button
                  title="Relatórios"
                  variant="outline"
                  icon="assessment"
                  style={styles.adminButton}
                  onPress={() => {
                    // Navegar para ReportsScreen
                  }}
                />

                <Button
                  title="Auditoria"
                  variant="outline"
                  icon="history"
                  style={styles.adminButton}
                  onPress={() => {
                    // Navegar para AuditScreen
                  }}
                />

                <Button
                  title="Dashboard"
                  variant="outline"
                  icon="dashboard"
                  style={styles.adminButton}
                  onPress={() => {
                    // Navegar para AdminDashboardScreen
                  }}
                />
              </View>
            </Card>
          </>
        )}

        <Spacer size="xl" />

        {/* Rodapé */}
        <View style={styles.footer}>
          <MaterialIcons name="local-fire-department" size={32} color={colors.bombeiros?.primary || Colors.bombeiros.primary} />
          <Spacer size="s" />
          <ThemedText type="title" style={styles.footerText}>
            FYREN Mobile
          </ThemedText>
          {/* CORREÇÃO 6: Remover type="default" */}
          <ThemedText style={styles.footerSubtitle}>
            Corpo de Bombeiros Militar de Pernambuco
          </ThemedText>
          <Spacer size="s" />
          <ThemedText type="caption" style={styles.footerDescription}>
            Sistema Integrado de Gerenciamento de Ocorrências
          </ThemedText>
          <Spacer size="m" />
          <ThemedText type="caption" style={styles.footerCopyright}>
            © {new Date().getFullYear()} CBM-PE. Todos os direitos reservados.
          </ThemedText>
          <ThemedText type="caption" style={styles.footerVersion}>
            Versão {getAppVersion()} • Desenvolvido para o CBM-PE
          </ThemedText>
        </View>

        <Spacer size="xl" />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  profileCard: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    alignItems: 'center',
    width: '100%',
  },
  userInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionCard: {
    padding: 20,
    borderRadius: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.bombeiros.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginVertical: 12,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  fontSizeOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  fontSizeOptionActive: {
    // Cor definida dinamicamente
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fontSizeTextActive: {
    color: '#FFFFFF',
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.bombeiros.emergency,
  },
  adminCard: {
    padding: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 16,
  },
  adminTitle: {
    color: Colors.bombeiros.info,
  },
  adminGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  adminButton: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerText: {
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.bombeiros.primary,
    fontSize: 20,
  },
  footerSubtitle: {
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
    fontSize: 16,
  },
  footerDescription: {
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: 300,
    lineHeight: 18,
  },
  footerCopyright: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
  },
  footerVersion: {
    textAlign: 'center',
    opacity: 0.5,
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProfileScreen;