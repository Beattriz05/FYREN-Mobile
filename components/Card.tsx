import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius } from "@/constants/theme";

export interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevation?: number;
}

const getBackgroundColorForElevation = (
  elevation: number,
  theme: any,
): string => {
  switch (elevation) {
    case 1:
      return theme.backgroundDefault;
    case 2:
      return theme.backgroundSecondary;
    case 3:
      return theme.backgroundTertiary;
    default:
      return theme.card || theme.backgroundSecondary;
  }
};

export function Card({ children, style, elevation = 0 }: CardProps) {
  const { theme } = useTheme();
  const cardBackgroundColor = getBackgroundColorForElevation(elevation, theme);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
  },
});
