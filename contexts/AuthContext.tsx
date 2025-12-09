import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importamos o tipo centralizado para garantir compatibilidade com ProfileScreen e outros
import { AppUser } from '@/utils/storage';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean; // <--- Adicionado
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>; // <--- Adicionado
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  hasCompletedOnboarding: false,
  login: async () => {},
  logout: async () => {},
  completeOnboarding: async () => {},
  isAuthenticated: false,
});

const STORAGE_KEY = '@fyren_user';
const ONBOARDING_KEY = '@fyren_onboarding';
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 30000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Estados para controle de segurança
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      // Carrega usuário e status do onboarding simultaneamente
      const [storedUser, onboardingStatus] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (onboardingStatus === 'true') {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const login = async (email: string, password: string) => {
    // 1. Verifica bloqueio
    if (lockoutUntil) {
      const now = Date.now();
      if (now < lockoutUntil) {
        const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
        Alert.alert(
          'Acesso Bloqueado',
          `Muitas tentativas falhas. Tente novamente em ${remainingSeconds} segundos.`,
        );
        throw new Error('Locked out');
      } else {
        setLockoutUntil(null);
        setFailedAttempts(0);
      }
    }

    // 2. Validação de senha (F-01) - Senha padrão: 123456
    if (password !== '123456') {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_TIME);
        Alert.alert('Bloqueado', 'Número máximo de tentativas excedido. Aguarde 30s.');
      } else {
        Alert.alert('Credenciais Inválidas', `Senha incorreta. Tentativa ${newAttempts} de ${MAX_ATTEMPTS}.`);
      }
      throw new Error('Invalid credentials');
    }

    // 3. Sucesso
    setFailedAttempts(0);
    setLockoutUntil(null);

    // Define cargo baseado no email
    let role: 'user' | 'chief' | 'admin' = 'user';
    const emailLower = email.toLowerCase();

    if (emailLower.includes('chief') || emailLower.includes('chefe')) {
      role = 'chief';
    } else if (emailLower.includes('admin')) {
      role = 'admin';
    }

    // Cria objeto compatível com AppUser do storage.ts
    const userData: AppUser = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email,
      role,
      active: true, // Necessário para o ProfileScreen
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        hasCompletedOnboarding,
        login,
        logout,
        completeOnboarding,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}