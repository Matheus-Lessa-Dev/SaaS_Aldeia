import { Suspense, lazy } from "react";
import type { ReactNode } from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../context/AuthContext";

const Login = lazy(() => import("../pages/Login"));
const AdminDashboard = lazy(() => import("../components/feats/adminDashboard/Dashboard"));
const TeacherDashboard = lazy(() => import("../components/feats/teacherDashboard/Dashboard"));
const StudentDashboard = lazy(() => import("../components/feats/studentDashboard/Dashboard"));

const ClassManagement = lazy(() => import("../components/feats/classManagement"));
const ClassCreatePage = lazy(() => import("../components/feats/classNew"));

const StudentManagement = lazy(() => import("../components/feats/studentManagement"));
const StudentCreatePage = lazy(() => import("../components/feats/studentNew"));

const TeacherManagement = lazy(() => import("../components/feats/teacherManagement"));
const TeacherCreatePage = lazy(() => import("../components/feats/teacherNew"));

// Protege rotas: redireciona para login se não autenticado
// Se allowedRoles for informado, redireciona para /unauthorized se não tiver o role
function PrivateRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles?: Role[] }) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.some(hasRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // Rotas do Admin
  {
    path: "/dashboard",
    element: <PrivateRoute allowedRoles={[Role.Admin]}><AdminDashboard /></PrivateRoute>,
  },
  {
    path: "/turmas",
    element: <PrivateRoute allowedRoles={[Role.Admin, Role.Teacher]}><ClassManagement /></PrivateRoute>,
  },
  {
    path: "/turmas/novo",
    element: <PrivateRoute allowedRoles={[Role.Admin, Role.Teacher]}><ClassCreatePage /></PrivateRoute>,
  },
  {
    path: "/alunos",
    element: <PrivateRoute allowedRoles={[Role.Admin, Role.Teacher]}><StudentManagement /></PrivateRoute>,
  },
  {
    path: "/alunos/novo",
    element: <PrivateRoute allowedRoles={[Role.Admin, Role.Teacher]}><StudentCreatePage /></PrivateRoute>,
  },
  {
    path: "/professores",
    element: <PrivateRoute allowedRoles={[Role.Admin, Role.Teacher]}><TeacherManagement /></PrivateRoute>,
  },
  {
    path: "/professores/novo",
    element: <PrivateRoute allowedRoles={[Role.Admin]}><TeacherCreatePage /></PrivateRoute>,
  },

  // Rotas do Professor
  {
    path: "/dashboard/professor",
    element: <PrivateRoute allowedRoles={[Role.Teacher]}><TeacherDashboard /></PrivateRoute>,
  },

  // Rotas do Aluno
  {
    path: "/dashboard/aluno",
    element: <PrivateRoute allowedRoles={[Role.Student]}><StudentDashboard /></PrivateRoute>,
  },

  // Página de acesso negado
  {
    path: "/unauthorized",
    element: <div style={{ padding: 40 }}>Acesso não autorizado.</div>,
  },
]);

function AppRoutes() {
  return (
    <Suspense fallback={<div className="appLoading">Carregando...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default AppRoutes;