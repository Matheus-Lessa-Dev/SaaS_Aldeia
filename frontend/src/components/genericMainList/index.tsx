import { useState, type ReactNode } from "react";
import "./style.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function genericMainList(children: ReactNode[]) {
  const MAX_ITEMS_SHOWN = 5;

  const [page, setPage] = useState(1);

  const itemsShown = children.slice(
    (page - 1) * MAX_ITEMS_SHOWN,
    page * MAX_ITEMS_SHOWN,
  );

  return (
    <div className="classesListContainer">
      <h3 className="classesListTitle">Turmas</h3>
      <div className="classesList">{itemsShown}</div>
      <div className="classesListControls">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * MAX_ITEMS_SHOWN >= children.length}
        >
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
