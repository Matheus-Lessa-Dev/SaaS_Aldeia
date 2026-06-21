import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./style.css";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const displayName = auth.user?.name?.trim().split(" ")[0] || "Conta";

  return (
    <header className="header">
      <button
        type="button"
        className="headerBtn"
        onClick={() => navigate("/minha-conta")}
        aria-label="Abrir minha conta"
      >
        <span>{displayName}</span>
        <GraduationCap size={18} aria-hidden="true" />
      </button>
    </header>
  );
}
