import type { ReactNode } from "react";
import { Search } from "lucide-react";
import "./style.css";

type FormSectionProps = {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
};

export function FormSection({
  title,
  icon,
  children,
  searchable = false,
  onSearch,
}: FormSectionProps) {
  return (
    <fieldset className="form-section">
      {title && (
        <legend className="form-section__legend">
          {icon && <span className="form-section__icon-wrapper">{icon}</span>}
          {title}
        </legend>
      )}
      {searchable && (
        <div className="form-section__search-container">
          <Search size={16} className="form-section__search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar..."
            className="form-section__search-input"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      )}
      <div className="form-section__grid">{children}</div>
    </fieldset>
  );
}
