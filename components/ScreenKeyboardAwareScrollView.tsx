import { Platform, StyleSheet } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing } from "@/constants/theme";
import { ScreenScrollView } from "./ScreenScrollView";

export function ScreenKeyboardAwareScrollView({
  children,
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps = "handled",
  ...scrollViewProps
}: KeyboardAwareScrollViewProps) {
  const { colors } = useTheme();
  // Aqui pegamos o "top" corrigido do nosso hook novo
  const { top, bottom, scrollInsetBottom } = useScreenInsets();

  if (Platform.OS === "web") {
    return (
      <ScreenScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...scrollViewProps}
      >
        {children}
      </ScreenScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundRoot },
        style,
      ]}
      contentContainerStyle={[
        {
          paddingTop: top, // Aplica o espaçamento do topo (header)
          paddingBottom: bottom, // Aplica o espaçamento da base (tabs)
        },
        styles.contentContainer,
        contentContainerStyle,
      ]}
      scrollIndicatorInsets={{ bottom: scrollInsetBottom, top: top }}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      bottomOffset={20} // Espaço extra acima do teclado
      {...scrollViewProps}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg, // Ajustado para ser consistente
  },
});