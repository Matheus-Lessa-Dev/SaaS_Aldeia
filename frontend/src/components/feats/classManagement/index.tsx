import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import { useRouteFeedback } from "../../../hooks/useRouteFeedback";
import {
  sortManagementItems,
  type ManagementSortOption,
} from "../../../utils/managementSort";
import ManagementPageShell from "../../shared/ManagementPageShell";
import ClassCard from "./classCard";
import api from "../../../services/api";
import "./style.css";
import useAuth from "../../../hooks/useAuth";

interface ClassInfo {
  id: number;
  name: string;
  students: number;
  href: string;
  teachersIds: number[];
}

interface TurmaResponse {
  id: number;
  nome: string;
  periodo: string;
  nomesProfessores: string[];
  nomesJogos: string[];
  totalAlunos: number;
  professoresIds: number[];
}

enum ClassFilter {
  ALL = "all",
  MY_CLASSES = "my_classes",
}

export default function ClassManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { feedback, setFeedback } = useRouteFeedback();
  const [filterValue, setFilterValue] = useState<ClassFilter>(
    ClassFilter.ALL,
  );
  const [sortOption, setSortOption] = useState<ManagementSortOption>("nameAsc");

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(classes);
  const sortedItems = sortManagementItems(filteredItems, sortOption);

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
          teachersIds: t.professoresIds,
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
      setFeedback({
        type: "success",
        title: "Turma removida",
        message: "Turma excluida com sucesso.",
      });
    } catch {
      setFeedback({
        type: "error",
        title: "Nao foi possivel concluir a acao",
        message: "Erro ao deletar turma. Tente novamente.",
      });
    }
  };

  const filteredClasses = sortedItems.filter((classInfo) => {
    if (filterValue === ClassFilter.MY_CLASSES) {
      if (user?.id) {
        return classInfo.teachersIds.includes(Number(user.id));
      }
    }
    return true;
  });

  const classesElements = filteredClasses.map((classInfo) => (
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
      : classesElements.length === 0
        ? [
            <p key="classes-empty" className="classesListEmpty">
              Nenhuma turma encontrada.
            </p>,
          ]
        : classesElements;

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
      sortValue={sortOption}
      onSortChange={setSortOption}
      onAddClick={() => navigate("/turmas/novo")}
      feedback={
        feedback
          ? {
              ...feedback,
              onDismiss: () => setFeedback(null),
            }
          : undefined
      }
      filterValue={filterValue}
      onFilterChange={(value) => {
        setFilterValue(value as ClassFilter);
      }}
      filterValueOptions={[
        { value: ClassFilter.ALL, label: "Todas as turmas" },
        { value: ClassFilter.MY_CLASSES, label: "Minhas turmas" },
      ]}
    >
      {listElements}
    </ManagementPageShell>
  );
}
