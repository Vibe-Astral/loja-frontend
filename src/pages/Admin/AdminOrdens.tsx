import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { apiFetch } from "@/utils/api";

export default function AdminOrdens() {
  const [ordens, setOrdens] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTecnico, setFiltroTecnico] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregarOrdens() {
    setLoading(true);
    try {
      const data = await apiFetch<any[]>("/ordens-servico");
      setOrdens(data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar ordens");
    } finally {
      setLoading(false);
    }
  }

  async function carregarTecnicos() {
    try {
      const data = await apiFetch<any[]>("/users");
      setTecnicos(data.filter((u: any) => u.role === "TECNICO"));
    } catch (err) {
      console.error("Erro ao carregar técnicos", err);
    }
  }

  useEffect(() => {
    carregarOrdens();
    carregarTecnicos();
  }, []);

  function filtrar(ordens: any[]) {
    return ordens
      .filter((o) => (filtroStatus ? o.status === filtroStatus : true))
      .filter((o) => (filtroTecnico ? o.tecnicoId === filtroTecnico : true))
      .filter((o) => {
        if (!busca.trim()) return true;
        const texto = busca.toLowerCase();
        return (
          o.codigo.toLowerCase().includes(texto) ||
          o.cliente?.nome?.toLowerCase().includes(texto) ||
          o.clienteNome?.toLowerCase().includes(texto)
        );
      });
  }

  if (loading) return <div className="p-4">Carregando O.S....</div>;

  const ordensFiltradas = filtrar(ordens);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-700">
        🧾 Painel de Ordens de Serviço
      </h1>

      {/* 🔍 Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Todos os status</option>
          <option value="ABERTA">Abertas</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="FECHADA">Fechadas</option>
        </select>

        <select
          value={filtroTecnico}
          onChange={(e) => setFiltroTecnico(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Todos os técnicos</option>
          {tecnicos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome || t.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por código ou cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded-md flex-1 min-w-[200px]"
        />

        <Button
          variant="outline"
          onClick={() => {
            setFiltroStatus("");
            setFiltroTecnico("");
            setBusca("");
          }}
        >
          Limpar Filtros
        </Button>
      </div>

      {/* 🧾 Lista de O.S. */}
      {ordensFiltradas.length === 0 ? (
        <p className="text-gray-500 mt-4">Nenhuma O.S. encontrada.</p>
      ) : (
        <div className="grid gap-3">
          {ordensFiltradas.map((ordem) => {
            const total =
              ordem.itens?.reduce(
                (acc: number, i: any) =>
                  acc + i.quantidade * (i.produto?.preco ?? 0),
                0
              ) ?? 0;

            const statusColor =
              ordem.status === "FECHADA"
                ? "text-green-600"
                : ordem.status === "EM_ANDAMENTO"
                ? "text-yellow-600"
                : "text-gray-600";

            return (
              <Card
                key={ordem.id}
                className="shadow-md border-l-4 border-blue-500 hover:shadow-lg transition"
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-blue-700">{ordem.codigo}</h2>
                    <p className="text-sm text-gray-600">
                      Cliente: {ordem.cliente?.nome || ordem.clienteNome || "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Técnico: {ordem.tecnico?.nome || "—"}
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <b className={`${statusColor}`}>{ordem.status}</b>
                    </p>
                    <p className="text-sm">
                      Total:{" "}
                      <b className="text-gray-800">R$ {total.toFixed(2)}</b>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Button
                      onClick={() =>
                        (window.location.href = `/admin/ordens/${ordem.id}`)
                      }
                    >
                      Detalhes
                    </Button>

                    {ordem.status === "FECHADA" && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = `/admin/vendas/${ordem.vendaGeradaId}`)
                        }
                      >
                        Ver Venda
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
