import { useEffect, useState } from "react";
import { Trees } from "lucide-react";
import Sidebar from "../../solos/sideBar/StudentSidebar";
import api from "../../../services/api";
import "./Dashboard.css";
import Header from "../../shared/Header";

type AlunoResponse = {
  nome: string;
  nomeTurma?: string | null;
};

const dashboardMessages = [
  {
    title: "Aprenda no seu ritmo",
    description: "Explore os jogos liberados para sua turma e avance uma etapa por vez.",
  },
  {
    title: "Sua turma guia sua jornada",
    description: "Acompanhe os conteúdos da escola e fortaleça seu aprendizado todos os dias.",
  },
  {
    title: "Conhecimento em movimento",
    description: "Volte sempre para descobrir novos desafios e reforçar o que aprendeu.",
  },
];

function AlunoDashboard() {
  const [aluno, setAluno] = useState<AlunoResponse | null>(null);
  const [loadingAluno, setLoadingAluno] = useState(true);
  const [alunoError, setAlunoError] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    document.body.classList.add("studentDashboardPage");

    return () => {
      document.body.classList.remove("studentDashboardPage");
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchAluno() {
      try {
        const { data } = await api.get<AlunoResponse>("/alunos/me");

        if (!isMounted) return;

        setAluno(data);
        setAlunoError("");
      } catch {
        if (isMounted) {
          setAlunoError("Erro ao carregar seus dados.");
        }
      } finally {
        if (isMounted) {
          setLoadingAluno(false);
        }
      }
    }

    fetchAluno();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % dashboardMessages.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const nomeAluno = loadingAluno ? "..." : aluno?.nome ?? "Aluno";
  const nomeTurma = loadingAluno ? "..." : aluno?.nomeTurma ?? "Sem turma";
  const currentMessage = dashboardMessages[messageIndex];

  return (
    <div className="dashBoardPainel">
      <Sidebar />
      <div className="alunoDashboardLayout">
        <Header />

        <main className="alunoDashboardContent">
          <div className="welcomeSection">
            <h1>Olá, {nomeAluno}!</h1>
            <p>
              {alunoError || "Bem-vindo de volta à sua jornada de conhecimento."}
            </p>
          </div>

          <div className="dashboardCardsArea">
            <div className="studentDashboardGameCard">
              <span className="studentHighlightLabel">JORNADA</span>
              <h2>{currentMessage.title}</h2>

              <p>{currentMessage.description}</p>

              <div className="studentDashboardCarouselDots" aria-hidden="true">
                {dashboardMessages.map((message, index) => (
                  <span
                    key={message.title}
                    className={index === messageIndex ? "active" : ""}
                  />
                ))}
              </div>
            </div>

            <div className="turmaCard">
              <div className="turmaIcon">
                <Trees size={22} />
              </div>

              <span>MINHA TURMA</span>
              <h2>{nomeTurma}</h2>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AlunoDashboard;
