import { useTheme as useThemeContext } from '../contexts/ThemeContext';

// Hook personalizado para usar o tema com propriedade isDark
export const useTheme = () => {
  const themeContext = useThemeContext();

  // Adiciona a propriedade isDark derivada do mode
  return {
    ...themeContext,
    isDark: themeContext.mode === 'dark',
  };
};
