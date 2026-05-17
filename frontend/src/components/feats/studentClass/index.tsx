import { GraduationCap } from "lucide-react";
import Sidebar2 from "../../solos/sideBar/SideBar2";
import "./style.css";
import StudentCard from "./studentCard";

const games = [
  {
    id: 1,
    title: "Caça às Palavras da Floresta",
    description: "Encontre termos sobre natureza, cultura e território.",
    status: "Liberado",
  },
  {
    id: 2,
    title: "Memória dos Animais",
    description: "Combine os pares e descubra a fauna da aldeia.",
    status: "Liberado",
  },
  {
    id: 3,
    title: "Quiz das Plantas Medicinais",
    description: "Teste seus conhecimentos sobre saberes tradicionais.",
    status: "Liberado",
  },
];

export default function StudentClass() {
  const students = [
    { id: 1, name: "João Silva" },
    { id: 2, name: "Maria Oliveira" },
    { id: 3, name: "Pedro Santos" },
    { id: 4, name: "Ana Costa" },
    { id: 5, name: "Lucas Pereira" },
  ];

  return (
    <div className="studentClassPage">
      <Sidebar2 />
      <div className="studentClassLayout">
        <header className="header">
          <button type="button" className="headerBtn">
            <span>Educador</span>
            <GraduationCap size={18} aria-hidden="true" />
          </button>
        </header>
        <h1 className="title">Turma 5</h1>
        <main className="mainContent">
          <div className="classContent">
            <h3>Alunos</h3>
            <div className="classContentList">
              {students.map((student) => (
                <StudentCard key={student.id} name={student.name} />
              ))}
            </div>
          </div>
          <aside className="gamesAside">
            <h3>Jogos liberados</h3>
            <div className="gamesAsideContentList">
              {games.slice(0, 2).map((game) => (
                <article key={game.id} className="contentGameCard">
                  <div className="gameCardHeader">
                    <span className="gameCardStatus">{game.status}</span>
                  </div>
                  <h4>{game.title}</h4>
                  <p>{game.description}</p>
                  <button type="button" className="gameCardButton">
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
