// components/ThemedText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export type ThemedTextType = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'link' | 'caption';

interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  type = 'body',
  style,
  children,
  ...props
}) => {
  const { colors, fontSizeScale } = useTheme();
  
  const getFontSize = () => {
    switch (type) {
      case 'h1': return 32 * fontSizeScale;
      case 'h2': return 28 * fontSizeScale;
      case 'h3': return 24 * fontSizeScale;
      case 'h4': return 20 * fontSizeScale;
      case 'body': return 16 * fontSizeScale;
      case 'small': return 14 * fontSizeScale;
      case 'link': return 16 * fontSizeScale;
      case 'caption': return 12 * fontSizeScale; // Adicionado
      default: return 16 * fontSizeScale;
    }
  };

  const getFontWeight = () => {
    switch (type) {
      case 'h1': return '700';
      case 'h2': return '700';
      case 'h3': return '600';
      case 'h4': return '600';
      case 'body': return '400';
      case 'small': return '400';
      case 'link': return '400';
      case 'caption': return '400'; // Adicionado
      default: return '400';
    }
  };

  const getColor = () => {
    if (type === 'link') {
      return colors.link || '#2D74FF';
    }
    return colors.text || '#2c3e50';
  };

  return (
    <Text
      style={[
        { 
          color: getColor(),
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
        },
        type === 'caption' && { opacity: 0.7 },
        type === 'small' && { opacity: 0.7 },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};