import { Search, Plus } from 'lucide-react';
import './style.css';
import type { ManagementSortOption } from '../../../utils/managementSort';

interface ActionBarProps {
    addButtonLabel: string;
    searchPlaceholder: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick?: () => void;
    sortValue?: ManagementSortOption;
    onSortChange?: (value: ManagementSortOption) => void;
}

export default function ActionBar({
    addButtonLabel,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    onAddClick,
    sortValue,
    onSortChange,
}: ActionBarProps) {
    return (
        <div className="managementActionBar">
            <button className="managementAddButton" onClick={onAddClick} type="button">
                <span>{addButtonLabel}</span>
                <Plus size={18} aria-hidden="true" />
            </button>
            <div className="managementSearchContainer">
                <Search size={16} className="managementSearchIcon" aria-hidden="true" />
                <input
                    className="managementSearchInput"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            {sortValue && onSortChange && (
                <label className="managementSortContainer">
                    <select
                        className="managementSortSelect"
                        value={sortValue}
                        onChange={(e) => onSortChange(e.target.value as ManagementSortOption)}
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
