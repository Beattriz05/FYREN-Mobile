import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importe cores do theme.ts
import { Colors } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'highContrast';

interface ThemeContextType {
  mode: ThemeMode;
  fontSizeScale: number;
  isHighContrast: boolean;
  colors: typeof Colors.light | typeof Colors.dark | typeof Colors.highContrast;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setFontSize: (scale: number) => void;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  
  // Estado para o tema
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Valor inicial: tentar carregar do AsyncStorage ou usar sistema
    return (systemColorScheme as ThemeMode) || 'light';
  });
  
  const [fontSizeScale, setFontSizeScale] = useState(1);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('theme_mode');
      const savedFontScale = await AsyncStorage.getItem('font_scale');
      const savedHighContrast = await AsyncStorage.getItem('high_contrast');

      if (savedMode && ['light', 'dark', 'highContrast'].includes(savedMode)) {
        setMode(savedMode as ThemeMode);
      }
      
      if (savedFontScale) {
        const scale = parseFloat(savedFontScale);
        if (!isNaN(scale) && scale >= 0.8 && scale <= 1.5) {
          setFontSizeScale(scale);
        }
      }
      
      if (savedHighContrast) {
        setIsHighContrast(savedHighContrast === 'true');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  // Salvar configurações
  const saveMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme_mode', newMode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const saveFontScale = async (scale: number) => {
    try {
      await AsyncStorage.setItem('font_scale', scale.toString());
    } catch (error) {
      console.error('Erro ao salvar escala de fonte:', error);
    }
  };

  const saveHighContrast = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('high_contrast', value.toString());
    } catch (error) {
      console.error('Erro ao salvar alto contraste:', error);
    }
  };

  // Obter cores baseadas no tema atual
  const getCurrentColors = () => {
    if (isHighContrast) {
      return Colors.highContrast;
    }
    
    if (mode === 'dark') {
      return Colors.dark;
    }
    
    if (mode === 'light') {
      return Colors.light;
    }
    
    // Fallback para highContrast se mode for 'highContrast'
    if (mode === 'highContrast') {
      return Colors.highContrast;
    }
    
    return Colors.light;
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    saveMode(newMode);
    
    // Se estiver mudando para light/dark, desativa alto contraste
    if (isHighContrast) {
      setIsHighContrast(false);
      saveHighContrast(false);
    }
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    saveMode(newMode);
    
    // Se mudar para highContrast mode, ativa alto contraste
    if (newMode === 'highContrast') {
      setIsHighContrast(true);
      saveHighContrast(true);
    }
  };

  const setFontSize = (scale: number) => {
    const newScale = Math.max(0.8, Math.min(scale, 1.5)); // Limites entre 0.8 e 1.5
    setFontSizeScale(newScale);
    saveFontScale(newScale);
  };

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    saveHighContrast(newValue);
    
    // Se ativar alto contraste, muda mode para highContrast
    if (newValue) {
      setMode('highContrast');
      saveMode('highContrast');
    } else {
      // Se desativar, volta para light (ou poderia lembrar o último)
      const fallbackMode = systemColorScheme === 'dark' ? 'dark' : 'light';
      setMode(fallbackMode);
      saveMode(fallbackMode);
    }
  };

  const increaseFontSize = () => {
    setFontSize(Math.min(fontSizeScale + 0.1, 1.5));
  };

  const decreaseFontSize = () => {
    setFontSize(Math.max(fontSizeScale - 0.1, 0.8));
  };

  const value = {
    mode,
    fontSizeScale,
    isHighContrast,
    colors: getCurrentColors(),
    toggleTheme,
    setThemeMode,
    setFontSize,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};