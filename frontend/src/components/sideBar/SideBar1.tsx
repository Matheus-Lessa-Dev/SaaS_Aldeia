import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  Gamepad2,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";
import "./sideBar.css";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Turmas", to: "/classes", icon: BookOpenCheck },
  { label: "Professores", to: "/teachers", icon: GraduationCap },
  { label: "Alunos", to: "/students", icon: Users },
  { label: "Jogos", to: "/games", icon: Gamepad2 },
];

type NavItem = {
  label: string;
  to?: string;
  icon: LucideIcon;
};

const typedNavItems: NavItem[] = navItems;

// renomear essa porra
function Sidebar1() {
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
              <Icon
                className="sideBarNavlinkIcon"
                size={20}
                aria-hidden="true"
              />
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
    </aside>
  );
}

export default Sidebar1;
