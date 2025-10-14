import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { apiFetch } from "@/utils/api";

export default function ConsultorOrdemDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ordem, setOrdem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Carrega detalhes da O.S.
  async function carregar() {
    setLoading(true);
    try {
      const res = await apiFetch(`/ordens-servico/${id}`);
      setOrdem(res);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar detalhes da O.S.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  if (loading) return <div className="p-4">Carregando detalhes...</div>;
  if (!ordem) return <div className="p-4 text-red-600">O.S. não encontrada</div>;

  // 🔹 Calcula o total dos itens
  const total = ordem.itens?.reduce(
    (acc: number, i: any) => acc + i.quantidade * (i.produto?.preco ?? 0),
    0
  );

  // 🔹 Define cores conforme o status
  const statusCor =
    {
      ABERTA: "text-gray-600",
      EM_ANDAMENTO: "text-yellow-600",
      FECHADA: "text-green-600",
    }[ordem.status] || "text-gray-600";

  return (
    <div className="p-6 space-y-4">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">
          📄 Detalhes da O.S. {ordem.codigo}
        </h1>
        <Button variant="outline" onClick={() => navigate("/consultor/ordens")}>
          Voltar
        </Button>
      </div>

      {/* Informações básicas */}
      <Card className="shadow-md border">
        <CardContent className="p-4 space-y-2">
          <p>
            <b>Cliente:</b> {ordem.cliente?.nome || ordem.clienteNome || "—"}
          </p>
          <p>
            <b>Técnico responsável:</b>{" "}
            {ordem.tecnico?.nome || <i>Aguardando técnico</i>}
          </p>
          <p>
            <b>Status:</b>{" "}
            <span className={`font-semibold ${statusCor}`}>{ordem.status}</span>
          </p>
          <p>
            <b>Descrição:</b> {ordem.descricao || "Sem descrição"}
          </p>
          <p className="text-sm text-gray-500">
            Criada em: {new Date(ordem.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Última atualização: {new Date(ordem.updatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Lista de produtos usados */}
      <Card className="shadow-md border">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Produtos usados</h2>
          {(!ordem.itens || ordem.itens.length === 0) ? (
            <p className="text-gray-500 text-sm">Nenhum produto adicionado.</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Produto</th>
                  <th className="p-2 text-center">Qtd</th>
                  <th className="p-2 text-center">Preço Unit.</th>
                  <th className="p-2 text-center">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ordem.itens.map((i: any) => (
                  <tr key={i.id}>
                    <td className="border p-2">{i.produto?.nome || "—"}</td>
                    <td className="border p-2 text-center">{i.quantidade}</td>
                    <td className="border p-2 text-center">
                      R$ {i.produto?.preco?.toFixed(2) || "0.00"}
                    </td>
                    <td className="border p-2 text-center">
                      R$ {(i.quantidade * (i.produto?.preco ?? 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={3} className="text-right p-2">
                    Total:
                  </td>
                  <td className="text-center p-2">
                    R$ {total?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Mensagem de status */}
      {ordem.status === "ABERTA" && (
        <div className="p-3 bg-gray-50 border rounded-md text-gray-600 text-sm">
          ⏳ Aguardando um técnico assumir esta O.S.
        </div>
      )}
      {ordem.status === "FECHADA" && (
        <div className="p-3 bg-green-50 border border-green-400 rounded-md text-green-700 text-sm">
          ✅ Ordem fechada. Venda gerada automaticamente.
        </div>
      )}
    </div>
  );
}
