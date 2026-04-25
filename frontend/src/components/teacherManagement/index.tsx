import { useSearch } from "../../hooks/useSearch";
import ManagementPageShell from "../shared/ManagementPageShell";
import TeacherCard from "./teacherCard";
import "./style.css";

export default function TeacherManagement() {
    const teachers = [
        { name: "João", href: "/professores/1" },
        { name: "Maria", href: "/professores/2" },
        { name: "Carlos", href: "/professores/3" },
        { name: "Ana", href: "/professores/4" },
        { name: "DSADASD", href: "/professores/5" },
        { name: "AASDASDASna", href: "/professores/6" },
        { name: "ASDASAASDASna", href: "/professores/6" },
        { name: "ASD", href: "/professores/6" },
    ];

    const { searchTerm, setSearchTerm, filteredItems } = useSearch(teachers);

    const teacherElements = filteredItems.map((teacherInfo) => (
        <TeacherCard
            key={teacherInfo.name}
            name={teacherInfo.name}
            href={teacherInfo.href}
        />
    ));

    return (
        <ManagementPageShell
            pageClassName="teacherManagementPage"
            layoutClassName="managementPageLayout"
            title="Professores"
            itemsPerPage={8}
            addButtonLabel="Adicionar Professor"
            searchPlaceholder="Pesquisar Professor"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
        >
            {teacherElements}
        </ManagementPageShell>
    );
}
