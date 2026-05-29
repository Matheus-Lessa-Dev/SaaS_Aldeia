import { useEffect } from "react";
import { GraduationCap, User } from "lucide-react";
import Sidebar from "../../solos/sideBar/SideBar1";
import Calendario from "../../solos/calendario/Calendario";
import "./Dashboard.css";
import ClassCard from "./classCard";

const classesMockData: {
  id: number;
  name: string;
  description: string;
  alunos: number;
}[] = [
  {
    id: 1,
    name: "Turma A",
    description: "Descrição breve da turma.",
    alunos: 25,
  },
  {
    id: 2,
    name: "Turma B",
    description: "Descrição breve da turma.",
    alunos: 20,
  },
  {
    id: 3,
    name: "Turma C",
    description: "Descrição breve da turma.",
    alunos: 18,
  },
];

function TeacherDashboard() {
  useEffect(() => {
    document.body.classList.add("adminDashboardPage");

    return () => {
      document.body.classList.remove("adminDashboardPage");
    };
  }, []);

  return (
    <div className="dashBoardPainel">
      <Sidebar />
      <div className="dashboardLayout">
        <header className="dashboardHeader">
          <button type="button" className="dashboardHeaderBtn">
            <span>Educador</span>
            <GraduationCap size={18} aria-hidden="true" />
          </button>
        </header>
        <main className="dashboardContent">
          <div className="bannerPlaceholder">
            <div className="bannerContent">
              <h2 className="bannerTitle">
                Bem-vindo ao Portal Aldeia, Professor.
              </h2>
              <p className="bannerDescription">
                Sua jornada de educação ancestral continua hoje. Veja como estão
                suas turmas e o engajamento dos alunos.
              </p>
              <button className="bannerButton">Criar nova turma</button>
            </div>
          </div>
          <div className="dashboardContentMiddle">
            <div className="dashboardClassesCountCard">
              <span>Total de turmas vinculadas</span>
              <div className="classesCountCardContent">
                <h2>5 Turmas</h2>
                <div className="classesCountCardIcon">
                  <User size={100} opacity={0.5} />
                </div>
              </div>
            </div>
            <Calendario />
          </div>
          <div className="dashboardClasses">
            <h1>Suas Turmas</h1>
            <div className="classesGrid">
              {classesMockData.map((classe) => (
                <ClassCard key={classe.id} {...classe} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;
