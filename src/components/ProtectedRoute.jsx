import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}