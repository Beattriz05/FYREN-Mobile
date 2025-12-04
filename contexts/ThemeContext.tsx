import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, BaseTypography } from '@/constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isHighContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
  theme: typeof Colors.light;
  typography: typeof BaseTypography;
  isDark: boolean;
}

const defaultContext: ThemeContextType = {
  themeMode: 'system',
  setThemeMode: () => {},
  isHighContrast: false,
  setHighContrast: () => {},
  fontScale: 1,
  setFontScale: () => {},
  theme: Colors.light,
  typography: BaseTypography,
  isDark: false,
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

const THEME_KEY = '@fyren_theme_pref';
const MIN_FONT_SCALE = 0.8;
const MAX_FONT_SCALE = 2.0;

// Função auxiliar para escalar tipografia de forma segura
const createScaledTypography = (baseTypography: typeof BaseTypography, fontScale: number) => {
  const result: Partial<typeof BaseTypography> = {};
  
  (Object.keys(baseTypography) as Array<keyof typeof BaseTypography>).forEach(key => {
    const style = baseTypography[key];
    
    // Assumimos que style é sempre um objeto válido (BaseTypography)
    const scaledStyle: any = { ...style };
    
    // Lista de propriedades que podem ser escaladas
    const scalableProps = ['fontSize', 'lineHeight', 'letterSpacing'] as const;
    
    scalableProps.forEach(prop => {
      // Verifica se a propriedade existe e é um número
      if (prop in scaledStyle && typeof scaledStyle[prop] === 'number') {
        // Determina precisão baseada na propriedade
        const precision = prop === 'letterSpacing' ? 100 : 10;
        scaledStyle[prop] = Math.round(scaledStyle[prop] * fontScale * precision) / precision;
      }
    });
    
    result[key] = scaledStyle;
  });
  
  return result as typeof BaseTypography;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    mode: 'system' as ThemeMode,
    highContrast: false,
    fontScale: 1,
  });

  // Carregar configurações salvas
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(THEME_KEY);
      if (data) {
        const savedSettings = JSON.parse(data);
        setSettings({
          mode: savedSettings.mode || 'system',
          highContrast: savedSettings.highContrast || false,
          fontScale: savedSettings.fontScale || 1,
        });
      }
    } catch (e) {
      console.error('Failed to load theme settings', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = useCallback(async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save theme settings', e);
    }
  }, []);

  // Atualiza as preferências
  const updateThemeMode = useCallback((mode: ThemeMode) => {
    const newSettings = { ...settings, mode };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateHighContrast = useCallback((enabled: boolean) => {
    const newSettings = { ...settings, highContrast: enabled };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateFontScale = useCallback((scale: number) => {
    const clampedScale = Math.min(Math.max(scale, MIN_FONT_SCALE), MAX_FONT_SCALE);
    const newSettings = { ...settings, fontScale: clampedScale };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Lógica de cálculo do tema atual (otimizado com useMemo)
  const effectiveScheme = useMemo(() => {
    return settings.mode === 'system' ? (deviceScheme || 'light') : settings.mode;
  }, [settings.mode, deviceScheme]);

  // Calcular tema atual (com ou sem alto contraste)
  const currentTheme = useMemo(() => {
    let theme = Colors[effectiveScheme as keyof typeof Colors];
    if (settings.highContrast && 'highContrast' in Colors) {
      theme = Colors.highContrast as typeof Colors.light;
    }
    return theme;
  }, [effectiveScheme, settings.highContrast]);

  // Lógica de cálculo da tipografia (Fontes Escaláveis - F-15)
  const scaledTypography = useMemo(() => {
    return createScaledTypography(BaseTypography, settings.fontScale);
  }, [settings.fontScale]);

  const isDark = useMemo(() => {
    return effectiveScheme === 'dark' || settings.highContrast;
  }, [effectiveScheme, settings.highContrast]);

  // Valor do contexto (otimizado com useMemo)
  const contextValue = useMemo(() => ({
    themeMode: settings.mode,
    setThemeMode: updateThemeMode,
    isHighContrast: settings.highContrast,
    setHighContrast: updateHighContrast,
    fontScale: settings.fontScale,
    setFontScale: updateFontScale,
    theme: currentTheme,
    typography: scaledTypography,
    isDark,
  }), [
    settings,
    updateThemeMode,
    updateHighContrast,
    updateFontScale,
    currentTheme,
    scaledTypography,
    isDark,
  ]);

  // Evita renderizar com contexto vazio durante carregamento
  if (isLoading) {
    return null; // Ou um componente de loading
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}