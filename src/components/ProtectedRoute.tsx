import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ReactElement } from "react";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: string[];
}
export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    return <Navigate to="/technician/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
