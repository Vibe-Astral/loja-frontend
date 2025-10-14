// src/pages/Consultor/ConsultorRelatorios.tsx
import { useEffect, useState } from "react";

export default function ConsultorRelatorios() {
  const [relatorio, setRelatorio] = useState<any>(null);

  useEffect(() => {
    fetch("https://loja-backend-4gnm.onrender.com/vendas/relatorio/minhas", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setRelatorio);
  }, []);

  if (!relatorio) return <p>Carregando...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📊 Relatório de Vendas</h1>
      <ul className="space-y-2">
        <li>Total vendido: <b>R${relatorio.total.toFixed(2)}</b></li>
        <li>Quantidade de vendas: <b>{relatorio.qtd}</b></li>
        <li>Ticket médio: <b>R${relatorio.ticketMedio.toFixed(2)}</b></li>
      </ul>
    </div>
  );
}
