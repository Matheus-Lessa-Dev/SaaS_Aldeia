import { useSearch } from "../../hooks/useSearch";
import ManagementPageShell from "../shared/ManagementPageShell";
import ClassCard from "./classCard";
import "./style.css";

export default function ClassManagement() {
  const classes = [
    { name: "Turma 1", students: 20, href: "/turmas/turma-1" },
    { name: "Turma 2", students: 15, href: "/turmas/turma-2" },
    { name: "Turma 3", students: 30, href: "/turmas/turma-3" },
    { name: "Turma 4", students: 25, href: "/turmas/turma-4" },
    { name: "Turma 5", students: 35, href: "/turmas/turma-5" },
    { name: "Turma 6", students: 40, href: "/turmas/turma-6" },
  ];

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(classes);

  const classesElements = filteredItems.map((classInfo) => (
    <ClassCard
      key={classInfo.name}
      name={classInfo.name}
      students={classInfo.students}
      href={classInfo.href}
    />
  ));

  return (
    <ManagementPageShell
      pageClassName="classManagementPage"
      layoutClassName="managementPageLayout"
      title="Turmas"
      itemsPerPage={5}
      addButtonLabel="Adicionar Turma"
      searchPlaceholder="Pesquisar turma"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {classesElements}
    </ManagementPageShell>
  );
}
