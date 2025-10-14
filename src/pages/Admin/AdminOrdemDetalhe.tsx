import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { apiFetch } from "@/utils/api";

export default function AdminOrdemDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordem, setOrdem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    try {
      // usa o helper centralizado
      const res = await apiFetch<any>(`/ordens-servico/${id}`);
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

  const total = ordem.itens?.reduce(
    (acc: number, i: any) => acc + i.quantidade * (i.produto?.preco ?? 0),
    0
  );

  const statusCor = {
    ABERTA: "text-gray-600",
    EM_ANDAMENTO: "text-yellow-600",
    FECHADA: "text-green-600",
  }[ordem.status];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          🧾 Ordem de Serviço: {ordem.codigo}
        </h1>
        <Button variant="outline" onClick={() => navigate("/admin/ordens")}>
          Voltar
        </Button>
      </div>

      {/* Informações principais */}
      <Card className="shadow-md border">
        <CardContent className="p-4 space-y-2">
          <p>
            <b>Cliente:</b> {ordem.cliente?.nome || ordem.clienteNome || "—"}
          </p>
          <p>
            <b>Técnico:</b> {ordem.tecnico?.nome || <i>Não designado</i>}
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
            Atualizada em: {new Date(ordem.updatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Produtos usados */}
      <Card className="shadow-md border">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Produtos utilizados</h2>
          {ordem.itens?.length === 0 ? (
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

      {/* Informações adicionais */}
      <Card className="shadow-md border">
        <CardContent className="p-4 space-y-2">
          {ordem.status === "FECHADA" ? (
            <>
              <p className="text-green-700">
                ✅ Ordem fechada — venda gerada automaticamente.
              </p>
              {ordem.vendaGeradaId ? (
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `/admin/vendas/${ordem.vendaGeradaId}`)
                  }
                >
                  Ver Venda Vinculada
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  (Nenhuma venda vinculada encontrada)
                </p>
              )}
            </>
          ) : ordem.status === "ABERTA" ? (
            <p className="text-gray-600">⏳ Aguardando técnico assumir.</p>
          ) : (
            <p className="text-yellow-600">
              🚧 Ordem em andamento com o técnico.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ações administrativas (futuro) */}
      {ordem.status === "FECHADA" && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success("Função PDF em desenvolvimento")}
          >
            📄 Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Função reabrir O.S. em breve")}
          >
            🔄 Reabrir O.S.
          </Button>
        </div>
      )}
    </div>
  );
}
