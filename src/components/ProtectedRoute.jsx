import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) return null;
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}