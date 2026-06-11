import useAuth from "../../../hooks/useAuth";
import { Role } from "../../../context/AuthContext";
import Header from "../../shared/Header";
import DefaultSidebar from "../../solos/sideBar/DefaultSidebar";
import StudentSidebar from "../../solos/sideBar/StudentSidebar";
import "./style.css";

export default function Profile() {
  const auth = useAuth();
  const Sidebar = auth.user?.role === Role.Student ? StudentSidebar : DefaultSidebar;

  return (
    <div className="profilePainel">
      <title>Perfil</title>
      <Sidebar />
      <div className="profileLayout">
        <Header />
        <main className="profileContent">
          <h1>Meu Perfil</h1>
          <form className="profileForm" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name">Nome:</label>
              <input type="text" id="name" value={auth.user?.name} />
            </div>
            <button type="submit" className="profileFormButton">
              Salvar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
