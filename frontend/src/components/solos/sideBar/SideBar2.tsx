import { NavLink, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { BookOpenCheck, Gamepad2, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import "./sideBar.css";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Turma", to: "/turma", icon: BookOpenCheck },
  { label: "Jogos", to: "/jogos", icon: Gamepad2 },
];

type NavItem = {
  label: string;
  to?: string;
  icon: LucideIcon;
};

const typedNavItems: NavItem[] = navItems;

function Sidebar2() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sideBar" aria-label="Navegacao principal">
      <div className="sideBarTitle">
        <h1>Portal Aldeia</h1>
        <h6>Educacao</h6>
      </div>

      <nav className="sideBarNavlinks">
        {typedNavItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon className="sideBarNavlinkIcon" size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </>
          );
          if (item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `sideBarNavlink${isActive ? " active" : ""}`
                }
              >
                {content}
              </NavLink>
            );
          }
          return (
            <button key={item.label} className="sideBarNavlink" type="button">
              {content}
            </button>
          );
        })}
      </nav>

      <div className="sideBarFooter">
        <div className="sideBarUser">
          <span className="sideBarUserEmail">{user?.email}</span>
          <span className="sideBarUserRole">{user?.role}</span>
        </div>
        <button className="sideBarLogout" type="button" onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar2;