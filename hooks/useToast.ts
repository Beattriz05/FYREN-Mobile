import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';


type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextData {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const opacity = useRef(new Animated.Value(0)).current; // useRef para preservar o valor
  
  // Usar useTheme para obter cores dinâmicas
  const { colors } = useTheme();

  const showToast = (toastType: ToastType, toastMessage: string, duration = 3000) => {
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
  };

  const hideToast = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });
  };

  const getToastColor = () => {
    switch (type) {
      case 'success':
        return colors.success || '#4CAF50'; // Fallback
      case 'error':
        return colors.error || '#F44336';
      case 'warning':
        return colors.warning || '#FF9800';
      case 'info':
        return colors.info || '#2196F3';
      default:
        return colors.info || '#2196F3';
    }
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity,
              transform: [
                {
                  translateY: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
              backgroundColor: getToastColor(),
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
            <Text style={styles.messageText}>{message}</Text>
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

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  messageContainer: {
    flex: 1,
    marginRight: 12,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  closeIcon: {
    padding: 4,
  },
});