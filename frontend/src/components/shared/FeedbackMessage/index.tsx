import { AlertCircle, CheckCircle2, Info, X, TriangleAlert } from "lucide-react";
import "./style.css";

export type FeedbackType = "error" | "success" | "warning" | "info";

type FeedbackMessageProps = {
  type?: FeedbackType;
  title?: string;
  message: string;
  onDismiss?: () => void;
};

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
  info: Info,
};

export default function FeedbackMessage({
  type = "info",
  title,
  message,
  onDismiss,
}: FeedbackMessageProps) {
  const Icon = icons[type];

  return (
    <div className={`feedback-message feedback-message--${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon className="feedback-message__icon" size={18} aria-hidden="true" />
      <div className="feedback-message__content">
        {title && <strong>{title}</strong>}
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="feedback-message__dismiss"
          onClick={onDismiss}
          aria-label="Fechar mensagem"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

