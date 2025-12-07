import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, useWindowDimensions } from 'react-native';

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  let headerHeight = 0;
  try {
    // Tenta pegar a altura real do header
    headerHeight = useHeaderHeight();
  } catch (error) {
    // Se falhar (ex: fora de um navigator), define um padrão
    headerHeight = 0;
  }

  // Se o headerHeight vier zerado (bug comum), forçamos um tamanho mínimo
  // iOS ~44px + statusbar, Android ~56px + statusbar
  if (headerHeight === 0) {
    headerHeight = (Platform.OS === 'ios' ? 44 : 56) + insets.top;
  }

  let tabBarHeight = 0;
  try {
    const { useBottomTabBarHeight } = require('@react-navigation/bottom-tabs');
    tabBarHeight = useBottomTabBarHeight();
  } catch (error) {
    tabBarHeight = 0;
  }

  // Adicionamos um espaçamento extra para o conteúdo não colar no header
  const paddingTop = headerHeight + (Platform.OS === 'ios' ? 16 : 8);
  const paddingBottom =
    insets.bottom + tabBarHeight + (Platform.OS === 'ios' ? 8 : 4);

  return {
    // Valores básicos
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,

    // Alturas dos componentes
    headerHeight,
    tabBarHeight,

    // Padding para conteúdo
    paddingTop,
    paddingBottom,

    // Inset para scroll (iOS)
    scrollInsetBottom: insets.bottom + tabBarHeight,

    // Utilitários
    windowHeight,

    // Métodos para estilos comuns
    getContentPadding: (options?: {
      includeTop?: boolean;
      includeBottom?: boolean;
      includeHorizontal?: boolean;
      extraTop?: number;
      extraBottom?: number;
    }) => {
      const {
        includeTop = true,
        includeBottom = true,
        includeHorizontal = false,
        extraTop = 0,
        extraBottom = 0,
      } = options || {};

      return {
        paddingTop: includeTop ? paddingTop + extraTop : extraTop,
        paddingBottom: includeBottom
          ? paddingBottom + extraBottom
          : extraBottom,
        paddingLeft: includeHorizontal ? insets.left : 0,
        paddingRight: includeHorizontal ? insets.right : 0,
      };
    },

    // Para StyleSheet.absoluteFill com safe areas
    getAbsoluteFillStyle: (options?: {
      includeTop?: boolean;
      includeBottom?: boolean;
    }) => {
      const { includeTop = true, includeBottom = true } = options || {};

      return {
        position: 'absolute' as const,
        top: includeTop ? insets.top : 0,
        bottom: includeBottom ? insets.bottom : 0,
        left: insets.left,
        right: insets.right,
      };
    },

    // Altura disponível para conteúdo
    getContentHeight: (options?: {
      includeHeader?: boolean;
      includeTabBar?: boolean;
    }) => {
      const { includeHeader = true, includeTabBar = true } = options || {};

      let height = windowHeight;

      if (includeHeader) {
        height -= paddingTop;
      } else {
        height -= insets.top;
      }

      if (includeTabBar) {
        height -= paddingBottom;
      } else {
        height -= insets.bottom;
      }

      return Math.max(height, 0);
    },
  };
}

// Tipo para facilitar o uso
export type ScreenInsets = ReturnType<typeof useScreenInsets>;
