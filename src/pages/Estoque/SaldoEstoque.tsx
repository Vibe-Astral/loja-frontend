import { useEffect, useState } from "react";
import axios from "axios";

interface SaldoProduto {
  produto: { id: string; nome: string };
  quantidade: number;
}

export default function SaldoEstoque() {
  const [saldos, setSaldos] = useState<SaldoProduto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get<SaldoProduto[]>("http://localhost:3000/estoque/saldo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaldos(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 Saldo Consolidado por Produto</h1>
      <ul className="space-y-2">
        {saldos.map((s) => (
          <li key={s.produto.id} className="p-3 border rounded flex justify-between">
            <span>{s.produto.nome}</span>
            <span className="font-bold">{s.quantidade}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
