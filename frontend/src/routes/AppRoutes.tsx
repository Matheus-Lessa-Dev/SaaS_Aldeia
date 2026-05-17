import { Suspense, lazy } from "react";
import type { ReactNode } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../context/AuthContext";
import StudentClass from "../components/feats/studentClass";

const Login = lazy(() => import("../pages/Login"));
const Perfil = lazy(() => import("../pages/Perfil"));
const AdminDashboard = lazy(
  () => import("../components/feats/adminDashboard/Dashboard"),
);
const TeacherDashboard = lazy(
  () => import("../components/feats/teacherDashboard/Dashboard"),
);
const StudentDashboard = lazy(
  () => import("../components/feats/studentDashboard/Dashboard"),
);
const ClassManagement = lazy(
  () => import("../components/feats/classManagement"),
);
const ClassCreatePage = lazy(() => import("../components/feats/classNew"));
const StudentManagement = lazy(
  () => import("../components/feats/studentManagement"),
);
const StudentCreatePage = lazy(() => import("../components/feats/studentNew"));
const TeacherManagement = lazy(
  () => import("../components/feats/teacherManagement"),
);
const TeacherCreatePage = lazy(() => import("../components/feats/teacherNew"));

function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Role[];
}) {
  const { isAuthenticated, hasRole } = useAuth();
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.some(hasRole))
    return <div style={{ padding: 40 }}>Acesso não autorizado.</div>;
  return children;
}

// Redireciona para /perfil se for primeiro acesso
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Role[];
}) {
  const { isAuthenticated, hasRole, user } = useAuth();
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  // if (user?.primeiroAcesso) return <Navigate to="/perfil" replace />;
  if (allowedRoles && !allowedRoles.some(hasRole))
    return <div style={{ padding: 40 }}>Acesso não autorizado.</div>;
  return children;
}

// Renderiza o dashboard correto baseado no role
function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="appLoading">Carregando...</div>;
  }

  switch (user?.role) {
    case Role.Admin:
      return <AdminDashboard />;
    case Role.Teacher:
      return <TeacherDashboard />;
    case Role.Student:
      return <StudentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },

  // Perfil — acessível para qualquer autenticado
  {
    path: "/perfil",
    element: (
      <PrivateRoute>
        <Perfil />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: "/turmas",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <ClassManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/turma",
    element: (
      <ProtectedRoute allowedRoles={[Role.Student]}>
        <StudentClass />
      </ProtectedRoute>
    ),
  },
  {
    path: "/turmas/novo",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin]}>
        <ClassCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alunos",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <StudentManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alunos/novo",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <StudentCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alunos/:id/editar",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <StudentCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professores",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <TeacherManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professores/novo",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin]}>
        <TeacherCreatePage />
      </ProtectedRoute>
    ),
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
