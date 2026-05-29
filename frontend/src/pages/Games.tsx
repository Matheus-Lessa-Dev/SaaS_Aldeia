import AlunoJogos from "../components/feats/studentGames/Jogos";
import { Role } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";

export default function GamePage() {
  const auth = useAuth();
  switch (auth.user?.role) {
    case Role.Admin:
      return <div>Admin Games Page</div>;
    case Role.Teacher:
      return <div>Teacher Games Page</div>;
    case Role.Student:
      return <AlunoJogos />;
  }
}
