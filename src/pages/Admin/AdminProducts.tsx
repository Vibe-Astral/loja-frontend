import React, { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

type Produto = {
  id: string;
  nome: string;
  preco: number;
  fornecedor: string;
  descricao?: string;
  categoria?: string;
};

type Filial = {
  id: string;
  nome: string;
};

export default function AdminProducts() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [confirmarId, setConfirmarId] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: "",
    preco: "",
    fornecedor: "",
    descricao: "",
    categoria: "",
  });
  const [estoqueInicial, setEstoqueInicial] = useState<
    { filialId: string; quantidade: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const fetchProdutos = async () => {
    try {
      const data = (await apiFetch("/produtos")) as Produto[];
      setProdutos(data);
    } catch {
      toast.error("Falha ao carregar produtos");
    }
  };

  const fetchFiliais = async () => {
    try {
      const data = (await apiFetch("/filiais")) as Filial[];
      setFiliais(data);
      setEstoqueInicial(data.map((f) => ({ filialId: f.id, quantidade: 0 })));
    } catch {
      toast.error("Falha ao carregar filiais");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiFetch("/produtos", {
        method: "POST",
        body: JSON.stringify({
          nome: form.nome,
          preco: parseFloat(form.preco),
          fornecedor: form.fornecedor,
          descricao: form.descricao,
          categoria: form.categoria,
          estoqueInicial,
        }),
      });
      setForm({
        nome: "",
        preco: "",
        fornecedor: "",
        descricao: "",
        categoria: "",
      });
      setEstoqueInicial(
        filiais.map((f) => ({ filialId: f.id, quantidade: 0 }))
      );
      fetchProdutos();
      toast.success("Produto criado com sucesso!");
    } catch {
      toast.error("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  async function confirmarDelete() {
    if (!confirmarId) return;
    setDeletando(true);
    try {
      await apiFetch(`/produtos/${confirmarId}`, { method: "DELETE" });
      toast.success("Produto deletado com sucesso!");
      setProdutos((prev) => prev.filter((p) => p.id !== confirmarId));
    } catch {
      toast.error("Erro ao deletar produto");
    } finally {
      setDeletando(false);
      setConfirmarId(null);
    }
  }

  useEffect(() => {
    fetchProdutos();
    fetchFiliais();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Gestão de Produtos
      </h1>

      {/* Formulário */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4 max-w-md"
      >
        <h2 className="text-xl font-semibold">Cadastrar Produto</h2>
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Fornecedor"
          value={form.fornecedor}
          onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Categoria"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className="w-full border p-2 rounded"
          rows={3}
        />

        <h3 className="font-semibold mt-4">Estoque Inicial por Filial</h3>
        {filiais.map((f, idx) => (
          <div key={f.id} className="flex items-center space-x-2">
            <span className="w-32">{f.nome}</span>
            <input
              type="number"
              min={0}
              className="border p-2 flex-1"
              value={estoqueInicial[idx]?.quantidade || 0}
              onChange={(e) => {
                const newArr = [...estoqueInicial];
                newArr[idx].quantidade = Number(e.target.value);
                setEstoqueInicial(newArr);
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>

      {/* Tabela */}
      <h2 className="text-2xl font-semibold mb-2">Produtos Cadastrados</h2>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Preço</th>
            <th className="p-2 text-left">Fornecedor</th>
            <th className="p-2 text-left">Categoria</th>
            <th className="p-2 text-left">Descrição</th>
            <th className="p-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.nome}</td>
              <td className="p-2">R$ {p.preco.toFixed(2)}</td>
              <td className="p-2">{p.fornecedor}</td>
              <td className="p-2">{p.categoria || "—"}</td>
              <td className="p-2">{p.descricao || "—"}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => setConfirmarId(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
          {produtos.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Nenhum produto cadastrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={!!confirmarId}
        title="Excluir produto"
        message="Tem certeza que deseja deletar este produto?"
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deletando}
        onConfirm={confirmarDelete}
        onCancel={() => setConfirmarId(null)}
      />
    </div>
  );
}
