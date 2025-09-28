import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import toast from "react-hot-toast";

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

export default function DevolucoesPendentes() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const fetchDevolucoes = async () => {
    try {
      const data = await apiFetch<Pedido[]>("/pedidos/devolucoes/pendentes");
      setPedidos(data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar devoluções");
    }
  };

  const handleAcao = async (id: string, status: "APROVADO" | "REJEITADO") => {
    try {
      await apiFetch(`/pedidos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMensagem(
        status === "APROVADO"
          ? "✅ Devolução aprovada com sucesso!"
          : "❌ Devolução rejeitada."
      );
      fetchDevolucoes();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar devolução");
    }
  };

  useEffect(() => {
    fetchDevolucoes();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">♻️ Devoluções Pendentes</h1>

      {mensagem && (
        <p className="mb-4 text-center text-sm font-medium">{mensagem}</p>
      )}

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
          {pedidos.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Nenhuma devolução pendente
              </td>
            </tr>
          )}
          {pedidos.map((p) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
