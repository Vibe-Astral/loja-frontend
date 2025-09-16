import { Link } from "react-router-dom";

export default function EstoquePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📦 Módulo de Estoque</h1>
      <p className="text-gray-600">Gerencie e acompanhe o estoque da loja</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/estoque/posicoes"
          className="p-6 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
        >
          <h2 className="text-lg font-semibold">Posições de Estoque</h2>
          <p className="text-sm mt-2">Veja a quantidade de cada produto por filial/técnico.</p>
        </Link>

        <Link
          to="/admin/estoque/pedidos"
          className="p-6 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
        >
          <h2 className="text-lg font-semibold">Pedidos Pendentes</h2>
          <p className="text-sm mt-2">Acompanhe solicitações de técnicos aguardando aprovação.</p>
        </Link>

        <Link
          to="/admin/estoque/movimentacoes"
          className="p-6 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition"
        >
          <h2 className="text-lg font-semibold">Movimentações</h2>
          <p className="text-sm mt-2">Histórico de entradas, saídas e transferências.</p>
        </Link>
      </div>
    </div>
  );
}
