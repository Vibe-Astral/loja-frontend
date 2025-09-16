// src/components/TechnicianSidebar.tsx
import { Link } from "react-router-dom";

export default function TechnicianSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-4 font-bold text-xl border-b border-gray-700">
        Técnico
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/tecnico/estoque"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          📦 Meu Estoque
        </Link>
        <Link
          to="/tecnico/solicitar"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          🛠 Solicitar Equipamento
        </Link>
        <button
          disabled
          className="block w-full text-left px-4 py-2 rounded opacity-50 cursor-not-allowed"
        >
          📋 Ordens de Serviço (em breve)
        </button>
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/tecnico/portal";
          }}
          className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
