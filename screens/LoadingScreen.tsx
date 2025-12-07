import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type LoadingScreenProps = {
  message?: string;
  showLogo?: boolean;
  showProgress?: boolean;
  progress?: number; // 0 to 1
  timeout?: number; // milliseconds
  onTimeout?: () => void;
};

export default function LoadingScreen({
  message = 'Carregando...',
  showLogo = true,
  showProgress = false,
  progress = 0,
  timeout,
  onTimeout,
}: LoadingScreenProps) {
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(progress)).current;

  // Animação de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animação de rotação do ícone
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, []);

  // Animação de progresso
  useEffect(() => {
    if (showProgress) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [progress, showProgress]);

  // Timeout para loading muito longo
  useEffect(() => {
    if (timeout && onTimeout) {
      const timer = setTimeout(onTimeout, timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {showLogo && (
          <>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <MaterialIcons
                name="local-fire-department"
                size={80}
                color={colors.bombeiros?.primary || colors.primary}
              />
            </Animated.View>

            <View style={styles.logoContainer}>
              <MaterialIcons
                name="water-drop"
                size={24}
                color={colors.bombeiros?.secondary || colors.secondary}
                style={styles.waterDrop}
              />
              <ThemedText style={[styles.appName, { color: colors.text }]}>
                FYREN
              </ThemedText>
              <MaterialIcons
                name="water-drop"
                size={24}
                color={colors.bombeiros?.secondary || colors.secondary}
                style={[styles.waterDrop, styles.waterDropRight]}
              />
            </View>
          </>
        )}

        {!showLogo && (
          <ActivityIndicator
            size="large"
            color={colors.bombeiros?.primary || colors.primary}
            style={styles.spinner}
          />
        )}

        <ThemedText style={[styles.message, { color: colors.text }]}>
          {message}
        </ThemedText>

        <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
          Corpo de Bombeiros Militar de Pernambuco
        </ThemedText>

        {showProgress && (
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { backgroundColor: colors.border }]}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                    backgroundColor:
                      colors.bombeiros?.primary || colors.primary,
                  },
                ]}
              />
            </View>
            <ThemedText
              style={[styles.progressText, { color: colors.secondary }]}
            >
              {Math.round(progress * 100)}%
            </ThemedText>
          </View>
        )}

        <View style={styles.hintContainer}>
          <MaterialIcons
            name="info"
            size={16}
            color={colors.secondary}
            style={styles.hintIcon}
          />
          <ThemedText style={[styles.hintText, { color: colors.secondary }]}>
            Aguarde enquanto os recursos são carregados
          </ThemedText>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <ThemedText style={[styles.version, { color: colors.secondary }]}>
          v1.0.0 • CBM-PE
        </ThemedText>
      </View>
    </ThemedView>
  );
}

// Componente de loading rápido para uso em outros lugares
export function InlineLoading({
  size = 'small',
  color,
}: {
  size?: 'small' | 'large';
  color?: string;
}) {
  const { colors } = useTheme();

  return (
    <ActivityIndicator size={size} color={color || colors.bombeiros?.primary} />
  );
}

// Componente de loading com texto
export function LoadingWithText({
  text,
  showSpinner = true,
}: {
  text: string;
  showSpinner?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View style={inlineStyles.container}>
      {showSpinner && (
        <ActivityIndicator
          size="small"
          color={colors.bombeiros?.primary}
          style={inlineStyles.spinner}
        />
      )}
      <ThemedText style={[inlineStyles.text, { color: colors.text }]}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
    marginHorizontal: 12,
  },
  waterDrop: {
    opacity: 0.7,
  },
  waterDropRight: {
    transform: [{ rotate: '180deg' }],
  },
  spinner: {
    marginVertical: 30,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  hintIcon: {
    marginRight: 8,
  },
  hintText: {
    fontSize: 12,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    opacity: 0.5,
  },
});

const inlineStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  spinner: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
  },
});

// Hook para gerenciar estado de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [message, setMessage] = React.useState('Carregando...');
  const [progress, setProgress] = React.useState(0);

  const show = React.useCallback((customMessage?: string) => {
    setMessage(customMessage || 'Carregando...');
    setIsLoading(true);
    setProgress(0);
  }, []);

  const hide = React.useCallback(() => {
    setIsLoading(false);
    setProgress(0);
  }, []);

  const updateProgress = React.useCallback((value: number) => {
    setProgress(Math.min(Math.max(value, 0), 1));
  }, []);

  const updateMessage = React.useCallback((newMessage: string) => {
    setMessage(newMessage);
  }, []);

  return {
    isLoading,
    message,
    progress,
    show,
    hide,
    updateProgress,
    updateMessage,
  };
};

// Componente de loading overlay (para usar em telas específicas)
export const LoadingOverlay: React.FC<{
  visible: boolean;
  message?: string;
  opacity?: number;
}> = ({ visible, message = 'Carregando...', opacity = 0.7 }) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View style={overlayStyles.overlay}>
      <View
        style={[
          overlayStyles.container,
          { backgroundColor: `rgba(0,0,0,${opacity})` },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.bombeiros?.primary || '#FFFFFF'}
        />
        <ThemedText style={[overlayStyles.text, { color: '#FFFFFF' }]}>
          {message}
        </ThemedText>
      </View>
    </View>
  );
};

const overlayStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});
