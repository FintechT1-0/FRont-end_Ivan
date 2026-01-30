import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import InsightsPage from "./pages/InsightsPage";
import PartnersPage from "./pages/PartnersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserCabinetPage from "./pages/UserCabinetPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Публічні сторінки з Header + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/partners" element={<PartnersPage />} />
      </Route>

      {/* Окремі сторінки */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Кабінет */}
      <Route
        path="/cabinet"
        element={
          <ProtectedRoute>
            <UserCabinetPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}