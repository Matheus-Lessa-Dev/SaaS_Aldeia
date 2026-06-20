import { useEffect, type ReactNode } from "react";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import ActionBar from "../ActionBar";
import type { FeedbackType } from "../FeedbackMessage";
import GenericMainList from "../../feats/genericMainList";
import Header from "../Header";
import { useToast } from "../../../context/ToastContext";
import "./style.css";
import type { ManagementSortOption } from "../../../utils/managementSort";

interface ManagementPageShellProps {
  pageClassName: string;
  layoutClassName: string;
  title: string;
  itemsPerPage?: number;
  addButtonLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;
  sortValue?: ManagementSortOption;
  onSortChange?: (value: ManagementSortOption) => void;
  feedback?: {
    type?: FeedbackType;
    title?: string;
    message: string;
    onDismiss?: () => void;
  };
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterValueOptions?: { value: string; label: string }[];
  children: ReactNode[];
}

export default function ManagementPageShell({
  pageClassName,
  layoutClassName,
  title,
  itemsPerPage,
  addButtonLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onAddClick,
  sortValue,
  onSortChange,
  feedback,
  filterValue,
  onFilterChange,
  filterValueOptions,
  children,
}: ManagementPageShellProps) {
  const { showToast } = useToast();

  useEffect(() => {
    document.body.classList.add(pageClassName);

    return () => {
      document.body.classList.remove(pageClassName);
    };
  }, [pageClassName]);

  useEffect(() => {
    if (!feedback) return;

    showToast(feedback);
    feedback.onDismiss?.();
  }, [feedback, showToast]);

  return (
    <div className={layoutClassName}>
      <DefaultSidebar />
      <div className="managementMain">
        <Header />
        <main className="managementContent">
          <ActionBar
            addButtonLabel={addButtonLabel}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onAddClick={onAddClick}
            sortValue={sortValue}
            onSortChange={onSortChange}
            filterValue={filterValue}
            filterValueOptions={filterValueOptions}
            onFilterChange={onFilterChange}
          />
          <GenericMainList props={{ title, itemsPerPage }}>
            {children}
          </GenericMainList>
        </main>
      </div>
    </div>
  );
}
