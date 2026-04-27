import { useEffect, type ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';
import Sidebar1 from '../../sideBar/SideBar1';
import ActionBar from '../ActionBar';
import GenericMainList from '../../genericMainList';
import './style.css';

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
            <Sidebar1 />
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
                    />
                    <GenericMainList props={{ title, itemsPerPage }}>
                        {children}
                    </GenericMainList>
                </main>
            </div>
        </div>
    );
}
