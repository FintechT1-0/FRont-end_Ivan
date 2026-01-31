import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import InsightsPage from "./pages/InsightsPage";
import PartnersPage from "./pages/PartnersPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserCabinetPage from "./pages/UserCabinetPage";

import AdminCabinetPage from "./pages/AdminCabinetPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminCourseEditorPage from "./pages/AdminCourseEditorPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/partners" element={<PartnersPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/cabinet"
        element={
          <ProtectedRoute>
            <UserCabinetPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminCabinetPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <AdminRoute>
            <AdminCoursesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/courses/:id"
        element={
          <AdminRoute>
            <AdminCourseEditorPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}