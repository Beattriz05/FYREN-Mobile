import { Platform, StyleSheet } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as GlassEffect from 'expo-glass-effect';
import { Colors } from '@/constants/theme';
import React from 'react';

interface ScreenOptionsParams {
  theme: {
    backgroundRoot: string;
    text: string;
    primary?: string;
    secondary?: string;
  };
  isDark: boolean;
  transparent?: boolean;
  headerType?: 'default' | 'transparent' | 'solid' | 'blurred';
  showHeader?: boolean;
  showBackButton?: boolean;
  headerTitle?: string;
  headerShown?: boolean;
  gestureEnabled?: boolean;
}

// Tipos para os diferentes estilos de header
type HeaderStyleType = 'default' | 'transparent' | 'solid' | 'blurred';

// Configurações padrão para cada tipo de header
const getHeaderStyleConfig = (
  type: HeaderStyleType,
  theme: ScreenOptionsParams['theme'],
  isDark: boolean,
) => {
  const configs = {
    default: {
      transparent: false,
      backgroundColor: theme.backgroundRoot,
      blurEffect: undefined as any,
    },
    transparent: {
      transparent: true,
      backgroundColor: 'transparent',
      blurEffect: undefined as any,
    },
    solid: {
      transparent: false,
      backgroundColor: isDark
        ? 'rgba(18, 18, 18, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      blurEffect: undefined as any,
    },
    blurred: {
      transparent: false,
      backgroundColor: Platform.select({
        ios: 'transparent',
        android: isDark
          ? 'rgba(18, 18, 18, 0.85)'
          : 'rgba(255, 255, 255, 0.85)',
        web: isDark ? 'rgba(18,18,18,0.8)' : 'rgba(255,255,255,0.8)',
      }),
      blurEffect: isDark ? 'dark' : 'light',
    },
  };

  return configs[type];
};

// Verifica se o efeito glass está disponível
const isGlassEffectAvailable = (): boolean => {
  try {
    return GlassEffect.isLiquidGlassAvailable?.() || false;
  } catch (error) {
    console.warn('Glass effect not available:', error);
    return false;
  }
};

// Gera opções de animação baseadas na plataforma
const getAnimationOptions = () => {
  const glassAvailable = isGlassEffectAvailable();

  return {
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
    fullScreenGestureEnabled: glassAvailable ? false : Platform.OS === 'ios',
    animation: Platform.select({
      ios: 'slide_from_right',
      android: 'slide_from_right',
      default: 'default',
    }) as 'slide_from_right' | 'default',
    animationDuration: 300,
  };
};

// Opções comuns para todas as telas
export const getCommonScreenOptions = ({
  theme,
  isDark,
  transparent = true,
  headerType = 'transparent',
  showHeader = true,
  showBackButton = true,
  headerTitle,
  headerShown = true,
  gestureEnabled = true,
}: ScreenOptionsParams): NativeStackNavigationOptions => {
  const headerStyleConfig = getHeaderStyleConfig(headerType, theme, isDark);
  const animationOptions = getAnimationOptions();

  // Cor do texto do header baseado no tema
  const headerTintColor = theme.text;

  // Cor do título baseada no tema
  const headerTitleColor = theme.text;

  // Estilo do header baseado na plataforma
  const headerStyle = {
    backgroundColor: headerStyleConfig.backgroundColor,
    ...(Platform.OS === 'android' && {
      elevation: headerType === 'transparent' ? 0 : 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  };

  // Estilo do título do header
  const headerTitleStyle = {
    color: headerTitleColor,
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      web: 'system-ui',
    }),
  };

  // Opções base da navegação
  const baseOptions: NativeStackNavigationOptions = {
    // Configurações de header
    headerShown: showHeader && headerShown,
    headerTitleAlign: 'center' as const,
    headerTransparent: headerStyleConfig.transparent,
    headerBlurEffect: headerStyleConfig.blurEffect,
    headerTintColor,
    headerTitleStyle,
    headerStyle,

    // Configurações de navegação
    ...animationOptions,
    gestureEnabled,

    // Configurações de conteúdo
    contentStyle: {
      backgroundColor: theme.backgroundRoot,
      flex: 1,
    },

    // Configurações de status bar (se disponível)
    ...(Platform.OS === 'ios' && {
      statusBarStyle: isDark ? 'light' : 'dark',
      statusBarAnimation: 'fade',
    }),

    // Configurações de apresentação
    presentation: Platform.select({
      ios: 'card',
      android: 'card',
      web: 'card',
    }) as 'card' | 'modal',

    // Animação personalizada para Android
    ...(Platform.OS === 'android' && {
      animation: 'slide_from_right',
    }),
  };

  // Adiciona título personalizado se fornecido
  if (headerTitle) {
    baseOptions.headerTitle = headerTitle;
  }

  // Configurações específicas para botão voltar
  if (!showBackButton) {
    baseOptions.headerLeft = () => null;
  }

  return baseOptions;
};

// Opções específicas para telas de modal
export const getModalScreenOptions = (
  params: ScreenOptionsParams,
): NativeStackNavigationOptions => ({
  ...getCommonScreenOptions({ ...params, headerType: 'solid' }),
  presentation: 'modal' as const,
  gestureEnabled: true,
  headerShown: true,
  headerTitleAlign: 'center' as const,
  ...(Platform.OS === 'ios' && {
    headerBlurEffect: params.isDark
      ? 'systemUltraThinMaterialDark'
      : 'systemUltraThinMaterialLight',
  }),
});

// Opções para telas sem header (fullscreen)
export const getFullScreenOptions = (
  params: ScreenOptionsParams,
): NativeStackNavigationOptions => ({
  ...getCommonScreenOptions({ ...params, headerShown: false }),
  headerTransparent: true,
  headerShown: false,
  gestureEnabled: true,
  contentStyle: {
    backgroundColor: params.theme.backgroundRoot,
  },
  statusBarHidden: false,
  statusBarStyle: params.isDark ? 'light' : 'dark',
});

// Opções para telas com header fixo (não transparente)
export const getSolidHeaderOptions = (
  params: ScreenOptionsParams,
  options?: {
    elevation?: number;
    showDivider?: boolean;
  },
): NativeStackNavigationOptions => {
  const { elevation = 4, showDivider = true } = options || {};

  return {
    ...getCommonScreenOptions({ ...params, headerType: 'solid' }),
    headerStyle: {
      backgroundColor: params.isDark
        ? 'rgba(18, 18, 18, 0.98)'
        : 'rgba(255, 255, 255, 0.98)',
      ...(Platform.OS === 'android' && {
        elevation,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: elevation > 0 ? 2 : 0 },
        shadowOpacity: elevation > 0 ? 0.1 : 0,
        shadowRadius: elevation > 0 ? 4 : 0,
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: params.isDark ? '#333' : '#EEE',
      }),
    },
  };
};

// Opções para telas de formulário (com keyboard avoiding)
export const getFormScreenOptions = (
  params: ScreenOptionsParams,
): NativeStackNavigationOptions => ({
  ...getCommonScreenOptions({ ...params, headerType: 'solid' }),
  headerShown: true,
  headerTitleAlign: 'center' as const,
  contentStyle: {
    backgroundColor: params.theme.backgroundRoot,
    flex: 1,
  },
  ...(Platform.OS === 'ios' && {
    gestureEnabled: false, // Desabilita gestos para evitar perder dados do formulário
  }),
});

// Utilitário para gerar estilo de header personalizado
export const createHeaderStyles = (
  theme: ScreenOptionsParams['theme'],
  isDark: boolean,
) => {
  return StyleSheet.create({
    defaultHeader: {
      backgroundColor: theme.backgroundRoot,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#EEE',
    },
    transparentHeader: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
    solidHeader: {
      backgroundColor: isDark
        ? 'rgba(18, 18, 18, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#EEE',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    blurredHeader: {
      backgroundColor: Platform.select({
        ios: 'transparent',
        android: isDark
          ? 'rgba(18, 18, 18, 0.85)'
          : 'rgba(255, 255, 255, 0.85)',
      }),
    },
    headerTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
      ...Platform.select({
        ios: { fontFamily: 'System' },
        android: { fontFamily: 'sans-serif-medium' },
        web: { fontFamily: 'system-ui' },
      }),
    },
    headerTint: {
      color: theme.primary || Colors.bombeiros.primary,
    },
  });
};

// Hook para usar as opções de tela (se precisar de contexto React)
export const useScreenOptions = (params: ScreenOptionsParams) => {
  const memoizedOptions = React.useMemo(
    () => ({
      common: getCommonScreenOptions(params),
      modal: getModalScreenOptions(params),
      fullScreen: getFullScreenOptions(params),
      solidHeader: getSolidHeaderOptions(params),
      form: getFormScreenOptions(params),
    }),
    [params],
  );

  return memoizedOptions;
};

// Exportando tipos para uso externo
export type { ScreenOptionsParams, HeaderStyleType };
export type ScreenOptionsPreset =
  | 'common'
  | 'modal'
  | 'fullScreen'
  | 'solidHeader'
  | 'form';

// Função principal que exporta todas as opções
export const ScreenOptions = {
  getCommonScreenOptions,
  getModalScreenOptions,
  getFullScreenOptions,
  getSolidHeaderOptions,
  getFormScreenOptions,
  createHeaderStyles,
};
