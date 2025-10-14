// src/pages/Consultor/ConsultorVendas.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ConsultorVendas() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [clienteNome, setClienteNome] = useState(""); // 👈 venda avulsa
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Buscar produtos e clientes
  useEffect(() => {
    fetch("https://loja-backend-4gnm.onrender.com/produtos/estoque", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setProdutos(data) : setProdutos([])))
      .catch(() => setProdutos([]));

    fetch("https://loja-backend-4gnm.onrender.com/users/clientes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setClientes(data) : setClientes([])))
      .catch(() => setClientes([]));

    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    try {
      const res = await fetch("https://loja-backend-4gnm.onrender.com/vendas/minhas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVendas(Array.isArray(data) ? data : []);
    } catch {
      setVendas([]);
    }
  };

  const adicionarItem = (produto: any) => {
    const jaExiste = items.find((i) => i.produtoId === produto.id);

    if (jaExiste) {
      if (jaExiste.quantidade < produto.estoque) {
        setItems(
          items.map((i) =>
            i.produtoId === produto.id
              ? { ...i, quantidade: i.quantidade + 1 }
              : i
          )
        );
      } else {
        toast.error(`Estoque máximo atingido para ${produto.nome}`);
      }
    } else {
      setItems([
        ...items,
        {
          produtoId: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          estoque: produto.estoque,
        },
      ]);
    }
  };

  const alterarQuantidade = (id: string, qnt: number) => {
    const item = items.find((i) => i.produtoId === id);
    if (!item) return;

    if (qnt <= 0) return;
    if (qnt > item.estoque) {
      toast.error(`Quantidade não pode ultrapassar estoque (${item.estoque})`);
      return;
    }

    setItems(
      items.map((i) => (i.produtoId === id ? { ...i, quantidade: qnt } : i))
    );
  };

  const total = items.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  const salvarVenda = async () => {
    if (!clienteId && !clienteNome.trim()) {
      toast.error("Selecione ou informe um cliente!");
      return;
    }
    if (items.length === 0) {
      toast.error("Adicione pelo menos um produto!");
      return;
    }

    setLoading(true);
    const res = await fetch("https://loja-backend-4gnm.onrender.com/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clienteId: clienteId || null,
        clienteNome: clienteId ? null : clienteNome,
        items: items.map((i) => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
        })),
      }),
    });

    if (res.ok) {
      toast.success("Venda registrada com sucesso!");
      setItems([]);
      setClienteId("");
      setClienteNome("");
      carregarVendas();
    } else {
      const err = await res.json();
      toast.error(err.message || "Erro ao registrar venda");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">💰 Registrar Venda</h1>

      {/* Selecionar cliente ou venda avulsa */}
      <select
        value={clienteId}
        onChange={(e) => {
          setClienteId(e.target.value);
          if (e.target.value) setClienteNome("");
        }}
        className="border p-2 rounded w-full"
      >
        <option value="">Venda Avulsa</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome ? `${c.nome} (${c.email})` : c.email}
          </option>
        ))}
      </select>

      {!clienteId && (
        <input
          type="text"
          placeholder="Nome do cliente (opcional)"
          value={clienteNome}
          onChange={(e) => setClienteNome(e.target.value)}
          className="border p-2 rounded w-full"
        />
      )}

      {/* Lista de produtos */}
      <div>
        <h2 className="font-semibold mb-2">Produtos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {produtos.map((e) => {
            const itemCarrinho = items.find((i) => i.produtoId === e.produto.id);
            const atingiuEstoque =
              itemCarrinho && itemCarrinho.quantidade >= e.quantidade;

            return (
              <button
                key={e.produto.id}
                onClick={() =>
                  adicionarItem({
                    ...e.produto,
                    estoque: e.quantidade,
                  })
                }
                disabled={e.quantidade <= 0 || atingiuEstoque}
                className={`p-2 rounded ${
                  e.quantidade > 0 && !atingiuEstoque
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {e.produto.nome} - R${e.produto.preco}
                <br />
                <span className="text-sm text-gray-600">
                  Estoque: {e.quantidade}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carrinho */}
      <div>
        <h2 className="font-semibold mb-2">Itens da Venda</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">Nenhum item adicionado.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li
                key={item.produtoId}
                className="flex justify-between items-center mb-2"
              >
                <span>{item.nome}</span>
                <input
                  type="number"
                  min="1"
                  max={item.estoque}
                  value={item.quantidade}
                  onChange={(e) =>
                    alterarQuantidade(
                      item.produtoId,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-16 border rounded text-center"
                />
                <span>
                  R${(item.preco * item.quantidade).toFixed(2)}{" "}
                  <small className="text-gray-500">
                    (Estoque: {item.estoque})
                  </small>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 font-bold">Total: R${total.toFixed(2)}</div>
        <button
          onClick={salvarVenda}
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Salvando..." : "Salvar Venda"}
        </button>
      </div>

      {/* Lista de vendas */}
      <div>
        <h2 className="text-xl font-bold mb-2">📑 Minhas Vendas</h2>
        {vendas.length === 0 ? (
          <p className="text-gray-500">Nenhuma venda registrada ainda.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Data</th>
                <th className="p-2 border">Cliente</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="p-2 border">
                    {v.createdAt
                      ? new Date(v.createdAt).toLocaleDateString()
                      : "--"}
                  </td>
                  <td className="p-2 border">
                    {v.cliente?.email || v.clienteNome || "Avulso"}
                  </td>
                  <td className="p-2 border">
                    R${Number(v.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
