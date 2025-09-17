import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type Produto = {
  id: string;
  nome: string;
  preco: number;
  fornecedor: string;
};

type EstoqueItem = {
  id: string;
  quantidade: number;
  produto: Produto;
};

type Filial = {
  id: string;
  nome: string;
};

export default function EstoqueTecnico() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Carregar estoque e filiais
  useEffect(() => {
    async function fetchData() {
      try {
        const [estoqueData, filiaisData] = await Promise.all([
          apiFetch<EstoqueItem[]>("/estoque/tecnico/me"),
          apiFetch<Filial[]>("/filiais"),
        ]);
        setEstoque(estoqueData);
        setFiliais(filiaisData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  const handleDevolucao = async (produtoId: string) => {
    if (!selectedFilial) {
      alert("Selecione a filial de destino!"); // 🔜 trocar por toast
      return;
    }

    try {
      await apiFetch("/pedidos/devolucao", {
        method: "POST",
        body: JSON.stringify({
          produtoId,
          quantidade: 1,
          filialDestinoId: selectedFilial,
        }),
      });
      alert("Devolução solicitada com sucesso!"); // 🔜 trocar por toast
      const data = await apiFetch<EstoqueItem[]>("/estoque/tecnico/me");
      setEstoque(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar devolução");
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Meu Estoque</h1>

      {/* Selecionar filial de destino */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filial de destino:</label>
        <select
          value={selectedFilial}
          onChange={(e) => setSelectedFilial(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Escolha uma filial --</option>
          {filiais.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>
      </div>

      {estoque.length === 0 ? (
        <p>Você ainda não possui itens no estoque.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">Produto</th>
              <th className="border px-3 py-2">Quantidade</th>
              <th className="border px-3 py-2">Fornecedor</th>
              <th className="border px-3 py-2">Preço Unitário</th>
              <th className="border px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border px-3 py-2">{item.produto.nome}</td>
                <td className="border px-3 py-2">{item.quantidade}</td>
                <td className="border px-3 py-2">{item.produto.fornecedor}</td>
                <td className="border px-3 py-2">
                  R$ {item.produto.preco.toFixed(2)}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => handleDevolucao(item.produto.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Devolver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
