import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const [estoqueOpen, setEstoqueOpen] = useState(false);
  const [operacoesOpen, setOperacoesOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 p-6 flex flex-col shadow-lg">
        {/* LOGO */}
        <Link
          to="/admin"
          className="text-2xl font-bold mb-8 text-blue-400 hover:text-blue-300 transition"
        >
          ERP Luiz Tec
        </Link>

        {/* NAVIGATION */}
        <nav className="space-y-4 flex-1">
          {/* Usuários */}
          <Link
            to="/admin/usuarios"
            className={`block hover:text-blue-400 ${
              location.pathname.includes("/usuarios") ? "text-blue-400" : ""
            }`}
          >
            👥 Usuários
          </Link>

          {/* Filiais */}
          <Link
            to="/admin/filiais"
            className={`block hover:text-blue-400 ${
              location.pathname.includes("/filiais") ? "text-blue-400" : ""
            }`}
          >
            🏢 Filiais
          </Link>

          {/* ESTOQUE */}
          <div>
            <button
              onClick={() => setEstoqueOpen(!estoqueOpen)}
              className="w-full text-left hover:text-blue-400 flex items-center justify-between"
            >
              <span>📦 Estoque</span>
              <span>{estoqueOpen ? "▲" : "▼"}</span>
            </button>

            {estoqueOpen && (
              <div className="ml-4 mt-2 space-y-2 text-sm">
                <Link to="/admin/estoque/produtos" className="block hover:text-blue-400">
                  • Produtos
                </Link>
                <Link to="/admin/estoque/posicoes" className="block hover:text-blue-400">
                  • Posições
                </Link>
                <Link to="/admin/estoque/pedidos" className="block hover:text-blue-400">
                  • Pedidos
                </Link>
                <Link to="/admin/estoque/devolucoes" className="block hover:text-blue-400">
                  • Devoluções
                </Link>
                <Link to="/admin/estoque/movimentacoes" className="block hover:text-blue-400">
                  • Movimentações
                </Link>
                <Link to="/admin/estoqueTecnico" className="block hover:text-blue-400">
                  • Estoque Técnicos
                </Link>
              </div>
            )}
          </div>

          {/* OPERAÇÕES */}
          <div className="border-t border-gray-700 mt-4 pt-4">
            <button
              onClick={() => setOperacoesOpen(!operacoesOpen)}
              className="w-full text-left hover:text-blue-400 flex items-center justify-between"
            >
              <span>⚙️ Operações</span>
              <span>{operacoesOpen ? "▲" : "▼"}</span>
            </button>

            {operacoesOpen && (
              <div className="ml-4 mt-2 space-y-2 text-sm">
                <Link to="/admin/ordens" className="block hover:text-blue-400">
                  • Ordens de Serviço
                </Link>
                <Link to="/admin/vendas" className="block hover:text-blue-400">
                  • Vendas
                </Link>
              </div>
            )}
          </div>

          {/* RELATÓRIOS */}
          <div className="border-t border-gray-700 mt-4 pt-4">
            <Link
              to="/admin/relatorios"
              className={`block hover:text-blue-400 ${
                location.pathname.includes("/relatorios") ? "text-blue-400" : ""
              }`}
            >
              📊 Relatórios
            </Link>
          </div>
        </nav>

        {/* Rodapé opcional */}
        <div className="text-xs text-gray-500 mt-auto pt-4 border-t border-gray-800">
          Versão 1.0.0<br />
          © {new Date().getFullYear()} Luiz Tec
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
