import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { isAuthed, isAdmin, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role === "admin" && !isAdmin) {
    return <Navigate to="/cabinet" replace />;
  }

  return children;
}