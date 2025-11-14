// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken, isExpired } from "../utils/token";

/**
 * Обгортає приватні сторінки і не пускає без валідного токена.
 * Використання:
 *   <Route path="/cabinet" element={<ProtectedRoute><Cabinet/></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getToken();
  const expired = isExpired();

  // Якщо токена немає або він протермінований — відправляємо на /login
  if (!token || expired) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
