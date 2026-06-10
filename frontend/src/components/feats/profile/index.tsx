import useAuth from "../../../hooks/useAuth";
import Header from "../../shared/Header";
import Sidebar2 from "../../solos/sideBar/SideBar2";
import "./style.css";

export default function Profile() {
  const auth = useAuth();

  return (
    <div className="profilePainel">
      <title>Perfil</title>
      <Sidebar2 />
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
