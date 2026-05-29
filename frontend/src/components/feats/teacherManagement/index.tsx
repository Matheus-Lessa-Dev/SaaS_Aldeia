import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import ManagementPageShell from "../../shared/ManagementPageShell";
import TeacherCard from "./teacherCard";
import api from "../../../services/api";
import "./style.css";

interface TeacherInfo {
  id: number;
  name: string;
  href: string;
}

interface ProfessorResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export default function TeacherManagement() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(teachers);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const { data } = await api.get<ProfessorResponse[]>('/professores');
      setTeachers(data.map((p) => ({
        id: p.id,
        name: p.nome,
        href: `/professores/${p.id}/editar`,
      })));
    } catch {
      setError('Erro ao carregar professores.');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteTeacher = async (teacherInfo: TeacherInfo) => {
    try {
      await api.delete(`/professores/${teacherInfo.id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherInfo.id));
    } catch {
      alert('Erro ao deletar professor. Tente novamente.');
    }
  };

  const teacherElements = filteredItems.map((teacherInfo) => (
    <TeacherCard
      key={teacherInfo.id}
      name={teacherInfo.name}
      href={teacherInfo.href}
      onDelete={() => handleDeleteTeacher(teacherInfo)}
      onEdit={() => navigate(`/professores/${teacherInfo.id}/editar`)}
    />
  ));

  const listElements = error
    ? [<p key="teachers-error" className="classesListEmpty">{error}</p>]
    : loading
      ? []
      : teacherElements;

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
      {listElements}
    </ManagementPageShell>
  );
}
