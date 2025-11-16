import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken, isExpired } from "../utils/token";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getToken();
  const expired = isExpired();

  if (!token || expired) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
