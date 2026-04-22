import Sidebar from '../../../components/sideBar/SideBar1'
import './style.css'

function AdminDashboard() {
    return (
        <div className="adminLayout">
            <Sidebar />
            <main className="adminContent">
                <h1>Admin Dashboard</h1>
            </main>
        </div>
    )
}
    
export default AdminDashboard;