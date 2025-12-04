import React, { createContext, useState, useEffect, ReactNode } from 'react';
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

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  isHighContrast: false,
  setHighContrast: () => {},
  fontScale: 1,
  setFontScale: () => {},
  theme: Colors.light,
  typography: BaseTypography,
  isDark: false,
});

const THEME_KEY = '@fyren_theme_pref';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isHighContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(THEME_KEY);
      if (data) {
        const settings = JSON.parse(data);
        setThemeMode(settings.mode || 'system');
        setHighContrast(settings.highContrast || false);
        setFontScale(settings.fontScale || 1);
      }
    } catch (e) {
      console.error('Failed to load theme settings');
    }
  };

  const saveSettings = async (mode: ThemeMode, contrast: boolean, scale: number) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify({
        mode,
        highContrast: contrast,
        fontScale: scale
      }));
    } catch (e) {}
  };

  // Atualiza as preferências
  const updateThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveSettings(mode, isHighContrast, fontScale);
  };

  const updateHighContrast = (enabled: boolean) => {
    setHighContrast(enabled);
    saveSettings(themeMode, enabled, fontScale);
  };

  const updateFontScale = (scale: number) => {
    setFontScale(scale);
    saveSettings(themeMode, isHighContrast, scale);
  };

  // Lógica de cálculo do tema atual
  const effectiveScheme = themeMode === 'system' ? (deviceScheme || 'light') : themeMode;
  
  let currentTheme = Colors[effectiveScheme];
  if (isHighContrast) {
    currentTheme = Colors.highContrast;
  }

  // Lógica de cálculo da tipografia (Fontes Escaláveis - F-15)
  const scaledTypography = Object.keys(BaseTypography).reduce((acc, key) => {
    const k = key as keyof typeof BaseTypography;
    acc[k] = {
      ...BaseTypography[k],
      fontSize: BaseTypography[k].fontSize * fontScale,
      lineHeight: BaseTypography[k].lineHeight * fontScale,
    };
    return acc;
  }, {} as typeof BaseTypography);

  return (
    <ThemeContext.Provider value={{
      themeMode,
      setThemeMode: updateThemeMode,
      isHighContrast,
      setHighContrast: updateHighContrast,
      fontScale,
      setFontScale: updateFontScale,
      theme: currentTheme,
      typography: scaledTypography,
      isDark: effectiveScheme === 'dark' || isHighContrast,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}