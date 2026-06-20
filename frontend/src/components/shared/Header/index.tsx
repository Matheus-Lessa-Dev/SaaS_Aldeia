import { GraduationCap } from "lucide-react";
import { Role } from "../../../context/AuthContext";
import useAuth from "../../../hooks/useAuth";
import "./style.css";

export default function Header() {
  const auth = useAuth();
  const displayName =
    auth.user?.role === Role.Admin
      ? "Admin"
      : auth.user?.name?.trim().split(" ")[0] || "Conta";

  return (
    <header className="header">
      <button type="button" className="headerBtn">
        <span>{displayName}</span>
        <GraduationCap size={18} aria-hidden="true" />
      </button>
    </header>
  );
}
