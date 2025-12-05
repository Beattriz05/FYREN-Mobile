import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

export interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevation?: number;
  padding?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
}

const getCardStyles = (
  elevation: number,
  colors: any,
  variant: 'default' | 'outlined' | 'elevated'
): ViewStyle => {
  const baseStyle: ViewStyle = {};
  
  switch (variant) {
    case 'outlined':
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = colors.border || '#E0E0E0';
      baseStyle.backgroundColor = colors.card || colors.backgroundSecondary;
      break;
      
    case 'elevated':
      baseStyle.backgroundColor = colors.card || colors.backgroundSecondary;
      baseStyle.shadowColor = '#000';
      baseStyle.shadowOffset = { width: 0, height: elevation };
      baseStyle.shadowOpacity = 0.1;
      baseStyle.shadowRadius = elevation * 2;
      baseStyle.elevation = elevation;
      break;
      
    case 'default':
    default:
      if (elevation > 0) {
        // Se tem elevation, usar cores diferentes para profundidade
        switch (elevation) {
          case 1:
            baseStyle.backgroundColor = colors.backgroundDefault;
            break;
          case 2:
            baseStyle.backgroundColor = colors.backgroundSecondary;
            break;
          case 3:
            baseStyle.backgroundColor = colors.backgroundTertiary;
            break;
          default:
            baseStyle.backgroundColor = colors.card || colors.backgroundSecondary;
        }
      } else {
        baseStyle.backgroundColor = colors.card || colors.backgroundSecondary;
      }
      break;
  }
  
  return baseStyle;
};

export function Card({ 
  children, 
  style, 
  elevation = 0,
  padding = true,
  onPress,
  variant = 'default'
}: CardProps) {
  const { colors } = useTheme();
  
  const cardStyles = getCardStyles(elevation, colors, variant);
  
  const Content = (
    <View
      style={[
        styles.card,
        cardStyles,
        padding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
  },
  padding: {
    padding: Spacing.lg,
  },
});