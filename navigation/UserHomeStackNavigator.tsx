// components/HeaderTitle.tsx - versão corrigida
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
  icon?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  subtitle,
  icon,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {icon && (
        <Text style={[styles.icon, { color: colors.bombeiros?.primary }]}>
          {icon}
        </Text>
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }, titleStyle]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.secondary }, subtitleStyle]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
});