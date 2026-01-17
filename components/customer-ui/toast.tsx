'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: ToastAction;
  onClose?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-dismiss after duration
    if (toast.duration !== 0 && toast.duration !== undefined) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
        toast.onClose?.();
      }, toast.duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      toast?.onClose?.();
      return prev.filter(t => t.id !== id);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastMessage key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastMessageProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastMessage({ toast, onDismiss }: ToastMessageProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  return (
    <div className={`${bgColors[toast.type]} border rounded-lg shadow-lg p-4 w-80 animate-in slide-in-from-right-10`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`${iconColors[toast.type]} flex-shrink-0`}>
          {icons[toast.type]}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${textColors[toast.type]}`}>{toast.title}</h4>
          <p className={`text-sm mt-1 ${textColors[toast.type]}`}>{toast.message}</p>
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  toast.type === 'warning' 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : toast.type === 'error'
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className={`flex-shrink-0 ${textColors[toast.type]} hover:opacity-70`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}