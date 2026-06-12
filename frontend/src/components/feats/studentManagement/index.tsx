import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import { sortManagementItems, type ManagementSortOption } from "../../../utils/managementSort";
import ManagementPageShell from "../../shared/ManagementPageShell";
import StudentCard from "./studentCard";
import api from "../../../services/api";
import "./style.css";

interface StudentInfo {
  id: number;
  name: string;
  href: string;
}

interface AlunoResponse {
  id: number;
  nome: string;
  email: string;
  nomeResponsavel: string;
  telefoneResponsavel: string;
  nomeTurma: string;
}

export default function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<ManagementSortOption>("nameAsc");

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(students);
  const sortedItems = sortManagementItems(filteredItems, sortOption);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const { data } = await api.get<AlunoResponse[]>("/alunos");
      setStudents(
        data.map((aluno) => ({
          id: aluno.id,
          name: aluno.nome,
          href: `/alunos/${aluno.id}/editar`,
        })),
      );
    } catch {
      setError("Erro ao carregar alunos.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteStudent = async (studentInfo: StudentInfo) => {
    try {
      await api.delete(`/alunos/${studentInfo.id}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentInfo.id));
    } catch {
      alert("Erro ao deletar aluno. Tente novamente.");
    }
  };

  const studentElements = sortedItems.map((studentInfo) => (
    <StudentCard
      key={studentInfo.id}
      name={studentInfo.name}
      href={studentInfo.href}
      onDelete={() => handleDeleteStudent(studentInfo)}
      onEdit={() => navigate(`/alunos/${studentInfo.id}/editar`)}
    />
  ));

  const listElements = error
    ? [<p key="students-error" className="classesListEmpty">{error}</p>]
    : loading
      ? []
      : studentElements;

  return (
    <ManagementPageShell
      pageClassName="studentManagementPage"
      layoutClassName="managementPageLayout"
      title="Alunos"
      itemsPerPage={5}
      addButtonLabel="Adicionar Aluno"
      searchPlaceholder="Pesquisar Aluno"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      sortValue={sortOption}
      onSortChange={setSortOption}
      onAddClick={() => navigate("/alunos/novo")}
    >
      {listElements}
    </ManagementPageShell>
  );
}
