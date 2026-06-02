import { useState } from "react";
import { Clock3, Edit, Trash } from "lucide-react";

export default function GameCard(props: {
  name: string;
  time?: number;
  enabled: boolean;
  href: string;
  onToggleEnabled?: (enabled: boolean) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (props.onDelete) setIsConfirmOpen(true);
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    props.onEdit?.();
  };

  const handleConfirmDelete = () => {
    props.onDelete?.();
    setIsConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    props.onToggleEnabled?.(event.target.checked);
  };

  return (
    <>
      <a href={props.href} className={`classCard gameCard${props.enabled ? "" : " gameCard--disabled"}`}>
        <label
          className="gameCardSwitch"
          aria-label={props.enabled ? "Desabilitar jogo" : "Habilitar jogo"}
          onClick={(event) => event.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={props.enabled === true}
            onChange={handleToggleChange}
          />
          <span className="gameCardSwitchTrack">
            <span className="gameCardSwitchThumb" />
          </span>
        </label>
        <div className="cardContent">
          <span className={`gameCardStatus${props.enabled ? "" : " gameCardStatus--disabled"}`}>
            {props.enabled ? "Habilitado" : "Desabilitado"}
          </span>
          <h4 className="classCardTitle gameCardTitle">{props.name}</h4>
          {props.time && (
            <p className="classCardDescription gameCardDescription">
              <Clock3 size={14} aria-hidden="true" />
              <span>{props.time} minutos</span>
            </p>
          )}
        </div>
        {props.onEdit && (
          <button
            type="button"
            className="cardEditButton"
            onClick={handleEditClick}
            title="Editar jogo"
            aria-label="Editar jogo"
          >
            <Edit size={18} />
          </button>
        )}
        {props.onDelete && (
          <button
            type="button"
            className="cardDeleteButton"
            onClick={handleDeleteClick}
            title="Deletar jogo"
            aria-label="Deletar jogo"
          >
            <Trash size={18} />
          </button>
        )}
      </a>

      {isConfirmOpen && (
        <div
          className="deleteConfirmOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmacao de exclusao"
          onClick={handleCancelDelete}
        >
          <div className="deleteConfirmModal" onClick={(event) => event.stopPropagation()}>
            <h5 className="deleteConfirmTitle">Confirmar exclusao</h5>
            <p className="deleteConfirmText">Tem certeza que deseja excluir este jogo?</p>
            <div className="deleteConfirmActions">
              <button
                type="button"
                className="deleteConfirmCancelButton"
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="deleteConfirmConfirmButton"
                onClick={handleConfirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
