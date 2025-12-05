// hooks/useTheme.ts (se quiser manter separado, mas não é necessário)
import { useTheme as useThemeContext } from '../contexts/ThemeContext';

// Re-exportando o hook do contexto
export const useTheme = useThemeContext;