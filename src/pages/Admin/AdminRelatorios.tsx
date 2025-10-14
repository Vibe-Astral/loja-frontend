import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminRelatorios() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [filiais, setFiliais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    try {
      setLoading(true);

      const headers = { Authorization: `Bearer ${token}` };

      const [dashRes, prodRes, rankRes, filiaisRes] = await Promise.all([
        fetch("https://loja-backend-4gnm.onrender.com/relatorios/dashboard", { headers }),
        fetch("https://loja-backend-4gnm.onrender.com/relatorios/produtos-mais-vendidos?inicio=2025-09-01&fim=2025-09-30", { headers }),
        fetch("https://loja-backend-4gnm.onrender.com/relatorios/ranking-consultores?inicio=2025-09-01&fim=2025-09-30", { headers }),
        fetch("https://loja-backend-4gnm.onrender.com/relatorios/vendas-filial?inicio=2025-09-01&fim=2025-09-30", { headers }),
      ]);

      const [dash, prod, rank, fil] = await Promise.all([
        dashRes.json(),
        prodRes.json(),
        rankRes.json(),
        filiaisRes.json(),
      ]);

      setDashboard(dash);
      setProdutos(Array.isArray(prod) ? prod : []);
      setRanking(Array.isArray(rank) ? rank : []);
      setFiliais(Array.isArray(fil) ? fil : []);
    } catch (err) {
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Carregando relatórios...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Relatórios Administrativos</h1>

      {/* Dashboard Resumo */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-100 rounded shadow">
            <h2 className="font-semibold">Faturamento</h2>
            <p className="text-xl">R${dashboard.faturamento.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded shadow">
            <h2 className="font-semibold">Vendas</h2>
            <p className="text-xl">{dashboard.vendas}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow">
            <h2 className="font-semibold">Ticket Médio</h2>
            <p className="text-xl">R${dashboard.ticketMedio.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-red-100 rounded shadow">
            <h2 className="font-semibold">Baixo Estoque</h2>
            <p className="text-xl">{dashboard.baixoEstoque}</p>
          </div>
        </div>
      )}

      {/* Produtos Mais Vendidos */}
      <div>
        <h2 className="text-xl font-bold mb-2">🏆 Produtos Mais Vendidos</h2>
        {produtos.length === 0 ? (
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Produto</th>
                <th className="p-2 border">Quantidade</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p: any) => (
                <tr key={p.produtoId || p.nome} className="border-t">
                  <td className="p-2 border">{p.nome || p.produtoId}</td>
                  <td className="p-2 border">{p.quantidade}</td>
                  <td className="p-2 border">R${p.total?.toFixed(2) || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Ranking de Consultores */}
      <div>
        <h2 className="text-xl font-bold mb-2">👨‍💼 Ranking de Consultores</h2>
        {ranking.length === 0 ? (
          <p className="text-gray-500">Nenhum consultor encontrado.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Consultor</th>
                <th className="p-2 border">Filial</th>
                <th className="p-2 border">Vendas</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((c: any) => (
                <tr key={c.consultorId} className="border-t">
                  <td className="p-2 border">{c.email}</td>
                  <td className="p-2 border">{c.filial || "--"}</td>
                  <td className="p-2 border">{c.qtd}</td>
                  <td className="p-2 border">R${c.total.toFixed(2)}</td>
                  <td className="p-2 border">R${c.ticketMedio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Vendas por Filial */}
      <div>
        <h2 className="text-xl font-bold mb-2">🏢 Vendas por Filial</h2>
        {filiais.length === 0 ? (
          <p className="text-gray-500">Nenhuma filial encontrada.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Consultor</th>
                <th className="p-2 border">Filial</th>
                <th className="p-2 border">Total da Venda</th>
              </tr>
            </thead>
            <tbody>
              {filiais.map((v: any, idx) => (
                <tr key={v.consultorId || idx} className="border-t">
                  <td className="p-2 border">{v.consultor?.email}</td>
                  <td className="p-2 border">{v.consultor?.filial?.nome}</td>
                  <td className="p-2 border">R${v.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
