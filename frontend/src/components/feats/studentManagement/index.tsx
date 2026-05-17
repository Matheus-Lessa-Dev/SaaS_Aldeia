import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
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

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(students);

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

  if (loading) return <div className="appLoading">Carregando alunos...</div>;
  if (error) return <div className="appLoading">{error}</div>;

  const studentElements = filteredItems.map((studentInfo) => (
    <StudentCard
      key={studentInfo.id}
      name={studentInfo.name}
      href={studentInfo.href}
      onDelete={() => handleDeleteStudent(studentInfo)}
      onEdit={() => navigate(`/alunos/${studentInfo.id}/editar`)}
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
