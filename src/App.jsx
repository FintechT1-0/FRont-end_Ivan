import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Cabinet from "./pages/Cabinet.jsx";
import HomePage from "./pages/HomePage.jsx"; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/cabinet" element={<Cabinet />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
