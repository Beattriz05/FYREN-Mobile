import { Text, type TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  // AQUI ESTÁ A CORREÇÃO: Adicionei 'title', 'caption' e 'h4' na lista abaixo
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'h4';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();
  const color = colors.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? { color: colors.tabIconSelected } : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'h4' ? styles.h4 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  defaultSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: 'bold', lineHeight: 32 },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  link: { lineHeight: 30, fontSize: 16, color: '#0a7ea4' },
  caption: { fontSize: 12, lineHeight: 18 },
  h4: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
});