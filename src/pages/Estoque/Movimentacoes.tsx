import { useEffect, useState } from "react";
import axios from "axios";

interface Movimentacao {
  id: string;
  tipo: string;
  quantidade: number;
  produto: { nome: string };
  createdAt: string;
}

export default function Movimentacoes() {
  const [movs, setMovs] = useState<Movimentacao[]>([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(0);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get<Movimentacao[]>("https://loja-backend-4gnm.onrender.com/movimentacoes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMovs(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const registrarEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      "https://loja-backend-4gnm.onrender.com/movimentacoes/entrada",
      { produtoId, quantidade, destinoFilialId: "<uuid-da-filial>" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🔄 Movimentações</h1>

      <form onSubmit={registrarEntrada} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Produto ID"
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          className="border p-2 flex-1"
        />
        <input
          type="number"
          placeholder="Qtd"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="border p-2 w-24"
        />
        <button className="bg-blue-500 text-white px-4">Registrar Entrada</button>
      </form>

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Data</th>
            <th className="p-2 border">Produto</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Qtd</th>
          </tr>
        </thead>
        <tbody>
          {movs.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border">{new Date(m.createdAt).toLocaleString()}</td>
              <td className="p-2 border">{m.produto.nome}</td>
              <td className="p-2 border">{m.tipo}</td>
              <td className="p-2 border text-center">{m.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
