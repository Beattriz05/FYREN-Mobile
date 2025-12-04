import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  
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
  
  // Adicionamos um espaçamento extra (Spacing.lg = 16) para o conteúdo não colar no header
  const topPadding = headerHeight + 16; 

  return {
    top: topPadding, 
    bottom: insets.bottom + tabBarHeight,
    left: insets.left,
    right: insets.right,
    scrollInsetBottom: insets.bottom + tabBarHeight,
  };
}