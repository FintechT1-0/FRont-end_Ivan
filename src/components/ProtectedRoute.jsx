import React from "react";
import { Navigate } from "react-router-dom";
import useSession from "../hooks/useSession";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useSession();

  if (checking) return <div className="p-6 text-slate-500">Перевіряємо сесію…</div>;

  const hasToken = !!localStorage.getItem("jwt");
  if (!hasToken || !user) return <Navigate to="/login" replace />;

  return children;
}
