// src/pages/admin/AdminEstoqueTecnico.tsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

interface Produto {
  id: string;
  nome: string;
}

interface EstoqueItem {
  id: string;
  quantidade: number;
  produto: Produto;
}

interface Tecnico {
  id: string;
  email: string;
}

export default function AdminEstoqueTecnico() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [selectedTecnico, setSelectedTecnico] = useState<string>("");
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);

  useEffect(() => {
    async function loadTecnicos() {
      const res = await apiFetch("/users");
      setTecnicos(res.filter((u: any) => u.role === "TECNICO"));
    }
    loadTecnicos();
  }, []);

  useEffect(() => {
    if (selectedTecnico) {
      apiFetch(`/estoque/tecnico/${selectedTecnico}`).then(setEstoque);
    }
  }, [selectedTecnico]);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Estoque de Técnico</h1>

      {/* Selecionar técnico */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Selecione o técnico:</label>
        <select
          value={selectedTecnico}
          onChange={(e) => setSelectedTecnico(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Escolha técnico --</option>
          {tecnicos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.email}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela de estoque */}
      {selectedTecnico && (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Produto</th>
              <th className="border px-4 py-2">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.produto.nome}</td>
                <td className="border px-4 py-2">{item.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
