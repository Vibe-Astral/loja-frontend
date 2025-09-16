// src/Technician/TechnicianLayout.tsx
import { Outlet } from "react-router-dom";
import TechnicianSidebar from "@/components/TechnicianSidebar";

export default function TechnicianLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <TechnicianSidebar />

      {/* Conteúdo das rotas filhas */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
