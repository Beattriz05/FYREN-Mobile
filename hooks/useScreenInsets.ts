import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  
  let headerHeight = 0;
  try {
    headerHeight = useHeaderHeight();
  } catch (error) {
    // Header não disponível, usar valor padrão
    console.log('Header não disponível, usando valor padrão');
  }
  
  // Se você também usa tab bar, faça o mesmo:
  let tabBarHeight = 0;
  try {
    const { useBottomTabBarHeight } = require('@react-navigation/bottom-tabs');
    tabBarHeight = useBottomTabBarHeight();
  } catch (error) {
    // Tab bar não disponível
  }
  
  return {
    top: insets.top + headerHeight,
    bottom: insets.bottom + tabBarHeight,
    left: insets.left,
    right: insets.right,
  };
}