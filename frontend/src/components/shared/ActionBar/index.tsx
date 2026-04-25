import { Search, Plus } from 'lucide-react';
import './style.css';

interface ActionBarProps {
    addButtonLabel: string;
    searchPlaceholder: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick?: () => void;
}

export default function ActionBar({
    addButtonLabel,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    onAddClick,
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
        </div>
    );
}
