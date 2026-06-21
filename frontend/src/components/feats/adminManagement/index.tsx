import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useRouteFeedback } from "../../../hooks/useRouteFeedback";
import { useSearch } from "../../../hooks/useSearch";
import { sortManagementItems, type ManagementSortOption } from "../../../utils/managementSort";
import ManagementPageShell from "../../shared/ManagementPageShell";
import api from "../../../services/api";
import AdminCard from "./adminCard";
import "./style.css";

const BASE_ADMIN_EMAIL = "admin@base.com";

interface AdminInfo {
  id: number;
  name: string;
  email: string;
  href: string;
}

interface AdminResponse {
  id: number;
  nome: string;
  email: string;
}

export default function AdminManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { feedback, setFeedback } = useRouteFeedback();
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<ManagementSortOption>("nameAsc");

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(admins);
  const sortedItems = sortManagementItems(filteredItems, sortOption);
  const canManageExistingAdmins = user?.email === BASE_ADMIN_EMAIL;

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      const { data } = await api.get<AdminResponse[]>("/admins");
      setAdmins(
        data.map((admin) => ({
          id: admin.id,
          name: admin.nome,
          email: admin.email,
          href: `/admins/${admin.id}/editar`,
        })),
      );
    } catch {
      setError("Erro ao carregar administradores.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAdmin(adminInfo: AdminInfo) {
    if (adminInfo.email === user?.email) {
      setFeedback({
        type: "error",
        title: "Acao bloqueada",
        message: "Voce nao pode excluir a propria conta.",
      });
      return;
    }

    try {
      await api.delete(`/admins/${adminInfo.id}`);
      setAdmins((current) => current.filter((admin) => admin.id !== adminInfo.id));
      setFeedback({
        type: "success",
        title: "Administrador removido",
        message: "Administrador excluido com sucesso.",
      });
    } catch {
      setFeedback({
        type: "error",
        title: "Nao foi possivel concluir a acao",
        message: "Erro ao deletar administrador. Tente novamente.",
      });
    }
  }

  const adminElements = sortedItems.map((adminInfo) => (
    <AdminCard
      key={adminInfo.id}
      name={adminInfo.name}
      email={adminInfo.email}
      href={canManageExistingAdmins ? adminInfo.href : undefined}
      onDelete={canManageExistingAdmins ? () => handleDeleteAdmin(adminInfo) : undefined}
      onEdit={canManageExistingAdmins ? () => navigate(`/admins/${adminInfo.id}/editar`) : undefined}
    />
  ));

  const listElements = error
    ? [<p key="admins-error" className="classesListEmpty">{error}</p>]
    : loading
      ? []
      : adminElements.length === 0
        ? [<p key="admins-empty" className="classesListEmpty">Nenhum administrador encontrado.</p>]
        : adminElements;

  return (
    <ManagementPageShell
      pageClassName="adminManagementPage"
      layoutClassName="managementPageLayout"
      title="Administradores"
      itemsPerPage={5}
      addButtonLabel="Adicionar Admin"
      searchPlaceholder="Pesquisar Admin"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      sortValue={sortOption}
      onSortChange={setSortOption}
      onAddClick={() => navigate("/admins/novo")}
      feedback={feedback ? {
        ...feedback,
        onDismiss: () => setFeedback(null),
      } : undefined}
    >
      {listElements}
    </ManagementPageShell>
  );
}
