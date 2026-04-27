import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const AdminDashboard = lazy(() => import("../components/dashboard/Dashboard"));
const ClassManagement = lazy(() => import("../components/classManagement"));
const StudentManagement = lazy(() => import("../components/studentManagement"));
const TeacherManagement = lazy(() => import("../components/teacherManagement"));

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
