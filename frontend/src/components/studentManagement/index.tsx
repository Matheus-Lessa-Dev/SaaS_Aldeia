import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import Sidebar1 from "../sideBar/SideBar1";
import StudentCard from "./studentCard";
import GenericMainList from "../genericMainList";
import "./style.css";

export default function StudentManagement() {
  const classes = [
    { name: "Fernando", href: "/alunos/1" },
    { name: "Ana", href: "/alunos/2" },
    { name: "Claudio", href: "/alunos/3" },
    { name: "Pedro", href: "/alunos/4" },
    { name: "Rebeca", href: "/alunos/5" },
    { name: "Matheus", href: "/alunos/6" },
  ];
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.body.classList.add("studentManagementPage");

    return () => {
      document.body.classList.remove("studentManagementPage");
    };
  }, []);

  const classesElements = classes
    .filter((class_) =>
      class_.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    )
    .map((classInfo) => (
      <StudentCard
        key={classInfo.name}
        name={classInfo.name}
        href={classInfo.href}
      />
    ));
  return (
    <div className="studentManagementLayout">
      <Sidebar1 />
      <div className="studentManagementMain">
        <header className="studentManagementHeader">
          <button type="button" className="dashboardHeaderBtn">
            <span>Educador</span>
            <GraduationCap size={18} aria-hidden="true" />
          </button>
        </header>
        <main className="studentManagementContent">
          <div className="studentManagementFunctions">
            <button className='adicionarTurmaBtn'>
              <span>Adicionar Aluno</span>
              <Plus size={18} aria-hidden="true" />
            </button>
            <div className="searchStudentContainer">
              <Search size={16} className="searchStudentIcon" aria-hidden="true" />
              <input
                className="searchStudentInput"
                placeholder="Pesquisar Aluno"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <GenericMainList props={{ title: "Alunos" }}>
            {classesElements}
          </GenericMainList>
        </main>
      </div>
    </div>
  );
}
