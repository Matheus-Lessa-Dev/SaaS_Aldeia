import { useSearch } from "../../hooks/useSearch";
import ManagementPageShell from "../shared/ManagementPageShell";
import StudentCard from "./studentCard";
import "./style.css";

export default function StudentManagement() {
  const students = [
    { name: "Fernando", href: "/alunos/1" },
    { name: "Ana", href: "/alunos/2" },
    { name: "Claudio", href: "/alunos/3" },
    { name: "Pedro", href: "/alunos/4" },
    { name: "Rebeca", href: "/alunos/5" },
    { name: "Matheus", href: "/alunos/6" },
  ];

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(students);

  const studentElements = filteredItems.map((studentInfo) => (
    <StudentCard
      key={studentInfo.name}
      name={studentInfo.name}
      href={studentInfo.href}
    />
  ));

  return (
    <ManagementPageShell
      pageClassName="studentManagementPage"
      layoutClassName="managementPageLayout"
      title="Alunos"
      itemsPerPage={8}
      addButtonLabel="Adicionar Aluno"
      searchPlaceholder="Pesquisar Aluno"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {studentElements}
    </ManagementPageShell>
  );
}
