import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Cabinet from "./pages/Cabinet";
import { ToastProvider } from "./context/ToastContext";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">FinTech UniVerse 1.0</h1>
        <p className="text-slate-600 mb-4">Ласкаво просимо! Оберіть дію:</p>
        <div className="grid gap-3">
          <Link className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-center" to="/login">Увійти</Link>
          <Link className="rounded-xl bg-slate-900 text-white px-4 py-2 text-center" to="/register">Зареєструватись</Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="*" element={<div className="p-6">404</div>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
