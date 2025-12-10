import { Platform } from 'react-native';

// Paleta Oficial Fyren
const fyrenNavy = '#0E2345'; // Fundo Principal
const fyrenCardNavy = '#152b52'; // Fundo dos Cartões (um pouco mais claro que o fundo)
const fyrenOrange = '#FF7A00'; // Laranja Vibrante (Botões/Destaques)
const fyrenBlue = '#2D74FF'; // Azul Info
const white = '#FFFFFF';
const lightGray = '#F5F7FA';
const textDark = '#1A2F4A';

const bombeirosPalette = {
  primary: fyrenNavy,
  secondary: fyrenOrange,
  emergency: '#F44336',
  warning: '#FF9800',
  success: '#00C853',
  info: fyrenBlue,
  background: lightGray,
};

export const Colors = {
  light: {
    primary: fyrenNavy,
    secondary: fyrenOrange,
    accent: fyrenBlue,
    text: textDark,
    textLight: white,
    buttonText: white,
    tabIconDefault: '#94A3B8',
    tabIconSelected: fyrenNavy,
    link: fyrenBlue,
    backgroundRoot: lightGray,
    backgroundDefault: white,
    backgroundSecondary: '#E2E8F0',
    backgroundTertiary: '#CBD5E1',
    card: white,
    border: '#E2E8F0',
    success: '#00C853',
    warning: '#FF9800',
    error: '#EF4444',
    info: fyrenBlue,
    onSurfaceVariant: '#64748B',
    bombeiros: bombeirosPalette,
  },
  dark: { // Este é o tema padrão "Azul Escuro" das suas imagens
    primary: fyrenOrange, // No dark mode, o primary vira a cor de destaque (laranja)
    secondary: fyrenNavy,
    accent: fyrenBlue,
    text: white,
    textLight: '#CBD5E1',
    buttonText: fyrenNavy,
    tabIconDefault: '#64748B',
    tabIconSelected: fyrenOrange,
    link: '#60A5FA',
    backgroundRoot: fyrenNavy, // Fundo Azul Escurão
    backgroundDefault: fyrenCardNavy,
    backgroundSecondary: '#1E3A8A',
    backgroundTertiary: '#1E293B',
    card: fyrenCardNavy, // Cartões Azul um pouco mais claro
    border: '#2A4365', // Bordas sutis
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    onSurfaceVariant: '#94A3B8',
    bombeiros: {
      ...bombeirosPalette,
      background: fyrenNavy,
    },
  },
  highContrast: {
    primary: '#FFFF00',
    secondary: '#FFFFFF',
    accent: '#00FF00',
    text: '#FFFFFF',
    textLight: '#000000',
    buttonText: '#000000',
    tabIconDefault: '#FFFFFF',
    tabIconSelected: '#FFFF00',
    link: '#FFFF00',
    backgroundRoot: '#000000',
    backgroundDefault: '#000000',
    backgroundSecondary: '#111111',
    backgroundTertiary: '#333333',
    card: '#000000',
    border: '#FFFFFF',
    success: '#00FF00',
    warning: '#FFFF00',
    error: '#FF0000',
    info: '#00FFFF',
    onSurfaceVariant: '#000000',
    bombeiros: {
      primary: '#FFFF00',
      secondary: '#FFFFFF',
      emergency: '#FF0000',
      warning: '#FFFF00',
      success: '#00FF00',
      info: '#00FFFF',
      background: '#000000',
    },
  },
  bombeiros: bombeirosPalette,
};

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32, '4xl': 40, '5xl': 48,
  inputHeight: 52, buttonHeight: 50,
};

export const BorderRadius = {
  xs: 6, sm: 10, md: 14, lg: 20, xl: 28, '2xl': 32, full: 9999,
};