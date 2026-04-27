import StudentManagement from "../../components/studentManagement";
import Sidebar1 from "../../components/sideBar/SideBar1";
import GenericHeader from "../../components/genericHeader";

export default function StudentsPage() {
  return (
    <div style={{ width: "100%", flex: 1, display: "flex" }}>
      <Sidebar1 />
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <GenericHeader title="Alunos" />
        <StudentManagement />
      </div>
    </div>
  );
}
