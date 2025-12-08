// hooks/useToast.ts - VERSÃO SIMPLIFICADA QUE FUNCIONA
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './useTheme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextData {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export function ToastProvider({ children, position = 'top' }: ToastProviderProps): React.ReactElement {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  
  const { colors } = useTheme();

  const showToast = useCallback((toastType: ToastType, toastMessage: string, duration = 3000) => {
    setType(toastType);
    setMessage(toastMessage);
    setVisible(true);

    if (duration > 0) {
      setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  const getToastColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
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

  const contextValue: ToastContextData = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {visible && (
        <View style={[styles.container, { 
          backgroundColor: getToastColor(),
          top: position === 'top' ? 60 : undefined,
          bottom: position === 'bottom' ? 60 : undefined,
        }]}>
          <MaterialIcons name={getToastIcon()} size={24} color="#FFF" style={styles.icon} />
          <Text style={styles.message} numberOfLines={3}>{message}</Text>
          <TouchableOpacity onPress={hideToast}>
            <MaterialIcons name="close" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
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
    fontWeight: '500' as const,
    marginRight: 12,
  },
});

// Hook de conveniência
export const useToastHook = () => {
  const toast = useToast();
  
  return {
    success: (message: string, duration?: number) => toast.showToast('success', message, duration),
    error: (message: string, duration?: number) => toast.showToast('error', message, duration),
    info: (message: string, duration?: number) => toast.showToast('info', message, duration),
    warning: (message: string, duration?: number) => toast.showToast('warning', message, duration),
    hide: toast.hideToast,
  };
};