import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const [estoqueOpen, setEstoqueOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 p-6 flex flex-col">
        
        <Link to="/admin" className="text-2xl font-bold mb-8 text-blue-400">ERP Luiz Tec</Link>

        <nav className="space-y-4">
          <Link to="/admin/usuarios" className="block hover:text-blue-400">
            👥 Usuários
          </Link>
          <Link to="estoque/produtos" className="block hover:text-blue-400">
            📦 Produtos
          </Link>

          {/* Estoque com submenu */}
          <div>
            <Link to="/admin/estoque">
            <button
              onClick={() => setEstoqueOpen(!estoqueOpen)}
              className="w-full text-left hover:text-blue-400 flex items-center justify-between"
            >
              <span>📦 Estoque</span>
              <span>{estoqueOpen ? "▲" : "▼"}</span>
            </button>
            </Link>
            {estoqueOpen && (
              <div className="ml-4 mt-2 space-y-2 text-sm">
                <Link to="estoque/posicoes" className="block hover:text-blue-400">
                  • Posições
                </Link>
                <Link to="estoque/pedidos" className="block hover:text-blue-400">
                  • Pedidos
                </Link>
                <Link to="estoque/devolucoes" className="block hover:text-blue-400">
                  • devoluções
                </Link>
                <Link to="estoque/movimentacoes" className="block hover:text-blue-400">
                  • Movimentações
                </Link>
                <Link to="estoqueTecnico" className="block hover:text-blue-400">
                  • Estoque Tecnicos
                </Link>
            
              </div>
            )}
          </div>

          <Link to="/admin/filiais" className="block hover:text-blue-400">
            🏢 Filiais
          </Link>
          <Link to="/admin/relatorios" className="block hover:text-blue-400">
            📊 Relatórios
          </Link>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8">
        <Outlet /> {/* Aqui renderiza a rota filha */}
      </main>
    </div>
  );
}
