import { GraduationCap, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./style.css";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const displayName = auth.user?.name?.trim().split(" ")[0] || "Conta";

  useEffect(() => {
    function handleSidebarClose() {
      setIsSidebarOpen(false);
      document.body.classList.remove("sidebarMobileOpen");
    }

    window.addEventListener("sidebar:close", handleSidebarClose);

    return () => {
      window.removeEventListener("sidebar:close", handleSidebarClose);
      document.body.classList.remove("sidebarMobileOpen");
    };
  }, []);

  function toggleSidebar() {
    const nextValue = !isSidebarOpen;
    setIsSidebarOpen(nextValue);
    document.body.classList.toggle("sidebarMobileOpen", nextValue);
  }

  return (
    <header className="header">
      <button
        type="button"
        className="headerMenuBtn"
        onClick={toggleSidebar}
        aria-label="Abrir menu de navegacao"
        aria-expanded={isSidebarOpen}
      >
        <Menu size={22} aria-hidden="true" />
      </button>

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
