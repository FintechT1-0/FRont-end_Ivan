import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useSession from "../hooks/useSession";
import { isExpired } from "../utils/token";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useSession();
  const location = useLocation();

  if (checking) return <div className="p-6 text-slate-500">Перевіряємо сесію…</div>;

  if (isExpired() || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
