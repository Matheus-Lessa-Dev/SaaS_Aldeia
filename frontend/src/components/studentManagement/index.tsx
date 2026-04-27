import { Search } from "lucide-react";
import GenericMainList from "../genericMainList";
import StudentCard from "./studentCard";
import "./style.css";
import { useState } from "react";

export default function StudentManagement() {
  const students = [
    { name: "John Doe", id: "12345" },
    { name: "Jane Smith", id: "67890" },
    { name: "Alice Johnson", id: "54321" },
    { name: "Bob Brown", id: "98765" },
    { name: "Charlie Davis", id: "11223" },
    { name: "Jane Smith", id: "67890" },
    { name: "Alice Johnson", id: "54321" },
    { name: "Bob Brown", id: "98765" },
    { name: "Charlie Davis", id: "11223" },
  ];
  const studentItems = students.map((student) => (
    <StudentCard key={student.id} name={student.name} />
  ));

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="studentsLayout">
      <div className="topBar">
        <a href="#" className="adicionarAlunoBtn">
          Adicionar aluno
        </a>
        <div className="searchStudentContainer">
          <Search size={16} className="searchStudentIcon" aria-hidden="true" />
          <input
            className="searchStudentInput"
            placeholder="Pesquisar aluno"
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
        </div>
      </div>
      <GenericMainList props={{ title: "Alunos" }}>
        {studentItems}
      </GenericMainList>
    </main>
  );
}
