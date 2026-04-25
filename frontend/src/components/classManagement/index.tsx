import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import Sidebar1 from "../sideBar/SideBar1";
import ClassCard from "./classCard";
import GenericMainList from "../genericMainList";
import "./style.css";

export default function ClassManagement() {
  const classes = [
    { name: "Turma 1", students: 20, href: "/turmas/turma-1" },
    { name: "Turma 2", students: 15, href: "/turmas/turma-2" },
    { name: "Turma 3", students: 30, href: "/turmas/turma-3" },
    { name: "Turma 4", students: 25, href: "/turmas/turma-4" },
    { name: "Turma 5", students: 35, href: "/turmas/turma-5" },
    { name: "Turma 6", students: 40, href: "/turmas/turma-6" },
  ];
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.body.classList.add("classManagementPage");

    return () => {
      document.body.classList.remove("classManagementPage");
    };
  }, []);

  const classesElements = classes
    .filter((class_) =>
      class_.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    )
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
      <div className="classManagementMain">
        <header className="classManagementHeader">
          <button type="button" className="dashboardHeaderBtn">
            <span>Educador</span>
            <GraduationCap size={18} aria-hidden="true" />
          </button>
        </header>
        <main className="classManagementContent">
          <div className='classManagementFunctions'>
            <button className='adicionarTurmaBtn'>
              <span>Adicionar Turma</span>
              <Plus size={18} aria-hidden="true" />
            </button>
            <div className="searchClassContainer">
            <Search size={16} className="searchClassIcon" aria-hidden="true" />
            <input
              className="searchClassInput"
              placeholder="Pesquisar turma"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          </div>
          <GenericMainList props={{ title: "Turmas" }}>
            {classesElements}
          </GenericMainList>
        </main>
      </div>
    </div>
  );
}
