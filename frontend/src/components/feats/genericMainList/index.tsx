import { Children, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

type GenericMainListProps = {
  title: string;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
};

export default function GenericMainList({
  children,
  props,
}: {
  children: ReactNode;
  props: GenericMainListProps;
}) {
  const DEFAULT_ITEMS_PER_PAGE = 5;
  const MIN_ITEMS_PER_PAGE = 1;

  const normalizePageSize = (value: number) =>
    Math.max(MIN_ITEMS_PER_PAGE, Math.floor(value));

  const initialItemsPerPage = normalizePageSize(
    props.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE,
  );
  const pageSizeOptions = useMemo(() => {
    const options = props.pageSizeOptions ?? [5, 10, 15, 20];
    const normalizedOptions = options.map(normalizePageSize);

    if (!normalizedOptions.includes(initialItemsPerPage)) {
      normalizedOptions.push(initialItemsPerPage);
    }

    return Array.from(new Set(normalizedOptions)).sort((a, b) => a - b);
  }, [initialItemsPerPage, props.pageSizeOptions]);

  const location = useLocation();

  const items = useMemo(
    () =>
      Children.toArray(children).filter(
        (child) => child !== null && child !== undefined && typeof child !== "boolean",
      ),
    [children],
  );
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [items.length, itemsPerPage]);

  useEffect(() => {
    setItemsPerPage(initialItemsPerPage);
  }, [initialItemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [location.pathname]);

  const currentPage = Math.min(page, totalPages);

  const itemsShown = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="classesListContainer">
      <div className="classesListHeader">
        <h3 className="classesListTitle">{props.title}</h3>
        <label className="classesListPageSize">
          <span>Registros</span>
          <select
            value={itemsPerPage}
            onChange={(event) => setItemsPerPage(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="classesList">{itemsShown}</div>
      <div className="classesListControls">
        <span className="classesListPageInfo">
          Pagina {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          aria-label="Pagina anterior"
          onClick={() => setPage((currentPage) => currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Proxima pagina"
          onClick={() => setPage((currentPage) => currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
