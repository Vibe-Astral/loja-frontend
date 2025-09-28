import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import toast from "react-hot-toast";

type Filial = {
  id: string;
  nome: string;
};

type Estoque = {
  id: string;
  quantidade: number;
  produto: {
    id: string;
    nome: string;
    preco: number;
    fornecedor: string;
  };
};

export default function AdminFiliais() {
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [filialSelecionada, setFilialSelecionada] = useState<string>("");
  const [novaFilial, setNovaFilial] = useState("");
  const [confirmarId, setConfirmarId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiliais() {
      try {
        const res = await apiFetch<Filial[]>("/filiais");
        setFiliais(res);
      } catch {
        toast.error("Erro ao carregar filiais");
      }
    }
    fetchFiliais();
  }, []);

  async function carregarEstoque(filialId: string) {
    try {
      setFilialSelecionada(filialId);
      const res = await apiFetch<Estoque[]>(`/filiais/${filialId}/estoque`);
      setEstoque(res);
    } catch {
      toast.error("Erro ao carregar estoque da filial");
    }
  }

  async function criarFilial(e: React.FormEvent) {
    e.preventDefault();
    if (!novaFilial.trim()) return toast.error("Digite o nome da filial");
    try {
      await apiFetch("/filiais", {
        method: "POST",
        body: JSON.stringify({ nome: novaFilial }),
      });
      toast.success("Filial criada!");
      setNovaFilial("");
      const res = await apiFetch<Filial[]>("/filiais");
      setFiliais(res);
    } catch {
      toast.error("Erro ao criar filial");
    }
  }

  function abrirConfirmacao(id: string) {
    setConfirmarId(id);
  }

  async function confirmarDelete() {
    if (!confirmarId) return;
    try {
      await apiFetch(`/filiais/${confirmarId}`, { method: "DELETE" });
      toast.success("Filial removida!");
      setFiliais((prev) => prev.filter((x) => x.id !== confirmarId));
      if (filialSelecionada === confirmarId) {
        setFilialSelecionada("");
        setEstoque([]);
      }
    } catch {
      toast.error("Erro ao deletar filial");
    } finally {
      setConfirmarId(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Gestão de Filiais</h1>

      {/* Criar nova filial */}
      <form onSubmit={criarFilial} className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome da nova filial"
          className="border px-3 py-2 rounded flex-1"
          value={novaFilial}
          onChange={(e) => setNovaFilial(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Criar
        </button>
      </form>

      {/* Lista de filiais */}
      <div className="flex flex-wrap gap-4 mb-6">
        {filiais.map((f) => (
          <div key={f.id} className="flex items-center gap-2">
            <button
              onClick={() => carregarEstoque(f.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filialSelecionada === f.id
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {f.nome}
            </button>
            <button
              onClick={() => abrirConfirmacao(f.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Modal de confirmação */}
      {confirmarId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">Tem certeza que deseja excluir esta filial?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarId(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estoque */}
      {filialSelecionada && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Estoque da filial:{" "}
            {filiais.find((f) => f.id === filialSelecionada)?.nome}
          </h2>

          {estoque.length === 0 ? (
            <p className="text-gray-600">Nenhum produto nesta filial.</p>
          ) : (
            <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Fornecedor</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {estoque.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{e.produto.nome}</td>
                    <td className="p-3">{e.produto.fornecedor}</td>
                    <td className="p-3">R$ {e.produto.preco.toFixed(2)}</td>
                    <td className="p-3">{e.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
