import { useState, type JSX } from "react";
import { useSearch } from "../../../hooks/useSearch";
import ManagementPageShell from "../../shared/ManagementPageShell";
import TeacherCard from "./teacherCard";
import "./style.css";
import { useNavigate } from "react-router-dom";
import ConfirmationPrompt from "../../shared/confirmationPrompt";

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
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState(initialTeachers);
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(teachers);

  const [confirmationPrompt, setConfirmationPrompt] =
    useState<JSX.Element | null>(null);

  const handlePromptDeleteTeacher = (teacherInfo: TeacherInfo) => {
    const confirmDelete = (
      <ConfirmationPrompt
        promptTitle="Deletar Professor"
        promptMessage={`Tem certeza que deseja deletar o professor ${teacherInfo.name}?`}
        onConfirm={() => handleDeleteTeacher(teacherInfo)}
        onCancel={() => {
          setConfirmationPrompt(null);
        }}
      />
    );
    setConfirmationPrompt(confirmDelete);
  };

  const handleDeleteTeacher = (teacherInfo: TeacherInfo) => {
    // TODO: Implementar chamada de API para deletar o professor no backend
    // await deleteTeacherAPI(teacherInfo.id);

    setTeachers(teachers.filter((t) => t.name !== teacherInfo.name));

    setConfirmationPrompt(null);
  };

  const teacherElements = filteredItems.map((teacherInfo) => (
    <TeacherCard
      key={teacherInfo.name}
      name={teacherInfo.name}
      href={teacherInfo.href}
      onDelete={() => handlePromptDeleteTeacher(teacherInfo)}
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
      onAddClick={() => navigate("/professores/novo")}
    >
      {teacherElements}
      {confirmationPrompt}
    </ManagementPageShell>
  );
}
