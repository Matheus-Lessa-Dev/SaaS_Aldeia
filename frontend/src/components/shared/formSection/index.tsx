import type { ReactNode } from "react";
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
        <input
          type="text"
          placeholder="Buscar..."
          className="form-section__search-input"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      )}
      <div className="form-section__grid">{children}</div>
    </fieldset>
  );
}
