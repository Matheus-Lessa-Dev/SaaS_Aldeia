import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import StudentsPage from "../pages/Students";

const Login = lazy(() => import("../pages/Login"));
const AdminDashboard = lazy(() => import("../pages/Admin/Dashboard"));
const ClassManagement = lazy(() => import("../components/classManagement"));

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
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/classes",
    element: <ClassManagement />,
  },
  {
    path: "/students",
    element: <StudentsPage />,
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
