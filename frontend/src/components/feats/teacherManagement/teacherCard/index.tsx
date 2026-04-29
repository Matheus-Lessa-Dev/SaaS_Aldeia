import { Trash } from "lucide-react";

export default function TeacherCard(props: {
    name: string;
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
                <h4 className="classCardTitle">{props.name}</h4>
            </div>
            {props.onDelete && (
                <button
                    className="cardDeleteButton"
                    onClick={handleDelete}
                    title="Deletar professor"
                    aria-label="Deletar professor"
                >
                    <Trash size={18} />
                </button>
            )}
        </a>
    );
}
