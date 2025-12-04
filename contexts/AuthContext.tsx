import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native'; // Adicionado Alert
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'user' | 'chief' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

const STORAGE_KEY = '@fyren_user';
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 30000; // 30 segundos em milissegundos

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para controle de segurança (F-01)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // 1. Verifica se está bloqueado
    if (lockoutUntil) {
      const now = Date.now();
      if (now < lockoutUntil) {
        const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
        Alert.alert(
          'Acesso Bloqueado', 
          `Muitas tentativas falhas. Tente novamente em ${remainingSeconds} segundos.`
        );
        throw new Error('Locked out');
      } else {
        // Tempo passou, reseta o bloqueio
        setLockoutUntil(null);
        setFailedAttempts(0);
      }
    }

    // 2. Simulação de validação de senha (F-01)
    // Para o MVP, a senha correta é sempre "123456"
    if (password !== '123456') {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_TIME);
        Alert.alert(
          'Bloqueado', 
          'Número máximo de tentativas excedido. Aguarde 30s.'
        );
      } else {
        Alert.alert(
          'Credenciais Inválidas', 
          `Senha incorreta. Tentativa ${newAttempts} de ${MAX_ATTEMPTS}.`
        );
      }
      throw new Error('Invalid credentials');
    }

    // 3. Sucesso - Reseta contadores
    setFailedAttempts(0);
    setLockoutUntil(null);

    // Define o cargo baseado no e-mail (Lógica Mockada)
    let role: UserRole = 'user';
    const emailLower = email.toLowerCase();
    
    if (emailLower.includes('chief') || emailLower.includes('chefe')) {
      role = 'chief';
    } else if (emailLower.includes('admin')) {
      role = 'admin';
    }

    const userData: User = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0], // Usa a parte antes do @ como nome
      email,
      role,
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
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}