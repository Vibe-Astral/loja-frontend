import React, { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type Produto = {
  id: string;
  nome: string;
};

type Filial = {
  id: string;
  nome: string;
} | null;

type User = {
  id: string;
  email: string;
} | null;

type Movimentacao = {
  id: string;
  tipo: string;
  quantidade: number;
  createdAt: string;
  produto: Produto;
  origemFilial: Filial;
  destinoFilial: Filial;
  origemTecnico: User;
  destinoTecnico: User;
};

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Movimentacao[]>("/movimentacoes")
      .then(setMovimentacoes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center p-4">Carregando movimentações...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📜 Histórico de Movimentações</h1>

      {movimentacoes.length === 0 ? (
        <p>Nenhuma movimentação registrada.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 shadow-md text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Data</th>
              <th className="border border-gray-300 px-4 py-2">Produto</th>
              <th className="border border-gray-300 px-4 py-2">Quantidade</th>
              <th className="border border-gray-300 px-4 py-2">Tipo</th>
              <th className="border border-gray-300 px-4 py-2">Origem</th>
              <th className="border border-gray-300 px-4 py-2">Destino</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((mov) => (
              <tr key={mov.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(mov.createdAt).toLocaleString("pt-BR")}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {mov.produto.nome}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {mov.quantidade}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  {mov.tipo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {mov.origemFilial?.nome ||
                    mov.origemTecnico?.email ||
                    "—"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {mov.destinoFilial?.nome ||
                    mov.destinoTecnico?.email ||
                    "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
