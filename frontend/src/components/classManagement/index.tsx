import { Search } from "lucide-react";
import Sidebar1 from "../sideBar/SideBar1";
import "./style.css";
import ClassCard from "./classCard";
import GenericMainList from "../genericMainList";
import { useState } from "react";

export default function ClassManagement() {
  const classes = [
    { name: "Turma 1", students: 20, href: "/classes/turma-1" },
    { name: "Turma 2", students: 15, href: "/classes/turma-2" },
    { name: "Turma 3", students: 30, href: "/classes/turma-3" },
    { name: "Turma 4", students: 25, href: "/classes/turma-4" },
    { name: "Turma 5", students: 35, href: "/classes/turma-5" },
    { name: "Turma 6", students: 40, href: "/classes/turma-6" },
  ];
  const [searchTerm, setSearchTerm] = useState("");

  const classesElements = classes
    .filter((class_) => class_.name.includes(searchTerm))
    .map((classInfo) => (
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
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
          </div>
        </div>
        <GenericMainList props={{ title: "Turmas" }}>
          {classesElements}
        </GenericMainList>
      </main>
    </div>
  );
}
