import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type Produto = {
  id: string;
  nome: string;
};

type Tecnico = {
  id: string;
  email: string;
};

type Pedido = {
  id: string;
  quantidade: number;
  status: string;
  createdAt: string;
  produto: Produto;
  tecnico: Tecnico;
};

export default function PedidosPendentes() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Função única para carregar pedidos
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Pedido[]>("/pedidos/pendentes");
      setPedidos(data);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Aprovar ou rejeitar pedido
  const handleAcao = async (
    pedidoId: string,
    novoStatus: "APROVADO" | "REJEITADO"
  ) => {
    try {
      let result: Pedido;

      if (novoStatus === "APROVADO") {
        result = await apiFetch<Pedido>(`/pedidos/${pedidoId}/aprovar`, {
          method: "PATCH",
        });
      } else {
        result = await apiFetch<Pedido>(`/pedidos/${pedidoId}/rejeitar`, {
          method: "PATCH",
        });
      }

      setMensagem(`✅ Pedido ${result.status} com sucesso!`);
      fetchPedidos();
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao atualizar pedido");
    }
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 Pedidos Pendentes</h1>

      {mensagem && (
        <p className="mb-4 text-center text-sm font-medium">{mensagem}</p>
      )}

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">Produto</th>
              <th className="border px-3 py-2">Quantidade</th>
              <th className="border px-3 py-2">Técnico</th>
              <th className="border px-3 py-2">Data</th>
              <th className="border px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Nenhum pedido pendente
                </td>
              </tr>
            ) : (
              pedidos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-100">
                  <td className="border px-3 py-2">{p.produto?.nome}</td>
                  <td className="border px-3 py-2">{p.quantidade}</td>
                  <td className="border px-3 py-2">{p.tecnico?.email}</td>
                  <td className="border px-3 py-2">
                    {new Date(p.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => handleAcao(p.id, "APROVADO")}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Aprovar
                    </button>

                    <button
                      onClick={() => handleAcao(p.id, "REJEITADO")}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Rejeitar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
