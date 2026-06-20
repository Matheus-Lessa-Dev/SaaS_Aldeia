import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import type { FeedbackType } from "../components/shared/FeedbackMessage";
import "./ToastContext.css";

type ToastInput = {
  type?: FeedbackType;
  title?: string;
  message: string;
};

type ToastItem = ToastInput & {
  id: number;
  type: FeedbackType;
};

type ToastContextType = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = Date.now() + Math.random();
      const nextToast: ToastItem = {
        id,
        type: toast.type ?? "info",
        title: toast.title,
        message: toast.message,
      };

      setToasts((current) => [...current, nextToast].slice(-2));
      window.setTimeout(() => dismissToast(id), 4800);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toastContainer" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`toast toast--${toast.type}`}
              role={toast.type === "error" ? "alert" : "status"}
            >
              <Icon className="toast__icon" size={18} aria-hidden="true" />
              <div className="toast__content">
                {toast.title && <strong>{toast.title}</strong>}
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                className="toast__dismiss"
                onClick={() => dismissToast(toast.id)}
                aria-label="Fechar notificacao"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
}
