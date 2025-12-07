import React from 'react';
import { View, StyleSheet, Image, ViewStyle, ImageStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Feather.glyphMap; // Ícone do Feather
  customIcon?: any; // Para usar a imagem personalizada
  showDefaultIcon?: boolean; // Se deve mostrar o ícone padrão da sua logo
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center';
  style?: ViewStyle;
  iconStyle?: ImageStyle;
  titleStyle?: any;
  subtitleStyle?: any;
  testID?: string;
}

export function HeaderTitle({
  title,
  subtitle,
  icon,
  customIcon,
  showDefaultIcon = true, // Por padrão mostra o ícone da logo
  size = 'medium',
  align = 'left',
  style,
  iconStyle,
  titleStyle,
  subtitleStyle,
  testID = 'header-title',
}: HeaderTitleProps) {
  const { colors } = useTheme();

  // Tamanhos baseados no prop size
  const sizeConfig = {
    small: {
      iconSize: 24,
      titleSize: 16,
      subtitleSize: 11,
      spacing: Spacing.xs,
    },
    medium: {
      iconSize: 28,
      titleSize: 17,
      subtitleSize: 12,
      spacing: Spacing.sm,
    },
    large: {
      iconSize: 32,
      titleSize: 20,
      subtitleSize: 14,
      spacing: Spacing.md,
    },
  };

  const config = sizeConfig[size];

  const getIconSource = () => {
    if (customIcon) return customIcon;
    if (icon) return null; // Se for ícone do Feather, não usa imagem
    return require('../assets/images/icon.png');
  };

  const iconSource = getIconSource();
  const showIcon = showDefaultIcon && (iconSource || icon);

  return (
    <View
      style={[
        styles.container,
        { alignItems: align === 'center' ? 'center' : 'flex-start' },
        style,
      ]}
      testID={testID}
    >
      {showIcon && (
        <View style={styles.iconWrapper}>
          {icon ? (
            // Ícone do Feather
            <View
              style={[
                styles.iconContainer,
                {
                  width: config.iconSize,
                  height: config.iconSize,
                  backgroundColor: colors.primary
                    ? colors.primary + '20'
                    : '#007AFF20', // Fallback
                },
              ]}
            >
              <Feather
                name={icon}
                size={config.iconSize * 0.6}
                color={colors.primary || '#007AFF'} // Fallback
              />
            </View>
          ) : iconSource ? (
            // Imagem personalizada
            <Image
              source={iconSource}
              style={[
                styles.icon,
                {
                  width: config.iconSize,
                  height: config.iconSize,
                  borderRadius: BorderRadius.sm,
                },
                iconStyle,
              ]}
              resizeMode="contain"
            />
          ) : null}
        </View>
      )}

      <View
        style={[
          styles.textContainer,
          { marginLeft: showIcon ? config.spacing : 0 },
        ]}
      >
        <ThemedText
          style={[
            styles.title,
            {
              fontSize: config.titleSize,
              fontWeight: size === 'large' ? '700' : '600',
              color: colors.text,
              textAlign: align === 'center' ? 'center' : 'left',
            },
            titleStyle,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </ThemedText>

        {subtitle && (
          <ThemedText
            style={[
              styles.subtitle,
              {
                fontSize: config.subtitleSize,
                color: colors.secondary,
                marginTop: 2,
                textAlign: align === 'center' ? 'center' : 'left',
              },
              subtitleStyle,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {subtitle}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

// Componente complementar para botões no header
export function HeaderButton({
  icon,
  onPress,
  color,
  size = 24,
  badge,
  badgeColor,
  testID,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  color?: string;
  size?: number;
  badge?: number;
  badgeColor?: string;
  testID?: string;
}) {
  const { colors } = useTheme();

  // Usar uma cor disponível no seu tema ou uma cor padrão
  const defaultBadgeColor = colors.error || colors.primary || '#FF3B30'; // Fallback

  return (
    <View style={styles.buttonContainer}>
      <Feather
        name={icon}
        size={size}
        color={color || colors.text}
        onPress={onPress}
        style={styles.buttonIcon}
        testID={testID}
      />
      {badge && badge > 0 && (
        <View
          style={[
            styles.badge,
            { backgroundColor: badgeColor || defaultBadgeColor },
          ]}
        >
          <ThemedText style={styles.badgeText}>
            {badge > 9 ? '9+' : badge}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

// Helper para criar configurações de header rapidamente
export const createHeaderOptions = (
  title: string,
  options?: {
    subtitle?: string;
    icon?: keyof typeof Feather.glyphMap;
    customIcon?: any;
    showDefaultIcon?: boolean;
    size?: 'small' | 'medium' | 'large';
    align?: 'left' | 'center';
    headerLeft?: React.ReactNode;
    headerRight?: React.ReactNode;
    headerBackground?: React.ReactNode;
  },
) => {
  return {
    headerTitle: () => (
      <HeaderTitle
        title={title}
        subtitle={options?.subtitle}
        icon={options?.icon}
        customIcon={options?.customIcon}
        showDefaultIcon={options?.showDefaultIcon}
        size={options?.size}
        align={options?.align}
      />
    ),
    headerLeft: options?.headerLeft ? () => options.headerLeft : undefined,
    headerRight: options?.headerRight ? () => options.headerRight : undefined,
    headerBackground: options?.headerBackground
      ? () => options.headerBackground
      : undefined,
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    // Estilos base para ícone de imagem
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    lineHeight: 20,
  },
  subtitle: {
    opacity: 0.8,
    lineHeight: 14,
  },
  buttonContainer: {
    marginHorizontal: Spacing.sm,
    padding: Spacing.xs,
    position: 'relative',
  },
  buttonIcon: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});

// Componente HeaderTitle simplificado (backward compatibility)
export function SimpleHeaderTitle({ title }: { title: string }) {
  return <HeaderTitle title={title} />;
}
