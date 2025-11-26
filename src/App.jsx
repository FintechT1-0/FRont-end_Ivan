import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import LoginForm from "./components/LoginForm.jsx"
import RegistrationForm from "./components/RegistrationForm.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Cabinet from "./pages/Cabinet.jsx"
import { ToastProvider } from "./context/ToastContext.jsx"

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/cabinet"
          element={
            <ProtectedRoute>
              <Cabinet />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ToastProvider>
  )
}
