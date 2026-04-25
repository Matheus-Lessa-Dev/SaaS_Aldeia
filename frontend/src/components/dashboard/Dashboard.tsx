import { useEffect } from 'react'
import { GraduationCap, Users, BookOpen } from 'lucide-react'
import Sidebar from '../sideBar/SideBar1'
import Calendario from '../calendario/Calendario'
import './Dashboard.css'

const dashboardCards = [
    { title: 'Total de Alunos', value: '23', icon: Users },
    { title: 'Total de Professores', value: '8', icon: GraduationCap },
    { title: 'Total de Turmas', value: '5', icon: BookOpen },
]

function AdminDashboard() {
    useEffect(() => {
        document.body.classList.add('adminDashboardPage')

        return () => {
            document.body.classList.remove('adminDashboardPage')
        }
    }, [])

    return (
        <div className='dashBoardPainel'>
            <Sidebar />
            <div className="dashboardLayout">
                <header className="dashboardHeader">
                    <button type="button" className="dashboardHeaderBtn">
                        <span>Educador</span>
                        <GraduationCap size={18} aria-hidden="true" />
                    </button>
                </header>
                <main className="dashboardContent">
                    <h1>Bom dia, educador!</h1>
                    <h4>Acompanhe as informações gerais do sistema</h4>
                    <div className='dashboardContentCards'>
                        {dashboardCards.map((card) => {
                            const Icon = card.icon
                            return (
                                <div key={card.title} className="dashboardCard">
                                    <h3>{card.title}</h3>
                                    <p>{card.value}</p>
                                    <div className="dashboardCardIcon">
                                        <Icon size={32} aria-hidden="true" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="dashboardContentBottom">
                        <div className='bannerPlaceholder'>  

                        </div>
                        <Calendario />
                    </div>
                </main>
            </div>
        </div>
    )
}
    
export default AdminDashboard;