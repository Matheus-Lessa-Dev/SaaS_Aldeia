import { useState } from "react";
import { Trash } from "lucide-react";

export default function ClassCard(props: {
  name: string;
  students?: number;
  href: string;
  onDelete?: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onDelete) {
      setIsConfirmOpen(true);
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
          <div>
            <h4 className="classCardTitle">{props.name}</h4>
            {props.students !== undefined && (
              <p className="classCardDescription">{props.students} alunos</p>
            )}
          </div>
        </div>
        {props.onDelete && (
          <button
            type="button"
            className="cardDeleteButton"
            onClick={handleDeleteClick}
            title="Deletar turma"
            aria-label="Deletar turma"
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
            <p className="deleteConfirmText">Tem certeza que deseja excluir esta turma?</p>
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
