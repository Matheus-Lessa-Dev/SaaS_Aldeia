import { Search, Plus, Funnel } from "lucide-react";
import "./style.css";
import type { ManagementSortOption } from "../../../utils/managementSort";

interface ActionBarProps {
  addButtonLabel?: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;
  filterValue?: string;
  filterValueOptions?: { value: string; label: string }[];
  onFilterChange?: (value: string) => void;
  sortValue?: ManagementSortOption;
  onSortChange?: (value: ManagementSortOption) => void;
}

export default function ActionBar({
  addButtonLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onAddClick,
  filterValue,
  filterValueOptions,
  onFilterChange,
  sortValue,
  onSortChange,
}: ActionBarProps) {
  return (
    <div className="managementActionBar">
      {addButtonLabel && (
        <button
          className="managementAddButton"
          onClick={onAddClick}
          type="button"
        >
          <span>{addButtonLabel}</span>
          <Plus size={18} aria-hidden="true" />
        </button>
      )}
      <div className="managementSearchContainer">
        <Search size={16} className="managementSearchIcon" aria-hidden="true" />
        <input
          className="managementSearchInput"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {filterValue && onFilterChange && (
        <div className="managementFilterContainer">
          <Funnel
            size={16}
            className="managementFilterIcon"
            aria-hidden="true"
          />
          <select
            className="managementSortSelect"
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {filterValueOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {sortValue && onSortChange && (
        <label className="managementSortContainer">
          <select
            className="managementSortSelect"
            value={sortValue}
            onChange={(e) =>
              onSortChange(e.target.value as ManagementSortOption)
            }
            aria-label="Ordenar lista"
          >
            <option value="nameAsc">Nome A-Z</option>
            <option value="newest">Mais novo</option>
            <option value="oldest">Mais antigo</option>
          </select>
        </label>
      )}
    </div>
  );
}
