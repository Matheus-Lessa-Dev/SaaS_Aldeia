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
const Login = lazy(() => import("../pages/Login"));
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
const StudentGames = lazy(() => import("../components/feats/studentGames/Jogos"));

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

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Role[];
}) {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div className="appLoading">Carregando...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
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

function GamesRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="appLoading">Carregando...</div>;
  }

  if (user?.role === Role.Student) return <StudentGames />;
  if (user?.role === Role.Admin || user?.role === Role.Teacher) return <GameManagement />;
  return <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },

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
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <TeacherManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professores/novo",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <TeacherCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professores/:id/editar",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher]}>
        <TeacherCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jogos",
    element: (
      <ProtectedRoute allowedRoles={[Role.Admin, Role.Teacher, Role.Student]}>
        <GamesRouter />
      </ProtectedRoute>
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
