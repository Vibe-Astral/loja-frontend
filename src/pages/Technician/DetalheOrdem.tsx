import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { apiFetch } from "@/utils/api";

export default function DetalheOrdem() {
  const { id } = useParams<{ id: string }>();

  const [ordem, setOrdem] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Busca detalhes da O.S.
  async function carregarOrdem() {
    setLoading(true);
    try {
      const res = await apiFetch(`/ordens-servico/${id}`);
      setOrdem(res);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar ordem");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Busca produtos disponíveis
  async function carregarProdutos() {
    try {
      const res = await apiFetch<any[]>("/produtos");
      setProdutos(res);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar produtos");
    }
  }

  // 🔹 Adiciona produto à O.S.
  async function adicionarProduto() {
    if (!produtoId) {
      toast.error("Selecione um produto");
      return;
    }
    if (quantidade <= 0) {
      toast.error("Quantidade inválida");
      return;
    }

    try {
      await apiFetch("/ordens-servico/item", {
        method: "POST",
        body: JSON.stringify({
          ordemId: id,
          produtoId,
          quantidade,
          observacao,
        }),
      });

      toast.success("Produto adicionado!");
      setProdutoId("");
      setQuantidade(1);
      setObservacao("");
      carregarOrdem();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar produto");
    }
  }

  // 🔹 Fechar a O.S.
  async function fecharOrdem() {
    try {
      await apiFetch("/ordens-servico/status", {
        method: "PATCH",
        body: JSON.stringify({ ordemId: id, status: "FECHADA" }),
      });
      toast.success("Ordem encerrada com sucesso!");
      carregarOrdem();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao encerrar O.S.");
    }
  }

  useEffect(() => {
    carregarOrdem();
    carregarProdutos();
  }, [id]);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (!ordem) return <div className="p-4">O.S. não encontrada.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📄 Ordem {ordem.codigo}</h1>

      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-2">
          <p>
            <b>Cliente:</b>{" "}
            {ordem.cliente?.nome || ordem.clienteNome || "Cliente Avulso"}
          </p>
          <p>
            <b>Descrição:</b> {ordem.descricao || "Sem descrição"}
          </p>
          <p>
            <b>Status:</b>{" "}
            <span
              className={`font-semibold ${
                ordem.status === "FECHADA" ? "text-green-600" : "text-blue-600"
              }`}
            >
              {ordem.status}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Criada em: {new Date(ordem.createdAt).toLocaleString("pt-BR")}
          </p>
        </CardContent>
      </Card>

      {/* 🔹 Adicionar produto */}
      {ordem.status !== "FECHADA" && (
        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">Adicionar Produto Usado</h2>

            <select
              className="border rounded-md p-2 w-full"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
            >
              <option value="">Selecione o produto...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — R${p.preco.toFixed(2)}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min={1}
              className="border rounded-md p-2 w-full"
              placeholder="Quantidade"
            />

            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="border rounded-md p-2 w-full"
              placeholder="Observações (opcional)"
            />

            <Button onClick={adicionarProduto}>Adicionar Produto</Button>
          </CardContent>
        </Card>
      )}

      {/* 🔹 Lista de produtos usados */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Produtos Usados</h2>
          {ordem.itens.length === 0 ? (
            <p className="text-gray-500">Nenhum produto vinculado.</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="p-2 border">Produto</th>
                  <th className="p-2 border">Qtd</th>
                  <th className="p-2 border">Preço</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ordem.itens.map((item: any) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.produto.nome}</td>
                    <td className="border p-2 text-center">
                      {item.quantidade}
                    </td>
                    <td className="border p-2 text-center">
                      R$ {item.produto.preco.toFixed(2)}
                    </td>
                    <td className="border p-2 text-center">
                      R${" "}
                      {(item.produto.preco * item.quantidade).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* 🔹 Encerrar O.S. */}
      {ordem.status !== "FECHADA" && (
        <div className="flex justify-end">
          <Button
            onClick={fecharOrdem}
            variant="secondary"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ✅ Encerrar Ordem de Serviço
          </Button>
        </div>
      )}
    </div>
  );
}
