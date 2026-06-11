import { Suspense, lazy } from "react";
import type { ReactNode } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../context/AuthContext";

const StudentClass = lazy(() => import("../components/feats/studentClass"));
const Profile = lazy(() => import("../components/feats/profile"));
const AlunoJogos = lazy(() => import("../components/feats/studentGames/Jogos"));
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
const GameManagement = lazy(() => import("../components/feats/gameManagement"));
const GameCreatePage = lazy(() => import("../components/feats/gameNew"));

function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Role[];
}) {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.some(hasRole))
    return <div style={{ padding: 40 }}>Acesso não autorizado.</div>;
  return children;
}

// Redireciona para /onboarding se for primeiro acesso
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Role[];
}) {
  const { isAuthenticated, hasRole, user, loading } = useAuth();

  if (loading) {
    return <div className="appLoading">Carregando...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.primeiroAcesso) return <Navigate to="/onboarding" replace />;
  if (allowedRoles && !allowedRoles.some(hasRole))
    return <div style={{ padding: 40 }}>Acesso não autorizado.</div>;
  return children;
}

function RoleBasedRoute(props: { roleRoutes: Map<Role, ReactNode> }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="appLoading">Carregando...</div>;
  }

  const route = props.roleRoutes.get(user!.role);
  return route ? (
    <>{route}</>
  ) : (
    <div style={{ padding: 40 }}>Acesso não autorizado.</div>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },

  // Perfil — acessível para qualquer autenticado
  {
    path: "/onboarding",
    element: (
      <PrivateRoute>
        <Perfil />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <RoleBasedRoute
          roleRoutes={
            new Map<Role, ReactNode>([
              [Role.Admin, <AdminDashboard />],
              [Role.Teacher, <TeacherDashboard />],
              [Role.Student, <StudentDashboard />],
            ])
          }
        />
      </PrivateRoute>
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
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <ClassCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/turmas/:id/editar",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
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
      <ProtectedRoute allowedRoles={[Role.Admin]}>
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
  {
    path: "/professores/:id/editar",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin]}>
        <TeacherCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jogos",
    element: (
      <PrivateRoute>
        <RoleBasedRoute
          roleRoutes={
            new Map<Role, ReactNode>([
              [Role.Admin, <GameManagement />],
              [Role.Teacher, <GameManagement />],
              [Role.Student, <AlunoJogos />],
            ])
          }
        />
      </PrivateRoute>
    ),
  },
  {
    path: "/jogos/novo",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <GameCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jogos/:id/editar",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <GameCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div style={{ padding: 40 }}>Página não encontrada.</div>,
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
