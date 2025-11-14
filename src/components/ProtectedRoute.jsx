import React from "react";
import { Navigate } from "react-router-dom";
import useSession from "../hooks/useSession";
import { isExpired } from "../utils/token";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useSession();

  if (checking) return <div className="p-6 text-slate-500">Перевіряємо сесію…</div>;

  if (isExpired() || !user) return <Navigate to="/login" replace />;

  return children;
}
