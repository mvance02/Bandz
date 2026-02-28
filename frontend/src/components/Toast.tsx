import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let _nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++_nextId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map(t => {
          const Icon =
            t.type === 'success' ? CheckCircle :
            t.type === 'error' ? AlertCircle : Info;
          const iconClass =
            t.type === 'success' ? 'text-green-primary' :
            t.type === 'error' ? 'text-red-400' : 'text-blue-400';
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-3 bg-bg-secondary border border-border rounded-xl px-4 py-3.5 shadow-2xl min-w-[300px] max-w-[420px]"
            >
              <Icon size={18} className={iconClass} />
              <p className="text-sm text-text-primary font-medium flex-1 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-text-muted hover:text-text-primary transition-colors ml-1 flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
