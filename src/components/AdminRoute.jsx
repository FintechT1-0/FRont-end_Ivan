import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthed, isAdmin, loadingUser } = useAuth();

  if (loadingUser) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/cabinet" replace />;

  return children;
}