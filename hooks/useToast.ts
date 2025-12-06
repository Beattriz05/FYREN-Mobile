import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useRef, 
  useCallback 
} from 'react';
import { 
  Animated, 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextData {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top' 
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const opacity = useRef(new Animated.Value(0)).current;
  
  const { colors } = useTheme();
  const insets = useScreenInsets();

  const showToast = useCallback((toastType: ToastType, toastMessage: string, duration = 3000) => {
    setType(toastType);
    setMessage(toastMessage);
    setVisible(true);
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
    ]).start(({ finished }) => finished && setVisible(false));
  }, [opacity]);

  const hideToast = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => finished && setVisible(false));
  }, [opacity]);

  const getToastColor = () => {
    const colorsObj = colors as any;
    switch (type) {
      case 'success': return colorsObj?.bombeiros?.success || '#4CAF50';
      case 'error': return colorsObj?.bombeiros?.emergency || '#F44336';
      case 'warning': return colorsObj?.bombeiros?.warning || '#FF9800';
      case 'info': return colorsObj?.bombeiros?.info || '#2196F3';
      default: return '#2196F3';
    }
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'error-outline';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const positionStyle = {
    position: 'absolute' as const,
    left: 20,
    right: 20,
    top: position === 'top' ? insets.top + 50 : undefined,
    bottom: position === 'bottom' ? insets.bottom + 50 : undefined,
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            positionStyle,
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
          <MaterialIcons name={getToastIcon()} size={24} color="#FFF" style={styles.icon} />
          <Text style={styles.message} numberOfLines={3}>{message}</Text>
          <TouchableOpacity onPress={hideToast}>
            <MaterialIcons name="close" size={20} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    zIndex: 10000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
});