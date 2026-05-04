import { useState } from "react";
import { Trash, Edit } from "lucide-react";

export default function StudentCard(props: {
  name: string;
  href: string;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onDelete) {
      setIsConfirmOpen(true);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onEdit) {
      props.onEdit();
    }
  };

  const handleConfirmDelete = () => {
    if (props.onDelete) {
      props.onDelete();
    }
    setIsConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <a href={props.href} className="classCard">
        <div className="cardContent">
          <h4 className="classCardTitle">{props.name}</h4>
        </div>
        {props.onEdit && (
          <button
            type="button"
            className="cardEditButton"
            onClick={handleEditClick}
            title="Editar aluno"
            aria-label="Editar aluno"
          >
            <Edit size={18} />
          </button>
        )}
        {props.onDelete && (
          <button
            type="button"
            className="cardDeleteButton"
            onClick={handleDeleteClick}
            title="Deletar aluno"
            aria-label="Deletar aluno"
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
          aria-label="Confirmação de exclusão"
          onClick={handleCancelDelete}
        >
          <div className="deleteConfirmModal" onClick={(e) => e.stopPropagation()}>
            <h5 className="deleteConfirmTitle">Confirmar exclusão</h5>
            <p className="deleteConfirmText">Tem certeza que deseja excluir este aluno?</p>
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
