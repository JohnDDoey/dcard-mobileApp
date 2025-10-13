'use client';

import { useState } from 'react';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
  showButtons?: boolean;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (toast: Omit<ToastState, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string) => {
    showToast({ message, type: 'success' });
  };

  const showError = (message: string) => {
    showToast({ message, type: 'error' });
  };

  const showWarning = (message: string) => {
    showToast({ message, type: 'warning' });
  };

  const showInfo = (message: string) => {
    showToast({ message, type: 'info' });
  };

  const showConfirm = (message: string, onConfirm: () => void, onCancel?: () => void) => {
    showToast({ 
      message, 
      type: 'warning', 
      showButtons: true, 
      onConfirm, 
      onCancel 
    });
  };

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };
}

