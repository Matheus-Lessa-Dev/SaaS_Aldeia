import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { BookOpenCheck, Gamepad2, LayoutDashboard } from 'lucide-react'
import './sideBar.css'

const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Turmas', icon: BookOpenCheck },
    { label: 'Jogos', icon: Gamepad2 },
]

type NavItem = {
    label: string
    to?: string
    icon: LucideIcon
}

const typedNavItems: NavItem[] = navItems

function Sidebar2() {
    return (
        <aside className="sideBar" aria-label="Navegacao principal">
            <div className="sideBarTitle">
                <h1>Portal Aldeia</h1>
                <h6>Educacao</h6>
            </div>

            <nav className="sideBarNavlinks">
                {typedNavItems.map((item) => {
                    const Icon = item.icon
                    const content = (
                        <>
                            <Icon className="sideBarNavlinkIcon" size={16} aria-hidden="true" />
                            <span>{item.label}</span>
                        </>
                    )

                    if (item.to) {
                        return (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({ isActive }) =>
                                    `sideBarNavlink${isActive ? ' active' : ''}`
                                }
                            >
                                {content}
                            </NavLink>
                        )
                    }

                    return (
                        <button key={item.label} className="sideBarNavlink" type="button">
                            {content}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar2;