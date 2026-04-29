import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const AdminDashboard = lazy(() => import("../components/feats/adminDashboard/Dashboard"));
const ClassManagement = lazy(() => import("../components/feats/classManagement"));
const StudentManagement = lazy(() => import("../components/feats/studentManagement"));
const StudentCreatePage = lazy(() => import("../components/feats/studentNew"));
const TeacherManagement = lazy(() => import("../components/feats/teacherManagement"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/turmas",
    element: <ClassManagement />,
  },
  {
    path: "/alunos",
    element: <StudentManagement />,
  },
  {
    path: "/alunos/novo",
    element: <StudentCreatePage />,
  },
  {
    path: "/professores",
    element: <TeacherManagement />,
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
