'use client';

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass-card p-4 min-w-[300px] max-w-md animate-slide-in flex items-center space-x-3 ${
            toast.type === 'success' ? 'border-green-500/30' :
            toast.type === 'error' ? 'border-red-500/30' :
            'border-blue-500/30'
          }`}
        >
          <span className="text-xl">
            {toast.type === 'success' ? '✓' :
             toast.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <p className={`text-sm flex-1 ${
            toast.type === 'success' ? 'text-green-400' :
            toast.type === 'error' ? 'text-red-400' :
            'text-blue-400'
          }`}>
            {toast.message}
          </p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/30 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, message: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string) => addToast('success', message);
  const error = (message: string) => addToast('error', message);
  const info = (message: string) => addToast('info', message);

  return { toasts, dismissToast, success, error, info };
}
