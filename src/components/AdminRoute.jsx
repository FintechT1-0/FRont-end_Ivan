import ProtectedRoute from "./ProtectedRoute";

export default function AdminRoute({ children }) {
  return <ProtectedRoute role="admin">{children}</ProtectedRoute>;
}