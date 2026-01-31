import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import InsightsPage from "./pages/InsightsPage";
import PartnersPage from "./pages/PartnersPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import UserCabinetPage from "./pages/UserCabinetPage";
import AdminCabinetPage from "./pages/AdminCabinetPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/partners" element={<PartnersPage />} />

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
            <ProtectedRoute role="admin">
              <AdminCabinetPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}