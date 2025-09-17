import { useEffect, useState } from "react";
import axios from "axios";

interface EstoquePosicao {
  id: string;
  quantidade: number;
  produto: { nome: string };
  filial?: { nome: string };
  tecnico?: { email: string };
}

export default function PosicoesEstoque() {
  const [posicoes, setPosicoes] = useState<EstoquePosicao[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // pegue do login
      const res = await axios.get<EstoquePosicao[]>("http://localhost:3000/estoque/posicoes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosicoes(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📦 Posições de Estoque</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Produto</th>
            <th className="p-2 border">Local</th>
            <th className="p-2 border">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {posicoes.map((pos) => (
            <tr key={pos.id}>
              <td className="p-2 border">{pos.produto.nome}</td>
              <td className="p-2 border">
                {pos.filial ? `Filial: ${pos.filial.nome}` : ""}
                {pos.tecnico ? `Técnico: ${pos.tecnico.email}` : ""}
              </td>
              <td className="p-2 border text-center">{pos.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
