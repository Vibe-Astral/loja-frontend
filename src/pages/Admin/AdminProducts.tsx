import React, { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type Produto = {
  id: string;
  nome: string;
  preco: number;
  fornecedor: string;
};

export default function AdminProducts() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState({ nome: "", preco: "", fornecedor: "" });
  const [loading, setLoading] = useState(false);

  const fetchProdutos = async () => {
    try {
      const data = await apiFetch<Produto[]>("/produtos");
      setProdutos(data);
    } catch (err) {
      console.error(err);
      alert("Falha ao carregar produtos");
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
        }),
      });
      setForm({ nome: "", preco: "", fornecedor: "" });
      fetchProdutos();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;
    try {
      await apiFetch(`/produtos/${id}`, { method: "DELETE" });
      alert("Produto deletado com sucesso!");
    } catch (err: any) {
      alert(err.message || "Não foi possível deletar. Verifique se o produto está em uso.");
    }

  };

  useEffect(() => {
    fetchProdutos();
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
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
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
            <th className="p-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.nome}</td>
              <td className="p-2">R$ {p.preco.toFixed(2)}</td>
              <td className="p-2">{p.fornecedor}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
          {produtos.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Nenhum produto cadastrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
