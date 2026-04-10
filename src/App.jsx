import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DesktopOnly from "./components/DesktopOnly";

// public pages
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import InsightsPage from "./pages/InsightsPage";
import InsightDetailsPage from "./pages/InsightDetailsPage";
import PartnersPage from "./pages/PartnersPage";

// auth pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminAuthPage from "./pages/AdminAuthPage";

// user
import UserLayout from "./components/UserLayout";
import UserCabinetPage from "./pages/UserCabinetPage";
import UserCoursesPage from "./pages/UserCoursesPage";

// admin
import AdminLayout from "./components/AdminLayout";
import AdminCabinetPage from "./pages/admin/AdminCabinetPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminCourseEditorPage from "./pages/admin/AdminCourseEditorPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminActivityPage from "./pages/admin/AdminActivityPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

export default function App() {
  return (
    <DesktopOnly>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/details" element={<InsightDetailsPage />} />
          <Route path="/partners" element={<PartnersPage />} />

          <Route
            path="/cabinet"
            element={
              <ProtectedRoute role="user">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserCabinetPage />} />
            <Route path="courses" element={<UserCoursesPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminCabinetPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="courses/create" element={<AdminCourseEditorPage />} />
            <Route path="courses/:id" element={<AdminCourseEditorPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-auth" element={<AdminAuthPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DesktopOnly>
  );
}