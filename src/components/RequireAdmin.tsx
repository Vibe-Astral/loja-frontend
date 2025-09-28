import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function RequireAdmin({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
