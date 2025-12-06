import React, { createContext, useContext, useState, ReactNode, useRef, useCallback } from 'react';
import { Animated, StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextData {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: () => void;
  toast: {
    visible: boolean;
    message: string;
    type: ToastType;
  };
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top' | 'bottom';
  offset?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top',
  offset = 50 
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Usar useTheme para obter cores dinâmicas
  const { colors, isDark } = useTheme();
  const insets = useScreenInsets();

  const showToast = useCallback((toastType: ToastType, toastMessage: string, duration = 3000) => {
    setType(toastType);
    setMessage(toastMessage);
    setVisible(true);

    // Reset da animação
    opacity.setValue(0);

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });
  }, [opacity]);

  const hideToast = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });
  }, [opacity]);

  const getToastColor = (): string => {
    switch (type) {
      case 'success':
        return colors.success || colors.bombeiros?.success || '#4CAF50';
      case 'error':
        return colors.error || colors.bombeiros?.emergency || '#F44336';
      case 'warning':
        return colors.warning || colors.bombeiros?.warning || '#FF9800';
      case 'info':
        return colors.info || colors.bombeiros?.info || '#2196F3';
      default:
        return colors.info || '#2196F3';
    }
  };

  const getToastIcon = (): React.ComponentProps<typeof MaterialIcons>['name'] => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error-outline';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getPositionStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      zIndex: 9999,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    };

    if (position === 'top') {
      return {
        ...baseStyle,
        top: insets.top + offset,
      };
    } else {
      return {
        ...baseStyle,
        bottom: insets.bottom + offset,
      };
    }
  };

  const contextValue: ToastContextData = {
    showToast,
    hideToast,
    toast: { visible, message, type },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {visible && (
        <Animated.View
          style={[
            getPositionStyle(),
            {
              opacity,
              backgroundColor: getToastColor(),
              transform: [
                {
                  translateY: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: position === 'top' ? [-20, 0] : [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <MaterialIcons 
            name={getToastIcon()} 
            size={24} 
            color="#FFFFFF" 
            style={styles.icon}
          />
          <View style={styles.messageContainer}>
            <Text style={styles.messageText} numberOfLines={3}>
              {message}
            </Text>
          </View>
          <MaterialIcons
            name="close"
            size={20}
            color="#FFFFFF"
            onPress={hideToast}
            style={styles.closeIcon}
          />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

// Componente para Toast rápido (hook simplificado)
export const useQuickToast = () => {
  const { showToast } = useToast();
  
  return {
    success: (message: string, duration?: number) => 
      showToast('success', message, duration),
    error: (message: string, duration?: number) => 
      showToast('error', message, duration),
    info: (message: string, duration?: number) => 
      showToast('info', message, duration),
    warning: (message: string, duration?: number) => 
      showToast('warning', message, duration),
  };
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
    marginRight: 12,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeIcon: {
    padding: 4,
  },
});