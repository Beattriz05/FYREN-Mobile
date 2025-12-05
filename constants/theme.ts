import { Platform } from "react-native";

const navyBlue = "#0E2345";
const orange = "#F39C12";
const lightBlue = "#2D74FF";
const white = "#FFFFFF";
const lightGray = "#F2F2F2";

// F-15: Paleta de Alto Contraste
const highContrast = {
  primary: "#FFFF00", 
  secondary: "#FFFFFF",
  accent: "#00FF00",
  text: "#FFFFFF",
  textLight: "#000000",
  buttonText: "#000000",
  tabIconDefault: "#FFFFFF",
  tabIconSelected: "#FFFF00",
  link: "#FFFF00",
  backgroundRoot: "#000000",
  backgroundDefault: "#000000",
  backgroundSecondary: "#111111",
  backgroundTertiary: "#333333",
  card: "#000000",
  border: "#FFFFFF",
  success: "#00FF00",
  warning: "#FFFF00",
  error: "#FF0000",
  info: "#00FFFF",
  onSurfaceVariant: "#000000", // ADICIONADO
};

// Paleta bombeiros (cores fixas que podem ser usadas em qualquer tema)
const bombeirosPalette = {
  primary: "#0E2345",     // Azul marinho
  secondary: "#F39C12",   // Laranja
  emergency: "#F44336",   // Vermelho
  warning: "#FF9800",     // Laranja aviso
  success: "#4CAF50",     // Verde
  info: "#2196F3",        // Azul info
  background: "#F2F2F2",  // Cinza claro
};

export const Colors = {
  light: {
    primary: navyBlue,
    secondary: orange,
    accent: lightBlue,
    text: navyBlue,
    textLight: "#FFFFFF",
    buttonText: white,
    tabIconDefault: "#9E9E9E",
    tabIconSelected: orange,
    link: lightBlue,
    backgroundRoot: navyBlue,
    backgroundDefault: lightGray,
    backgroundSecondary: white,
    backgroundTertiary: "#E8E8E8",
    card: white,
    border: "#E0E0E0",
    success: "#4CAF50",
    warning: orange,
    error: "#F44336",
    info: lightBlue,
    onSurfaceVariant: "#666666", // ADICIONADO - cor para ícones/variantes em superfície
    bombeiros: bombeirosPalette,
  },
  dark: {
    primary: navyBlue,
    secondary: orange,
    accent: lightBlue,
    text: white,
    textLight: white,
    buttonText: white,
    tabIconDefault: "#9E9E9E",
    tabIconSelected: orange,
    link: lightBlue,
    backgroundRoot: navyBlue,
    backgroundDefault: "#152336",
    backgroundSecondary: "#2A3C55",
    backgroundTertiary: "#1A2F4A",
    card: "#1A2F4A",
    border: "#4A6FA5",
    success: "#4CAF50",
    warning: orange,
    error: "#F44336",
    info: lightBlue,
    onSurfaceVariant: "#A0A0A0", // ADICIONADO - mais claro para tema escuro
    bombeiros: {
      ...bombeirosPalette,
      background: "#1A2F4A",
    },
  },
  highContrast: {
    ...highContrast,
    bombeiros: {
      primary: "#FFFF00",
      secondary: "#FFFFFF",
      emergency: "#FF0000",
      warning: "#FFFF00",
      success: "#00FF00",
      info: "#00FFFF",
      background: "#000000",
    },
  },
  bombeiros: bombeirosPalette,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 52,
  buttonHeight: 56,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const BaseTypography = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: "700" as const },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: "600" as const },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  small: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
  link: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
};

export const Fonts = Platform.select({
  ios: { sans: "system-ui", serif: "ui-serif", rounded: "ui-rounded", mono: "ui-monospace" },
  default: { sans: "normal", serif: "serif", rounded: "normal", mono: "monospace" },
  web: { sans: "sans-serif", serif: "serif", rounded: "sans-serif", mono: "monospace" },
});