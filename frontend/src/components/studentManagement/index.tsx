import GenericHeader from "../genericHeader";
import GenericMainList from "../genericMainList";
import StudentCard from "./studentCard";
import "./style.css";

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

  return (
    <main className="studentsLayout">
      <GenericMainList props={{ title: "Alunos" }}>
        {studentItems}
      </GenericMainList>
    </main>
  );
}
