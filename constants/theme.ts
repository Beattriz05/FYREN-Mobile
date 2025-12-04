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
    backgroundRoot: navyBlue, // Fundo geral azul escuro
    backgroundDefault: "#152336", // Fundo padrão um pouco mais claro
    backgroundSecondary: "#2A3C55", // [CORRIGIDO] Inputs mais claros para contraste
    backgroundTertiary: "#1A2F4A",
    card: "#1A2F4A", // Cartão azul médio
    border: "#4A6FA5", // Borda mais visível
    success: "#4CAF50",
    warning: orange,
    error: "#F44336",
    info: lightBlue,
  },
  highContrast: highContrast,
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
  inputHeight: 52, // Aumentei um pouco para melhor toque
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
  link: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
};

export const Fonts = Platform.select({
  ios: { sans: "system-ui", serif: "ui-serif", rounded: "ui-rounded", mono: "ui-monospace" },
  default: { sans: "normal", serif: "serif", rounded: "normal", mono: "monospace" },
  web: { sans: "sans-serif", serif: "serif", rounded: "sans-serif", mono: "monospace" },
});