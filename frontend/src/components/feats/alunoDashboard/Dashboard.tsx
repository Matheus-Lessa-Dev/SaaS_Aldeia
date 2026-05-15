import { User, Trees } from 'lucide-react'
import './AlunoDashboard.css'

function AlunoDashboard() {
    return (
        <div className="dashBoardPainel">
            <div className="alunoDashboardLayout">
                <header className="alunoDashboardHeader">
                    <button className="alunoHeaderBtn">
                        <span>Cauã Silva</span>
                        <User size={18} />
                    </button>
                </header>

                <main className="alunoDashboardContent">
                    <h3>Página inicial</h3>

                    <div className="welcomeSection">
                        <h1>Olá, Cauã!</h1>
                        <p>Bem-vindo de volta à sua jornada de conhecimento.</p>
                    </div>

                    <div className="dashboardCardsArea">
                        <div className="gameCard">
                            <span className="tag">DESTAQUE DA SEMANA</span>

                            <h2>O Mistério das Sementes Sagradas</h2>

                            <p>
                                Ajude a comunidade a identificar as sementes
                                ancestrais para o próximo plantio ritual.
                            </p>

                            <div className="gameCardFooter">
                                <button>▶ Jogar Agora</button>
                                <span>+50 Pontos de Sabedoria</span>
                            </div>
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
    )
}

export default AlunoDashboard