import React from 'react';
import { FlatList, FlatListProps, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useScreenInsets } from '@/hooks/useScreenInsets';
import { Spacing } from '@/constants/theme';

interface ScreenFlatListProps<T> extends FlatListProps<T> {
  noHorizontalPadding?: boolean;
  extraTopPadding?: number;
  extraBottomPadding?: number;
  contentPadding?: number;
}

export function ScreenFlatList<T>({
  contentContainerStyle,
  style,
  noHorizontalPadding = false,
  extraTopPadding = 0,
  extraBottomPadding = 0,
  contentPadding = Spacing.xl,
  ...flatListProps
}: ScreenFlatListProps<T>) {
  const { colors } = useTheme();
  const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.backgroundRoot,
  };

  const contentContainer: ViewStyle = {
    paddingTop: paddingTop + extraTopPadding,
    paddingBottom: paddingBottom + extraBottomPadding,
    paddingHorizontal: noHorizontalPadding ? 0 : contentPadding,
  };

  return (
    <FlatList
      style={[containerStyle, style]}
      contentContainerStyle={[contentContainer, contentContainerStyle]}
      scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...flatListProps}
    />
  );
}

// Componente para telas com header fixo
export function ScreenFlatListWithFixedHeader<T>({
  headerHeight,
  ...props
}: ScreenFlatListProps<T> & { headerHeight: number }) {
  const insets = useScreenInsets();

  return (
    <ScreenFlatList
      {...props}
      extraTopPadding={headerHeight}
      scrollIndicatorInsets={{
        bottom: insets.scrollInsetBottom,
        top: headerHeight, // Para iOS scroll indicator não ficar atrás do header
      }}
    />
  );
}
