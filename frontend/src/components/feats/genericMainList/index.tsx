import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(children.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [children.length, itemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [location.pathname]);

  const currentPage = Math.min(page, totalPages);

  const itemsShown = children?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="classesListContainer">
      <h3 className="classesListTitle">{props.title}</h3>
      <div className="classesList">{itemsShown}</div>
      <div className="classesListControls">
        <button onClick={() => setPage((currentPage) => currentPage - 1)} disabled={currentPage === 1}>
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <button
          onClick={() => setPage((currentPage) => currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
