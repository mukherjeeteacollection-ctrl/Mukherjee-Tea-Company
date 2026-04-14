'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  icon?: string;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], icon?: string) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success', icon?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ICONS: Record<Toast['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const COLORS: Record<Toast['type'], string> = {
  success: '#4ade80',
  error: '#f87171',
  info: '#60a5fa',
  warning: '#fbbf24',
};

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => (
  <div className="toast-container">
    {toasts.map(toast => (
      <div key={toast.id} className="toast" style={{ borderColor: `${COLORS[toast.type]}33` }}>
        <span style={{
          color: COLORS[toast.type],
          fontWeight: 700,
          fontSize: '0.85rem',
          width: 20, textAlign: 'center',
        }}>
          {toast.icon || ICONS[toast.type]}
        </span>
        <span style={{ flex: 1, fontSize: '0.9rem' }}>{toast.message}</span>
        <button
          onClick={() => removeToast(toast.id)}
          style={{ color: 'rgba(240,234,214,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontSize: '0.8rem' }}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
