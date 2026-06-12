import { useEffect, type ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';
import DefaultSidebar from '../../solos/sideBar/DefaultSidebar';
import ActionBar from '../ActionBar';
import GenericMainList from '../../feats/genericMainList';
import './style.css';
import type { ManagementSortOption } from '../../../utils/managementSort';

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
    children,
}: ManagementPageShellProps) {
    useEffect(() => {
        document.body.classList.add(pageClassName);

        return () => {
            document.body.classList.remove(pageClassName);
        };
    }, [pageClassName]);

    return (
        <div className={layoutClassName}>
            <DefaultSidebar />
            <div className="managementMain">
                <header className="managementHeader">
                    <button type="button" className="dashboardHeaderBtn">
                        <span>Educador</span>
                        <GraduationCap size={18} aria-hidden="true" />
                    </button>
                </header>
                <main className="managementContent">
                    <ActionBar
                        addButtonLabel={addButtonLabel}
                        searchPlaceholder={searchPlaceholder}
                        searchValue={searchValue}
                        onSearchChange={onSearchChange}
                        onAddClick={onAddClick}
                        sortValue={sortValue}
                        onSortChange={onSortChange}
                    />
                    <GenericMainList props={{ title, itemsPerPage }}>
                        {children}
                    </GenericMainList>
                </main>
            </div>
        </div>
    );
}
