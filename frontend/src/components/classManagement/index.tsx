import { Search } from "lucide-react";
import Sidebar1 from "../sideBar/SideBar1";
import "./style.css";

export default function ClassManagement() {
  const classes = [
    { name: "Turma 1", students: 20, href: "/classes/turma-1" },
    { name: "Turma 2", students: 15, href: "/classes/turma-2" },
    { name: "Turma 3", students: 30, href: "/classes/turma-3" },
  ];
  const classesElements = classes.map((classInfo) => (
    <ClassCard
      key={classInfo.name}
      name={classInfo.name}
      students={classInfo.students}
      href={classInfo.href}
    />
  ));
  return (
    <div className="classManagementLayout">
      <Sidebar1 />
      <main>
        <div className="topBar">
          <a href="#" className="adicionarTurmaBtn">
            Adicionar turma
          </a>
          <div className="searchClassContainer">
            <Search size={16} className="searchClassIcon" aria-hidden="true" />
            <input
              className="searchClassInput"
              placeholder="Pesquisar turma"
            ></input>
          </div>
        </div>
        <div className="classesListContainer">
          <h3 className="classesListTitle">Turmas</h3>
          <div className="classesList">{classesElements}</div>
        </div>
      </main>
    </div>
  );
}

function ClassCard(props: { name: string; students: number; href: string }) {
  return (
    <a href={props.href} className="classCard">
      <h4 className="classCardTitle">{props.name}</h4>
      <p className="classCardDescription">{props.students} alunos</p>
    </a>
  );
}
