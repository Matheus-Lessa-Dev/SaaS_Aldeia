import { useState } from "react";
import { useSearch } from "../../../hooks/useSearch";
import ManagementPageShell from "../../shared/ManagementPageShell";
import TeacherCard from "./teacherCard";
import "./style.css";

interface TeacherInfo {
    name: string;
    href: string;
    id?: string;
}

export default function TeacherManagement() {
    const initialTeachers: TeacherInfo[] = [
        { name: "João", href: "/professores/1" },
        { name: "Maria", href: "/professores/2" },
        { name: "Carlos", href: "/professores/3" },
        { name: "Ana", href: "/professores/4" },
        { name: "DSADASD", href: "/professores/5" },
        { name: "AASDASDASna", href: "/professores/6" },
        { name: "ASDASAASDASna", href: "/professores/6" },
        { name: "ASD", href: "/professores/6" },
    ];

    const [teachers, setTeachers] = useState(initialTeachers);
    const { searchTerm, setSearchTerm, filteredItems } = useSearch(teachers);

    const handleDeleteTeacher = (teacherInfo: TeacherInfo) => {
        // TODO: Implementar chamada de API para deletar o professor no backend
        // await deleteTeacherAPI(teacherInfo.id);
        
        setTeachers(teachers.filter((t) => t.name !== teacherInfo.name));
    };

    const teacherElements = filteredItems.map((teacherInfo) => (
        <TeacherCard
            key={teacherInfo.name}
            name={teacherInfo.name}
            href={teacherInfo.href}
            onDelete={() => handleDeleteTeacher(teacherInfo)}
        />
    ));

    return (
        <ManagementPageShell
            pageClassName="teacherManagementPage"
            layoutClassName="managementPageLayout"
            title="Professores"
            itemsPerPage={6}
            addButtonLabel="Adicionar Professor"
            searchPlaceholder="Pesquisar Professor"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
        >
            {teacherElements}
        </ManagementPageShell>
    );
}
