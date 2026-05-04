import "./style.css";

export default function ConfirmationPrompt(props: {
  promptTitle: string;
  promptMessage: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="confirmation-prompt">
      <div className="confirmation-prompt__content">
        <h2>{props.promptTitle}</h2>
        <p>{props.promptMessage}</p>
        <div className="confirmation-prompt__buttons">
          <button
            type="button"
            className="confirmation-prompt__cancel-btn"
            onClick={props.onCancel}
          >
            {props.cancelText || "Cancelar"}
          </button>
          <button
            type="button"
            className="confirmation-prompt__confirm-btn"
            onClick={props.onConfirm}
          >
            {props.confirmText || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
