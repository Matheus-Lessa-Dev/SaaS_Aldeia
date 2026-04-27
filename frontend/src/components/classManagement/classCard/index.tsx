import { Trash } from "lucide-react";

export default function ClassCard(props: {
  name: string;
  students?: number;
  href: string;
  onDelete?: () => void;
}) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onDelete) {
      props.onDelete();
    }
  };

  return (
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
          className="cardDeleteButton"
          onClick={handleDelete}
          title="Deletar turma"
          aria-label="Deletar turma"
        >
          <Trash size={18} />
        </button>
      )}
    </a>
  );
}
