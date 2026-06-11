import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../solos/sideBar/DefaultSidebar";
import Calendario from "../../solos/calendario/Calendario";
import api from "../../../services/api";
import "./Dashboard.css";
import ClassCard from "./classCard";
import Header from "../../shared/Header";

interface TurmaResponse {
  id: number;
  nome: string;
  periodo: string | null;
  professoresIds: number[];
  nomesProfessores: string[];
  nomesJogos: string[];
  totalAlunos: number;
}

interface TeacherClass {
  id: number;
  name: string;
  description: string;
  alunos: number;
}

function TeacherDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState("");

  useEffect(() => {
    document.body.classList.add("teacherDashboardPage");

    return () => {
      document.body.classList.remove("teacherDashboardPage");
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchTeacherClasses() {
      try {
        const { data } = await api.get<TurmaResponse[]>("/turmas/minhas");

        if (!isMounted) return;

        setClasses(
          data.map((turma) => ({
            id: turma.id,
            name: turma.nome,
            description: turma.periodo
              ? `Período: ${turma.periodo}`
              : "Turma cadastrada no sistema.",
            alunos: turma.totalAlunos,
          })),
        );
        setClassesError("");
      } catch {
        if (isMounted) {
          setClassesError("Erro ao carregar suas turmas.");
        }
      } finally {
        if (isMounted) {
          setLoadingClasses(false);
        }
      }
    }

    fetchTeacherClasses();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalClasses = classes.length;
  const displayedClasses = classes.slice(0, 3);
  const classesContent = loadingClasses ? (
    <p className="teacherDashboardState">Carregando turmas...</p>
  ) : classesError ? (
    <p className="teacherDashboardState">{classesError}</p>
  ) : classes.length === 0 ? (
    <p className="teacherDashboardState">Nenhuma turma vinculada.</p>
  ) : (
    displayedClasses.map((classe) => (
      <ClassCard
        key={classe.id}
        {...classe}
        href={`/turmas/${classe.id}/editar`}
      />
    ))
  );

  return (
    <div className="dashBoardPainel">
      <Sidebar />
      <div className="dashboardLayout">
        <Header />
        <main className="dashboardContent">
          <div className="bannerPlaceholder">
            <div className="bannerContent">
              <h2 className="bannerTitle">
                Bem-vindo ao Portal Aldeia, Professor.
              </h2>
              <p className="bannerDescription">
                Sua jornada de educação ancestral continua hoje. Veja como estão
                as turmas cadastradas e o engajamento dos alunos.
              </p>
              <button
                type="button"
                className="bannerButton"
                onClick={() => navigate("/turmas/novo")}
              >
                Criar nova turma
              </button>
            </div>
          </div>
          <div className="dashboardContentMiddle">
            <div className="dashboardClassesCountCard">
              <span>Turmas vinculadas a você</span>
              <div className="classesCountCardContent">
                <h2>
                  {loadingClasses ? "..." : totalClasses}{" "}
                  {totalClasses === 1 ? "Turma" : "Turmas"}
                </h2>
                <div className="classesCountCardIcon">
                  <User size={100} opacity={0.5} />
                </div>
              </div>
            </div>
            <Calendario />
          </div>
          <div className="dashboardClasses">
            <h1>Turmas</h1>
            <div className="classesGrid">
              {classesContent}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;
