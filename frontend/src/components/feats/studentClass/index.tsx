import { useEffect, useMemo, useState } from "react";
import StudentSidebar from "../../solos/sideBar/StudentSidebar";
import "./style.css";
import StudentCard from "./studentCard";
import Header from "../../shared/Header";
import api from "../../../services/api";
import GenericMainList from "../genericMainList";

type AlunoResponse = {
  id: number;
  nome: string;
  turmaId?: number | null;
  nomeTurma?: string | null;
};

type JogoResponse = {
  id: number;
  nome: string;
  tempo?: number | null;
  linkUrl?: string | null;
};

type StatusPresenca = "PRESENTE" | "FALTA" | "JUSTIFICADA";

type FrequenciaAlunoItem = {
  chamadaId: number;
  nomeChamada: string;
  data: string;
  status: StatusPresenca;
  observacao?: string | null;
};

type FrequenciaAlunoResponse = {
  totalRegistros: number;
  presentes: number;
  faltas: number;
  justificadas: number;
  percentualPresenca: number;
  registros: FrequenciaAlunoItem[];
};

const statusLabels: Record<StatusPresenca, string> = {
  PRESENTE: "Presente",
  FALTA: "Falta",
  JUSTIFICADA: "Justificada",
};

export default function StudentClass() {
  const [aluno, setAluno] = useState<AlunoResponse | null>(null);
  const [students, setStudents] = useState<AlunoResponse[]>([]);
  const [games, setGames] = useState<JogoResponse[]>([]);
  const [frequencia, setFrequencia] = useState<FrequenciaAlunoResponse | null>(null);
  const [showFrequency, setShowFrequency] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("studentClassRootPage");

    return () => {
      document.body.classList.remove("studentClassRootPage");
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchClassData() {
      try {
        const [alunoRes, studentsRes, gamesRes, frequenciaRes] = await Promise.all([
          api.get<AlunoResponse>("/alunos/me"),
          api.get<AlunoResponse[]>("/alunos/minha-turma"),
          api.get<JogoResponse[]>("/jogos/minha-turma"),
          api.get<FrequenciaAlunoResponse>("/chamadas/minha-frequencia"),
        ]);

        if (!isMounted) return;

        setAluno(alunoRes.data);
        setStudents(studentsRes.data);
        setGames(gamesRes.data.slice(0, 3));
        setFrequencia(frequenciaRes.data);
        setError("");
      } catch {
        if (isMounted) {
          setError("Erro ao carregar os dados da sua turma.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchClassData();

    return () => {
      isMounted = false;
    };
  }, []);

  const nomeTurma = useMemo(() => {
    if (loading) return "Carregando turma...";
    return aluno?.nomeTurma ?? "Sem turma";
  }, [aluno?.nomeTurma, loading]);

  const handleOpenGame = (linkUrl?: string | null) => {
    if (!linkUrl) return;
    window.open(linkUrl, "_blank", "noopener,noreferrer");
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T00:00:00`));

  const studentListItems = loading
    ? [<p key="students-loading" className="studentClassState">Carregando alunos...</p>]
    : error
      ? [<p key="students-error" className="studentClassState">{error}</p>]
      : students.length === 0
        ? [<p key="students-empty" className="studentClassState">Nenhum aluno vinculado a esta turma.</p>]
        : students.map((student) => (
            <StudentCard key={student.id} name={student.nome} />
          ));

  return (
    <div className="studentClassPage">
      <StudentSidebar />
      <div className="studentClassLayout">
        <Header />
        <div className="studentClassHeader">
          <h1 className="title">{nomeTurma}</h1>
          <button
            type="button"
            className="frequencyToggleButton"
            onClick={() => setShowFrequency((current) => !current)}
          >
            {showFrequency ? "Voltar" : "Minha frequência"}
          </button>
        </div>
        {showFrequency && (
          <section className="frequencyPanel" aria-label="Minha frequência">
            {loading ? (
              <p className="studentClassState">Carregando frequência...</p>
            ) : error ? (
              <p className="studentClassState">{error}</p>
            ) : !frequencia || frequencia.totalRegistros === 0 ? (
              <p className="studentClassState">Ainda não há lançamentos de frequência para você.</p>
            ) : (
              <>
                <div className="frequencySummary">
                  <div className="frequencyPercent">
                    <span>FREQUÊNCIA</span>
                    <strong>{frequencia.percentualPresenca}%</strong>
                    <small>presença geral</small>
                  </div>
                  <div className="frequencyCounters">
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
                <div className="frequencyListSection">
                  <GenericMainList
                    props={{
                      title: "Lançamentos de frequência",
                      itemsPerPage: 5,
                      pageSizeOptions: [5, 10, 15],
                    }}
                  >
                    {frequencia.registros.map((registro) => (
                      <article key={`${registro.chamadaId}-${registro.data}`} className="frequencyRecord">
                        <div className="frequencyRecordContent">
                          <strong>{registro.nomeChamada}</strong>
                          <span>{formatDate(registro.data)}</span>
                        </div>
                        <span className={`frequencyStatus frequencyStatus--${registro.status.toLowerCase()}`}>
                          {statusLabels[registro.status]}
                        </span>
                      </article>
                    ))}
                  </GenericMainList>
                </div>
              </>
            )}
          </section>
        )}
        <main className="mainContent">
          <div className="classContent">
            <GenericMainList
              props={{
                title: "Alunos",
                itemsPerPage: 5,
                pageSizeOptions: [5, 10, 15, 20],
              }}
            >
              {studentListItems}
            </GenericMainList>
          </div>
          <aside className="gamesAside">
            <h3>Jogos liberados</h3>
            <div className="gamesAsideContentList">
              {loading && <p className="studentClassState">Carregando jogos...</p>}
              {!loading && error && <p className="studentClassState">{error}</p>}
              {!loading && !error && games.length === 0 && (
                <p className="studentClassState">Nenhum jogo liberado para sua turma.</p>
              )}
              {!loading &&
                !error &&
                games.map((game) => (
                  <article key={game.id} className="contentGameCard">
                    <div className="gameCardHeader">
                      <span className="gameCardStatus">Liberado</span>
                    </div>
                    <h4>{game.nome}</h4>
                    <p>
                      {game.tempo
                        ? `${game.tempo} minutos estimados`
                        : "Disponivel para jogar."}
                    </p>
                    <button
                      type="button"
                      className="gameCardButton"
                      disabled={!game.linkUrl}
                      onClick={() => handleOpenGame(game.linkUrl)}
                    >
                      Ver jogo
                    </button>
                  </article>
                ))}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
