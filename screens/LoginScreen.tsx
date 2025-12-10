import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha email e senha.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      // O erro já é tratado no AuthContext, mas garantimos o loading off
    } finally {
      setIsLoading(false);
    }
  };

  // Preencher credenciais de teste automaticamente
  const fillTestCredentials = (role: string) => {
    setEmail(`${role}@cbmpe.gov.br`);
    setPassword('123456');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          {/* LOGO PILL (Igual à imagem de referência) */}
          <View style={styles.logoContainer}>
            <View style={[
              styles.logoPill, 
              { backgroundColor: isDark ? 'rgba(255, 122, 0, 0.15)' : '#FFF0E0' }
            ]}>
              <MaterialIcons name="local-fire-department" size={24} color="#FF7A00" />
              <ThemedText style={[styles.logoText, { color: colors.text }]}>Fyren</ThemedText>
            </View>
          </View>

          <View style={styles.headerContainer}>
            <ThemedText style={styles.title}>
              Sistema de Gestão de Ocorrências
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
              Corpo de Bombeiros Militar de Pernambuco
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            {/* INPUT EMAIL */}
            <View style={styles.inputLabelContainer}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
            </View>
            <View style={[
              styles.inputWrapper, 
              { 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                borderColor: colors.border 
              }
            ]}>
              <Feather name="mail" size={20} color={colors.tabIconDefault} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="seu.email@cbmpe.gov.br"
                placeholderTextColor={colors.tabIconDefault}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* INPUT SENHA */}
            <View style={styles.inputLabelContainer}>
              <ThemedText style={styles.inputLabel}>Senha</ThemedText>
            </View>
            <View style={[
              styles.inputWrapper, 
              { 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                borderColor: colors.border 
              }
            ]}>
              <Feather name="lock" size={20} color={colors.tabIconDefault} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.tabIconDefault}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather 
                  name={showPassword ? "eye" : "eye-off"} 
                  size={20} 
                  color={colors.tabIconDefault} 
                />
              </TouchableOpacity>
            </View>

            {/* BOTÃO ENTRAR */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: '#FF7A00' }, // Laranja fixo da marca
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ThemedText style={styles.loginButtonText}>Entrar</ThemedText>
              )}
            </TouchableOpacity>

            {/* CAIXA DE CREDENCIAIS DE TESTE (Auxiliar) */}
            <View style={[
              styles.testBox, 
              { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }
            ]}>
              <ThemedText style={[styles.testBoxTitle, { color: colors.secondary }]}>
                Toque para preencher (Teste):
              </ThemedText>
              <View style={styles.testButtonsRow}>
                <TouchableOpacity onPress={() => fillTestCredentials('admin')}>
                  <ThemedText style={{color: colors.info, fontWeight: '600'}}>Admin</ThemedText>
                </TouchableOpacity>
                <ThemedText style={{color: colors.border}}>|</ThemedText>
                <TouchableOpacity onPress={() => fillTestCredentials('chief')}>
                   <ThemedText style={{color: colors.info, fontWeight: '600'}}>Chefe</ThemedText>
                </TouchableOpacity>
                <ThemedText style={{color: colors.border}}>|</ThemedText>
                <TouchableOpacity onPress={() => fillTestCredentials('user')}>
                   <ThemedText style={{color: colors.info, fontWeight: '600'}}>Bombeiro</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Footer simples */}
      <View style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: colors.tabIconDefault }]}>
          © 2025 CBM-PE • Tecnologia da Informação
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing['2xl'],
    paddingTop: 60,
  },
  // Logo Styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800', // Extra bold para parecer a logo
    letterSpacing: 0.5,
  },
  // Header Text
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  // Form
  formContainer: {
    gap: 16,
  },
  inputLabelContainer: {
    marginBottom: -10, // Aproxima o label do input
    marginLeft: 4,
    zIndex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    height: 56,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: "#FF7A00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Test Box
  testBox: {
    marginTop: 32,
    padding: 16,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  testBoxTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  testButtonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  }
});