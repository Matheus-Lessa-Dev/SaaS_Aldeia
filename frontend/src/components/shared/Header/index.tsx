import { GraduationCap } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import "./style.css";

export default function Header() {
  const auth = useAuth();

  return (
    <header className="header">
      <a href="/perfil" className="headerBtn">
        <span>{auth.user?.name.split(" ")[0]}</span>
        <GraduationCap size={18} aria-hidden="true" />
      </a>
    </header>
  );
}
