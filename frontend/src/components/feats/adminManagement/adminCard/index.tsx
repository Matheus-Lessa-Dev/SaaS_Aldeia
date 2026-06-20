import { useState } from "react";
import { Edit, Trash } from "lucide-react";

export default function AdminCard(props: {
  name: string;
  email: string;
  href?: string;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (props.onDelete) {
      setIsConfirmOpen(true);
    }
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    props.onEdit?.();
  };

  const cardContent = (
    <>
      <div className="cardContent">
        <h4 className="classCardTitle">{props.name}</h4>
        <span className="adminCardEmail">{props.email}</span>
      </div>
      {props.onEdit && (
        <button
          type="button"
          className="cardEditButton"
          onClick={handleEditClick}
          title="Editar administrador"
          aria-label="Editar administrador"
        >
          <Edit size={18} />
        </button>
      )}
      {props.onDelete && (
        <button
          type="button"
          className="cardDeleteButton"
          onClick={handleDeleteClick}
          title="Deletar administrador"
          aria-label="Deletar administrador"
        >
          <Trash size={18} />
        </button>
      )}
    </>
  );

  return (
    <>
      {props.href ? (
        <a href={props.href} className="classCard">
          {cardContent}
        </a>
      ) : (
        <div className="classCard">
          {cardContent}
        </div>
      )}

      {isConfirmOpen && (
        <div
          className="deleteConfirmOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmacao de exclusao"
          onClick={() => setIsConfirmOpen(false)}
        >
          <div className="deleteConfirmModal" onClick={(event) => event.stopPropagation()}>
            <h5 className="deleteConfirmTitle">Confirmar exclusao</h5>
            <p className="deleteConfirmText">Tem certeza que deseja excluir este administrador?</p>
            <div className="deleteConfirmActions">
              <button
                type="button"
                className="deleteConfirmCancelButton"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="deleteConfirmConfirmButton"
                onClick={() => {
                  props.onDelete?.();
                  setIsConfirmOpen(false);
                }}
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
