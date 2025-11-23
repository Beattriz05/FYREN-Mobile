import { Platform } from "react-native";

const navyBlue = "#0E2345";
const orange = "#F39C12";
const lightBlue = "#2D74FF";
const white = "#FFFFFF";
const lightGray = "#F2F2F2";

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
    backgroundRoot: navyBlue,
    backgroundDefault: "#1A2F4A",
    backgroundSecondary: "#0A1829",
    backgroundTertiary: "#152336",
    card: "#1A2F4A",
    border: "#2D4563",
    success: "#4CAF50",
    warning: orange,
    error: "#F44336",
    info: lightBlue,
  },
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
  inputHeight: 48,
  buttonHeight: 52,
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

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
