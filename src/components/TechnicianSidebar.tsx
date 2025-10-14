// src/components/TechnicianSidebar.tsx
import { NavLink } from "react-router-dom";

export default function TechnicianSidebar() {
  const baseClasses =
    "block px-4 py-2 rounded hover:bg-blue-100 transition font-medium";
  const activeClasses = "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-blue-700">Portal Técnico</h2>
      <nav className="space-y-2">
        <NavLink
          to="/tecnico/estoque"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          📦 Meu Estoque
        </NavLink>

        <NavLink
          to="/tecnico/solicitar"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          🛠 Solicitar Equipamento
        </NavLink>
        <NavLink
          to="/tecnico/pedidos"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          🧾 Meus Pedidos
        </NavLink>
        <NavLink
          to="/tecnico/ordens"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          🧾 Ordens De Serviço
        </NavLink>
      </nav>
    </aside>
  );
}
