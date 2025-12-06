import { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastContextData {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: () => void;
  toast: {
    visible: boolean;
    message: string;
    type: ToastType;
  };
}

export interface ToastProviderProps {
  children: ReactNode;
  position?: 'top' | 'bottom';
  offset?: number;
}

export interface ToastComponentProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
}