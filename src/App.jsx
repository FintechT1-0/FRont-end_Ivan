import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import InsightsPage from "./pages/InsightsPage";
import InsightDetailsPage from "./pages/InsightDetailsPage";
import PartnersPage from "./pages/PartnersPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import UserCabinetPage from "./pages/UserCabinetPage";
import AdminCabinetPage from "./pages/AdminCabinetPage";

const PUBLIC_ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/courses", element: <CoursesPage /> },
  { path: "/insights", element: <InsightsPage /> },
  { path: "/insights/view", element: <InsightDetailsPage /> },
  { path: "/partners", element: <PartnersPage /> },
];

const AUTH_ROUTES = [
  {
    path: "/cabinet",
    element: (
      <ProtectedRoute>
        <UserCabinetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminCabinetPage />
      </ProtectedRoute>
    ),
  },
];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {PUBLIC_ROUTES.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {AUTH_ROUTES.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}