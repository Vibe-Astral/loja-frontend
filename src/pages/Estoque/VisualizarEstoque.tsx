import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

type Produto = { id: string; nome: string; preco: number; fornecedor: string };
type EstoqueItem = {
  id: string;
  quantidade: number;
  produto: Produto;
  filial?: { id: string; nome: string } | null;
  tecnico?: { id: string; email: string } | null;
};

export default function VisualizarEstoque() {
  const { user } = useAuth();
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let endpoint = "";
    if (user.role === "ADMIN") {
      endpoint = "/estoque"; // Admin vê tudo
    } else if (user.role === "TECNICO") {
      endpoint = `/estoque/tecnico/${user.sub}`;
    } else {
      endpoint = "/estoque/minha-filial";
    }

    apiFetch<EstoqueItem[]>(endpoint)
      .then(setEstoque)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="text-center p-4">Carregando estoque...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Estoque</h1>

      {estoque.length === 0 ? (
        <p>Nenhum produto no estoque.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 shadow-md text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Produto</th>
              <th className="border px-4 py-2">Fornecedor</th>
              <th className="border px-4 py-2">Preço</th>
              <th className="border px-4 py-2">Quantidade</th>
              {user.role === "ADMIN" && (
                <>
                  <th className="border px-4 py-2">Filial</th>
                  <th className="border px-4 py-2">Técnico</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.produto.nome}</td>
                <td className="border px-4 py-2">{item.produto.fornecedor}</td>
                <td className="border px-4 py-2">
                  R$ {item.produto.preco.toFixed(2)}
                </td>
                <td className="border px-4 py-2 text-center">{item.quantidade}</td>
                {user.role === "ADMIN" && (
                  <>
                    <td className="border px-4 py-2">
                      {item.filial?.nome || "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.tecnico?.email || "—"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
