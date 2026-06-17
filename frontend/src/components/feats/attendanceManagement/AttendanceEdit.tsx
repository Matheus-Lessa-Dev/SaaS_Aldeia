import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Minus, Save } from "lucide-react";
import { useRouteFeedback } from "../../../hooks/useRouteFeedback";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import FeedbackMessage from "../../shared/FeedbackMessage";
import Header from "../../shared/Header";
import api from "../../../services/api";
import "./style.css";

type TipoPeriodo = "BIMESTRE" | "TRIMESTRE";
type StatusPresenca = "PRESENTE" | "FALTA" | "JUSTIFICADA";

type ChamadaResponse = {
  id: number;
  nome: string;
  turmaId: number;
  nomeTurma: string;
  tipoPeriodo: TipoPeriodo;
  numeroPeriodo: number;
  status: "ATIVA" | "ENCERRADA";
  totalRegistros: number;
  presentes: number;
  faltas: number;
  justificadas: number;
};

type PresencaAluno = {
  alunoId: number;
  nomeAluno: string;
  status: StatusPresenca;
  observacao?: string;
};

type RegistroResponse = {
  id: number | null;
  chamadaId: number;
  data: string;
  presencas: PresencaAluno[];
};

const today = new Date().toISOString().slice(0, 10);

export default function AttendanceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chamadaId = Number(id);
  const [chamada, setChamada] = useState<ChamadaResponse | null>(null);
  const [registro, setRegistro] = useState<RegistroResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { feedback, setFeedback } = useRouteFeedback();

  useEffect(() => {
    document.body.classList.add("attendancePage");
    return () => document.body.classList.remove("attendancePage");
  }, []);

  useEffect(() => {
    async function loadChamada() {
      if (!chamadaId) return;

      try {
        const chamadaRes = await api.get<ChamadaResponse>(`/chamadas/${chamadaId}`);
        setChamada(chamadaRes.data);
      } catch {
        setFeedback({
          type: "error",
          title: "Nao foi possivel concluir",
          message: "Erro ao carregar dados da chamada.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadChamada();
  }, [chamadaId]);

  useEffect(() => {
    async function loadRegistro() {
      if (!chamadaId || selectedDate > today) return;

      setLoadingRegistro(true);
      try {
        const { data } = await api.get<RegistroResponse>(
          `/chamadas/${chamadaId}/registros?data=${selectedDate}`,
        );
        setRegistro(data);
      } catch {
        setFeedback({
          type: "error",
          title: "Nao foi possivel concluir",
          message: "Erro ao carregar chamada do dia selecionado.",
        });
      } finally {
        setLoadingRegistro(false);
      }
    }

    loadRegistro();
  }, [chamadaId, selectedDate]);

  const attendanceRate = useMemo(() => {
    if (!chamada) return 0;
    const total = chamada.presentes + chamada.faltas + chamada.justificadas;
    if (total === 0) return 0;
    return Math.round((chamada.presentes / total) * 100);
  }, [chamada]);
  const isChamadaEncerrada = chamada?.status === "ENCERRADA";

  function updatePresenca(alunoId: number, status: StatusPresenca) {
    if (isChamadaEncerrada) return;

    setRegistro((current) =>
      current
        ? {
            ...current,
            presencas: current.presencas.map((presenca) =>
              presenca.alunoId === alunoId ? { ...presenca, status } : presenca,
            ),
          }
        : current,
    );
  }

  function markAllPresent() {
    if (isChamadaEncerrada) return;

    setRegistro((current) =>
      current
        ? {
            ...current,
            presencas: current.presencas.map((presenca) => ({
              ...presenca,
              status: "PRESENTE",
            })),
          }
        : current,
    );
  }

  async function handleSave() {
    if (!chamadaId || !registro || isChamadaEncerrada) return;

    setSaving(true);
    try {
      const { data } = await api.put<RegistroResponse>(`/chamadas/${chamadaId}/registros`, {
        data: selectedDate,
        presencas: registro.presencas.map(({ alunoId, status, observacao }) => ({
          alunoId,
          status,
          observacao,
        })),
      });
      const { data: chamadaAtualizada } = await api.get<ChamadaResponse>(`/chamadas/${chamadaId}`);
      setRegistro(data);
      setChamada(chamadaAtualizada);
      setFeedback({
        type: "success",
        title: "Chamada salva",
        message: "Frequencia salva com sucesso.",
      });
    } catch {
      setFeedback({
        type: "error",
        title: "Nao foi possivel concluir",
        message: "Erro ao salvar frequência.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function toggleChamadaStatus() {
    if (!chamada) return;

    const nextStatus = chamada.status === "ATIVA" ? "ENCERRADA" : "ATIVA";
    setUpdatingStatus(true);
    try {
      const { data } = await api.put<ChamadaResponse>(`/chamadas/${chamada.id}/status`, {
        status: nextStatus,
      });
      setChamada(data);
      setFeedback({
        type: "success",
        title: "Status atualizado",
        message: nextStatus === "ATIVA" ? "Chamada ativada com sucesso." : "Chamada encerrada com sucesso.",
      });
    } catch {
      setFeedback({
        type: "error",
        title: "Nao foi possivel concluir",
        message: "Erro ao atualizar status da chamada.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <div className="attendanceLayout">
      <DefaultSidebar />
      <div className="attendanceMain">
        <Header />
        <main className="attendanceContent">
          <button type="button" className="attendanceBackButton" onClick={() => navigate("/chamadas")}>
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar
          </button>

          {loading && <p className="attendanceMessage">Carregando chamada...</p>}
          {feedback && (
            <FeedbackMessage
              {...feedback}
              onDismiss={() => setFeedback(null)}
            />
          )}

          {chamada && (
            <>
              <section className="attendancePanel attendanceDetailsPanel">
                <div className="attendanceSectionHeader">
                  <div>
                    <h1>{chamada.nome}</h1>
                    <p>{chamada.nomeTurma}</p>
                  </div>
                  <div className="attendanceStats">
                    <div className="attendanceStatusControl">
                      <span>{chamada.status === "ATIVA" ? "Ativa" : "Encerrada"}</span>
                      <label className="attendanceStatusSwitch" aria-label="Alternar status da chamada">
                        <input
                          type="checkbox"
                          checked={chamada.status === "ATIVA"}
                          onChange={toggleChamadaStatus}
                          disabled={updatingStatus}
                        />
                        <span className="attendanceStatusSwitchTrack">
                          <span className="attendanceStatusSwitchThumb" />
                        </span>
                      </label>
                    </div>
                    <span>{chamada.totalRegistros} dias lançados</span>
                    <span>{attendanceRate}% presença</span>
                  </div>
                </div>

                <div className="attendanceInfoGrid">
                  <div>
                    <span>Tipo de período</span>
                    <strong>{chamada.tipoPeriodo === "BIMESTRE" ? "Bimestre" : "Trimestre"}</strong>
                  </div>
                  <div>
                    <span>Período</span>
                    <strong>{chamada.numeroPeriodo}º</strong>
                  </div>
                  <div>
                    <span>Presentes</span>
                    <strong>{chamada.presentes}</strong>
                  </div>
                  <div>
                    <span>Faltas</span>
                    <strong>{chamada.faltas + chamada.justificadas}</strong>
                  </div>
                </div>
              </section>

              <section className={`attendancePanel attendanceRollCall ${isChamadaEncerrada ? "locked" : ""}`}>
                <div className="attendanceRollCallHeader">
                  <div>
                    <h2>Lançamento por dia</h2>
                    <div className={`attendanceDayStatus ${registro?.id ? "saved" : "pending"}`}>
                      <span>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString("pt-BR")}</span>
                      <strong>{registro?.id ? "Chamada já lançada" : "Sem lançamento salvo"}</strong>
                    </div>
                  </div>
                  <label className="attendanceDatePicker">
                    <span>Dia da chamada</span>
                    <input
                      type="date"
                      value={selectedDate}
                      max={today}
                      onChange={(event) => {
                        setFeedback(null);
                        setSelectedDate(event.target.value);
                      }}
                    />
                  </label>
                </div>

                <div className="attendanceActions">
                  <button
                    type="button"
                    className="attendanceMarkAllButton"
                    onClick={markAllPresent}
                    disabled={isChamadaEncerrada || loadingRegistro || !registro}
                  >
                    <Check size={16} aria-hidden="true" />
                    Todos presentes
                  </button>
                  <button
                    type="button"
                    className="attendancePrimaryButton"
                    onClick={handleSave}
                    disabled={saving || loadingRegistro || !registro || selectedDate > today || isChamadaEncerrada}
                  >
                    <Save size={16} aria-hidden="true" />
                    {saving ? "Salvando..." : "Salvar chamada"}
                  </button>
                </div>

                {loadingRegistro && <p className="attendanceMessage">Carregando frequência do dia...</p>}

                <div className="attendanceStudents">
                  {registro?.presencas.map((presenca) => (
                    <article key={presenca.alunoId} className="attendanceStudentRow">
                      <div>
                        <strong>{presenca.nomeAluno}</strong>
                        <span>{presenca.status === "PRESENTE" ? "Presente" : presenca.status === "FALTA" ? "Falta" : "Justificada"}</span>
                      </div>
                      <div className="attendanceSegmented">
                        <button
                          type="button"
                          className={presenca.status === "PRESENTE" ? "active" : ""}
                          onClick={() => updatePresenca(presenca.alunoId, "PRESENTE")}
                          disabled={isChamadaEncerrada}
                        >
                          <Check size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={presenca.status === "FALTA" ? "active danger" : ""}
                          onClick={() => updatePresenca(presenca.alunoId, "FALTA")}
                          disabled={isChamadaEncerrada}
                        >
                          <Minus size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={presenca.status === "JUSTIFICADA" ? "active warn" : ""}
                          onClick={() => updatePresenca(presenca.alunoId, "JUSTIFICADA")}
                          disabled={isChamadaEncerrada}
                        >
                          J
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
