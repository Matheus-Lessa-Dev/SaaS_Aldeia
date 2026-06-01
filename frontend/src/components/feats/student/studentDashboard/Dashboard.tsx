import { useEffect } from "react";
import { Trees } from "lucide-react";
import Sidebar from "../../../solos/sideBar/SideBar2";
import "./Dashboard.css";
import Header from "../../../shared/Header";

function AlunoDashboard() {
  useEffect(() => {
    document.body.classList.add("studentDashboardPage");

    return () => {
      document.body.classList.remove("studentDashboardPage");
    };
  }, []);

  return (
    <div className="dashBoardPainel">
      <Sidebar />
      <div className="alunoDashboardLayout">
        <Header />

        <main className="alunoDashboardContent">
          <h3>Página inicial</h3>

          <div className="welcomeSection">
            <h1>Olá, Cauã!</h1>
            <p>Bem-vindo de volta à sua jornada de conhecimento.</p>
          </div>

          <div className="dashboardCardsArea">
            <div className="gameCard">
              <h2>O Mistério das Sementes Sagradas</h2>

              <p>
                Ajude a comunidade a identificar as sementes ancestrais para o
                próximo plantio ritual.
              </p>
            </div>

            <div className="turmaCard">
              <div className="turmaIcon">
                <Trees size={22} />
              </div>

              <span>MINHA TURMA</span>
              <h2>Turma 1</h2>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AlunoDashboard;
