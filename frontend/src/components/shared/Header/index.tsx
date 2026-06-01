import { GraduationCap } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import "./style.css";

export default function Header() {
  const auth = useAuth();

  return (
    <header className="header">
      <button type="button" className="headerBtn">
        <span>{auth.user?.role}</span>
        <GraduationCap size={18} aria-hidden="true" />
      </button>
    </header>
  );
}
