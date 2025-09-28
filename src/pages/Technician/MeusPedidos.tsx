import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type Pedido = {
  id: string;
  quantidade: number;
  status: string;
  createdAt: string;
  produto: { nome: string };
};

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await apiFetch<Pedido[]>("/pedidos/me");
        setPedidos(data);
      } catch (err) {
        console.error("Erro ao carregar pedidos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Meus Pedidos</h1>
      {pedidos.length === 0 ? (
        <p>Você ainda não fez pedidos.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">Data</th>
              <th className="border px-3 py-2">Produto</th>
              <th className="border px-3 py-2">Quantidade</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-100">
                <td className="border px-3 py-2">
                  {new Date(p.createdAt).toLocaleString("pt-BR")}
                </td>
                <td className="border px-3 py-2">{p.produto?.nome ?? "-"}</td>
                <td className="border px-3 py-2">{p.quantidade}</td>
                <td className="border px-3 py-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
