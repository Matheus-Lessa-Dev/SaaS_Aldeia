import { useState, type ReactNode } from "react";
import "./style.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function GenericMainList({
  children,
  props,
}: {
  children: ReactNode[];
  props: { title: string; itemsPerPage?: number };
}) {
  const DEFAULT_ITEMS_PER_PAGE = 5;
  const MIN_ITEMS_PER_PAGE = 1;
  const MAX_ITEMS_PER_PAGE = 6;

  const rawItemsPerPage = props.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE;
  const itemsPerPage = Math.min(
    MAX_ITEMS_PER_PAGE,
    Math.max(MIN_ITEMS_PER_PAGE, Math.floor(rawItemsPerPage)),
  );

  const [page, setPage] = useState(1);

  const itemsShown = children?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="classesListContainer">
      <h3 className="classesListTitle">{props.title}</h3>
      <div className="classesList">{itemsShown}</div>
      <div className="classesListControls">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <button onClick={() => setPage(page + 1)}
          disabled={page * itemsPerPage >= children.length}>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
