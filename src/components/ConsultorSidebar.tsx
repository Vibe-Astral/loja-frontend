// src/components/ConsultorSidebar.tsx
import { NavLink } from "react-router-dom";

export default function ConsultorSidebar() {
  const baseClasses =
    "block px-4 py-2 rounded hover:bg-green-100 transition font-medium";
  const activeClasses = "bg-green-600 text-white hover:bg-green-700";

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-green-700">Portal Consultor</h2>
      <nav className="space-y-2">
        <NavLink
          to="/consultor/vendas"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          💰 Vendas
        </NavLink>

        <NavLink
          to="/consultor/clientes"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          👥 Clientes
        </NavLink>

        <NavLink
          to="/consultor/relatorios"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          📊 Relatórios
        </NavLink>
        <NavLink
          to="/consultor/ordens"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          📊 Ordens
        </NavLink>
      </nav>
    </aside>
  );
}
