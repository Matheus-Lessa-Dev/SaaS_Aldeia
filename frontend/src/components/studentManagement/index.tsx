import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import ManagementPageShell from "../shared/ManagementPageShell";
import StudentCard from "./studentCard";
import "./style.css";

interface StudentInfo {
  name: string;
  href: string;
  id?: string;
}

export default function StudentManagement() {
  const navigate = useNavigate();

  const initialStudents: StudentInfo[] = [
    { name: "Fernando", href: "/alunos/1" },
    { name: "Ana", href: "/alunos/2" },
    { name: "Claudio", href: "/alunos/3" },
    { name: "Pedro", href: "/alunos/4" },
    { name: "Rebeca", href: "/alunos/5" },
    { name: "Matheus", href: "/alunos/6" },
  ];

  const [students, setStudents] = useState(initialStudents);
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(students);

  const handleDeleteStudent = (studentInfo: StudentInfo) => {
    // TODO: Implementar chamada de API para deletar o aluno no backend
    // await deleteStudentAPI(studentInfo.id);

    setStudents(students.filter((s) => s.name !== studentInfo.name));
  };

  const studentElements = filteredItems.map((studentInfo) => (
    <StudentCard
      key={studentInfo.name}
      name={studentInfo.name}
      href={studentInfo.href}
      onDelete={() => handleDeleteStudent(studentInfo)}
    />
  ));

  return (
    <ManagementPageShell
      pageClassName="studentManagementPage"
      layoutClassName="managementPageLayout"
      title="Alunos"
      itemsPerPage={6}
      addButtonLabel="Adicionar Aluno"
      searchPlaceholder="Pesquisar Aluno"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onAddClick={() => navigate("/alunos/novo")}
    >
      {studentElements}
    </ManagementPageShell>
  );
}
