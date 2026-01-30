import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <div style={{ padding: 24 }}>Loading...</div>;

  // підлаштуй під вашу роль: user.role може бути "ADMIN" / "admin"
  const role = (user?.role ?? "").toString().toLowerCase();
  const isAdmin = role === "admin";

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/cabinet" replace />;

  return children;
}