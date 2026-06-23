import GenericMainList from "../../feats/genericMainList";
import "./style.css";

type StatusPresenca = "PRESENTE" | "FALTA" | "JUSTIFICADA";

export type FrequenciaAlunoItem = {
  chamadaId: number;
  nomeChamada: string;
  data: string;
  status: StatusPresenca;
  observacao?: string | null;
};

export type FrequenciaAlunoResponse = {
  totalRegistros: number;
  presentes: number;
  faltas: number;
  justificadas: number;
  percentualPresenca: number;
  registros: FrequenciaAlunoItem[];
};

type StudentFrequencyPanelProps = {
  frequencia: FrequenciaAlunoResponse | null;
  loading?: boolean;
  error?: string;
  ariaLabel?: string;
  emptyMessage?: string;
};

const statusLabels: Record<StatusPresenca, string> = {
  PRESENTE: "Presente",
  FALTA: "Falta",
  JUSTIFICADA: "Justificada",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

export default function StudentFrequencyPanel({
  frequencia,
  loading = false,
  error = "",
  ariaLabel = "Frequência do aluno",
  emptyMessage = "Ainda não há lançamentos de frequência para este aluno.",
}: StudentFrequencyPanelProps) {
  return (
    <section className="student-frequency-panel" aria-label={ariaLabel}>
      {loading ? (
        <p className="student-frequency-panel__state">Carregando frequência...</p>
      ) : error ? (
        <p className="student-frequency-panel__state">{error}</p>
      ) : !frequencia || frequencia.totalRegistros === 0 ? (
        <p className="student-frequency-panel__state">{emptyMessage}</p>
      ) : (
        <>
          <div className="student-frequency-panel__summary">
            <div className="student-frequency-panel__percent">
              <span>Frequência</span>
              <strong>{frequencia.percentualPresenca}%</strong>
              <small>presença geral</small>
            </div>
            <div className="student-frequency-panel__counters">
              <div>
                <span>Dias lançados</span>
                <strong>{frequencia.totalRegistros}</strong>
              </div>
              <div>
                <span>Presenças</span>
                <strong>{frequencia.presentes}</strong>
              </div>
              <div>
                <span>Faltas</span>
                <strong>{frequencia.faltas}</strong>
              </div>
              <div>
                <span>Justificadas</span>
                <strong>{frequencia.justificadas}</strong>
              </div>
            </div>
          </div>
          <div className="student-frequency-panel__list">
            <GenericMainList
              props={{
                title: "Lançamentos de frequência",
                itemsPerPage: 5,
                pageSizeOptions: [5, 10, 15],
              }}
            >
              {frequencia.registros.map((registro) => (
                <article
                  key={`${registro.chamadaId}-${registro.data}`}
                  className="student-frequency-panel__record"
                >
                  <div className="student-frequency-panel__record-content">
                    <strong>{registro.nomeChamada}</strong>
                    <span>{formatDate(registro.data)}</span>
                  </div>
                  <span
                    className={`student-frequency-panel__status student-frequency-panel__status--${registro.status.toLowerCase()}`}
                  >
                    {statusLabels[registro.status]}
                  </span>
                </article>
              ))}
            </GenericMainList>
          </div>
        </>
      )}
    </section>
  );
}
