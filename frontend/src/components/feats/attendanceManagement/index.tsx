import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import Header from "../../shared/Header";
import ActionBar from "../../shared/ActionBar";
import GenericMainList from "../genericMainList";
import api from "../../../services/api";
import { useSearch } from "../../../hooks/useSearch";
import { useToast } from "../../../context/ToastContext";
import "./style.css";

type TipoPeriodo = "BIMESTRE" | "TRIMESTRE";

type ChamadaResponse = {
  id: number;
  nome: string;
  nomeTurma: string;
  tipoPeriodo: TipoPeriodo;
  numeroPeriodo: number;
  status: "ATIVA" | "ENCERRADA";
  totalRegistros: number;
  presentes: number;
  faltas: number;
  justificadas: number;
};

export default function AttendanceManagement() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [chamadas, setChamadas] = useState<ChamadaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ChamadaResponse | null>(null);

  useEffect(() => {
    document.body.classList.add("attendancePage");
    return () => document.body.classList.remove("attendancePage");
  }, []);

  useEffect(() => {
    async function loadChamadas() {
      try {
        const { data } = await api.get<ChamadaResponse[]>("/chamadas");
        setChamadas(data);
      } catch {
        showToast({
          type: "error",
          title: "Nao foi possivel concluir",
          message: "Erro ao carregar chamadas.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadChamadas();
  }, [showToast]);

  const searchableChamadas = useMemo(
    () =>
      chamadas.map((chamada) => ({
        ...chamada,
        name: chamada.nome,
      })),
    [chamadas],
  );
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(searchableChamadas);

  async function handleDeleteChamada() {
    if (!deleteTarget) return;

    try {
      await api.delete(`/chamadas/${deleteTarget.id}`);
      setChamadas((current) => current.filter((chamada) => chamada.id !== deleteTarget.id));
      showToast({
        type: "success",
        title: "Chamada excluida",
        message: "Chamada removida com sucesso.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Nao foi possivel concluir",
        message: "Erro ao excluir chamada.",
      });
    } finally {
      setDeleteTarget(null);
    }
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>, chamadaId: number) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    navigate(`/chamadas/${chamadaId}/editar`);
  }

  return (
    <div className="attendanceLayout">
      <DefaultSidebar />
      <div className="attendanceMain">
        <Header />
        <main className="attendanceContent">
          <ActionBar
            addButtonLabel="Nova chamada"
            searchPlaceholder="Pesquisar chamada"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => navigate("/chamadas/novo")}
          />

          <GenericMainList props={{ title: "Chamadas", itemsPerPage: 5 }}>
            {loading
              ? [<p key="attendance-loading" className="classesListEmpty">Carregando...</p>]
              : filteredItems.length === 0
                ? [<p key="attendance-empty" className="classesListEmpty">Nenhuma chamada encontrada.</p>]
                : filteredItems.map((chamada) => {
                    const total = chamada.presentes + chamada.faltas + chamada.justificadas;
                    const presenca = total === 0 ? 0 : Math.round((chamada.presentes / total) * 100);

                    return (
                      <div
                        key={chamada.id}
                        role="button"
                        tabIndex={0}
                        className={`classCard attendanceListCard ${chamada.status === "ENCERRADA" ? "attendanceListCard--disabled" : ""}`}
                        onClick={() => navigate(`/chamadas/${chamada.id}/editar`)}
                        onKeyDown={(event) => handleCardKeyDown(event, chamada.id)}
                      >
                        <div className="cardContent">
                          <div className="attendanceCardTitleRow">
                            <span className={`attendanceCardStatus ${chamada.status === "ENCERRADA" ? "attendanceCardStatus--disabled" : ""}`}>
                              {chamada.status === "ATIVA" ? "Habilitada" : "Desabilitada"}
                            </span>
                            <h4 className="classCardTitle attendanceCardTitle">{chamada.nome}</h4>
                          </div>
                          <p className="classCardDescription attendanceCardMeta">
                            {chamada.nomeTurma} · {chamada.numeroPeriodo}º {chamada.tipoPeriodo.toLowerCase()}
                          </p>
                        </div>
                        <div className="attendanceCardActions">
                          <div className="attendanceCardStats">
                            <span>{chamada.totalRegistros} dias</span>
                            <span>{presenca}% presença</span>
                          </div>
                          {chamada.status === "ENCERRADA" && (
                            <button
                              type="button"
                              className="cardDeleteButton"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setDeleteTarget(chamada);
                              }}
                              title="Excluir chamada"
                              aria-label="Excluir chamada"
                            >
                              <Trash size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
          </GenericMainList>
        </main>
      </div>
      {deleteTarget && (
        <div
          className="deleteConfirmOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmacao de exclusao"
          onClick={() => setDeleteTarget(null)}
        >
          <div className="deleteConfirmModal" onClick={(event) => event.stopPropagation()}>
            <h5 className="deleteConfirmTitle">Confirmar exclusao</h5>
            <p className="deleteConfirmText">Tem certeza que deseja excluir esta chamada?</p>
            <div className="deleteConfirmActions">
              <button
                type="button"
                className="deleteConfirmCancelButton"
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="deleteConfirmConfirmButton"
                onClick={handleDeleteChamada}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
