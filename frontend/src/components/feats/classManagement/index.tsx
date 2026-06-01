import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import ManagementPageShell from "../../shared/ManagementPageShell";
import ClassCard from "./classCard";
import api from "../../../services/api";
import "./style.css";

interface ClassInfo {
  id: number;
  name: string;
  students: number;
  href: string;
}

interface TurmaResponse {
  id: number;
  nome: string;
  periodo: string;
  nomesProfessores: string[];
  nomesJogos: string[];
  totalAlunos: number;
}

export default function ClassManagement() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(classes);

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    try {
      const { data } = await api.get<TurmaResponse[]>("/turmas");
      setClasses(
        data.map((t) => ({
          id: t.id,
          name: t.nome,
          students: t.totalAlunos,
          href: `/turmas/${t.id}/editar`,
        })),
      );
    } catch {
      setError("Erro ao carregar turmas.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClass = async (classInfo: ClassInfo) => {
    try {
      await api.delete(`/turmas/${classInfo.id}`);
      setClasses((prev) => prev.filter((c) => c.id !== classInfo.id));
    } catch {
      alert("Erro ao deletar turma. Tente novamente.");
    }
  };

  const classesElements = filteredItems.map((classInfo) => (
    <ClassCard
      key={classInfo.id}
      name={classInfo.name}
      students={classInfo.students}
      href={classInfo.href}
      onDelete={() => handleDeleteClass(classInfo)}
      onEdit={() => navigate(`/turmas/${classInfo.id}/editar`)}
    />
  ));

  const listElements = error
    ? [
        <p key="classes-error" className="classesListEmpty">
          {error}
        </p>,
      ]
    : loading
      ? []
      : classesElements;

  return (
    <ManagementPageShell
      pageClassName="classManagementPage"
      layoutClassName="managementPageLayout"
      title="Turmas"
      itemsPerPage={6}
      addButtonLabel="Adicionar Turma"
      searchPlaceholder="Pesquisar turma"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onAddClick={() => navigate("/turmas/novo")}
    >
      {listElements}
    </ManagementPageShell>
  );
}
