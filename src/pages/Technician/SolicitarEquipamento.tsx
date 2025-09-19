// src/pages/Technician/SolicitarEquipamento.tsx
import React, { useEffect, useState } from "react";

type Produto = {
  id: string;
  nome: string;
  preco: number;
  fornecedor: string;
};

export default function SolicitarEquipamento() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensagem("Você precisa estar logado!");
          return;
        }

        const res = await fetch("https://loja-backend-4gnm.onrender.com/produtos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erro ao carregar produtos");
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error(err);
        setMensagem("Erro ao carregar lista de produtos");
      }
    };

    fetchProdutos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMensagem("Você precisa estar logado!");
        return;
      }

      const res = await fetch("https://loja-backend-4gnm.onrender.com/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produtoId,
          quantidade,
        }),
      });

      if (!res.ok) throw new Error("Erro ao enviar pedido");

      setMensagem("✅ Pedido enviado com sucesso!");
      setProdutoId("");
      setQuantidade(1);
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao enviar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🛠 Solicitar Equipamento</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Seletor de produto */}
        <div>
          <label className="block mb-1">Produto</label>
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — R$ {p.preco.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Quantidade */}
        <div>
          <label className="block mb-1">Quantidade</label>
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Enviando..." : "Enviar Pedido"}
        </button>
      </form>

      {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
    </div>
  );
}
