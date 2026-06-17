import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import Header from "../../shared/Header";
import ActionBar from "../../shared/ActionBar";
import GenericMainList from "../genericMainList";
import api from "../../../services/api";
import { useSearch } from "../../../hooks/useSearch";
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
  const [chamadas, setChamadas] = useState<ChamadaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
        setMessage("Erro ao carregar chamadas.");
      } finally {
        setLoading(false);
      }
    }

    loadChamadas();
  }, []);

  const searchableChamadas = useMemo(
    () =>
      chamadas.map((chamada) => ({
        ...chamada,
        name: chamada.nome,
      })),
    [chamadas],
  );
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(searchableChamadas);

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

          {message && <p className="attendanceMessage">{message}</p>}

          <GenericMainList props={{ title: "Chamadas", itemsPerPage: 5 }}>
            {loading
              ? [<p key="attendance-loading" className="classesListEmpty">Carregando...</p>]
              : filteredItems.length === 0
                ? [<p key="attendance-empty" className="classesListEmpty">Nenhuma chamada encontrada.</p>]
                : filteredItems.map((chamada) => {
                    const total = chamada.presentes + chamada.faltas + chamada.justificadas;
                    const presenca = total === 0 ? 0 : Math.round((chamada.presentes / total) * 100);

                    return (
                      <button
                        key={chamada.id}
                        type="button"
                        className="attendanceListCard"
                        onClick={() => navigate(`/chamadas/${chamada.id}/editar`)}
                      >
                        <div className="attendanceCardContent">
                          <span className="attendanceCardTitle">{chamada.nome}</span>
                          <span className="attendanceCardMeta">
                            {chamada.nomeTurma} · {chamada.numeroPeriodo}º {chamada.tipoPeriodo.toLowerCase()}
                          </span>
                        </div>
                        <div className="attendanceCardStats">
                          <span>{chamada.totalRegistros} dias</span>
                          <span>{presenca}% presença</span>
                          <span>{chamada.status.toLowerCase()}</span>
                        </div>
                      </button>
                    );
                  })}
          </GenericMainList>
        </main>
      </div>
    </div>
  );
}
