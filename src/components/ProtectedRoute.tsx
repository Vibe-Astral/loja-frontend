import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactElement } from "react";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: string[];
  redirectTo?: string; // rota de login customizada
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/tecnico/login", // padrão
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
