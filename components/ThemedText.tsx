import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// 1. AQUI ESTÁ A TIPOGRAFIA (Completei com os tipos que faltavam no seu código original)
const typography = {
  h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
  h3: { fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
  h4: { fontSize: 18, fontWeight: 'bold', lineHeight: 22 },
  body: { fontSize: 16, lineHeight: 24 },
  small: { fontSize: 12, lineHeight: 16 },
  link: { fontSize: 16, color: '#0a7ea4', textDecorationLine: 'underline' as 'underline' },
};

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "h1" | "h2" | "h3" | "h4" | "body" | "small" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  ...rest
}: ThemedTextProps) {
  
  // 2. CORREÇÃO CRÍTICA: Removi 'typography' daqui de dentro.
  // Agora ele só pega theme e isDark.
  const { theme, isDark } = useTheme();

  const getColor = () => {
    if (isDark && darkColor) return darkColor;
    if (!isDark && lightColor) return lightColor;
    // O ?. previne erro caso o theme demore a carregar
    if (type === "link") return theme?.link || '#0a7ea4';
    return theme?.text || '#000';
  };

  const getTypeStyle = (): TextStyle => {
    // Truque para o TypeScript entender que 'typography' é um objeto de estilos
    const typoStyles = typography as Record<string, TextStyle>;

    // Se o tipo (ex: h1) existir direto no objeto, retorna ele
    if (typoStyles[type]) {
      return typoStyles[type];
    }

    // Lógica de Fallback (Mantive a sua lógica original caso queira expandir depois)
    const fallbacks: Record<string, string[]> = {
      h1: ["heading1", "title", "display"],
      h2: ["heading2", "subtitle", "headline"],
      h3: ["heading3", "subhead"],
      h4: ["heading4"],
      body: ["p", "paragraph", "text"],
      small: ["caption", "footnote"],
      link: ["link", "body"]
    };

    if (fallbacks[type]) {
      for (const key of fallbacks[type]) {
        if (typoStyles[key]) {
          return typoStyles[key];
        }
      }
    }

    return typoStyles.body;
  };

  return (
    <Text style={[{ color: getColor() }, getTypeStyle(), style]} {...rest} />
  );
}