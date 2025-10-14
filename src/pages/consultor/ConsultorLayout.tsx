// src/Technician/TechnicianLayout.tsx
import { Outlet } from "react-router-dom";
import ConsultorSidebar from "@/components/ConsultorSidebar";

export default function ConsultorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <ConsultorSidebar />

      {/* Conteúdo das rotas filhas */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
