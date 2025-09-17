// src/pages/admin/AdminEstoque.tsx
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  fornecedor: string;
}

interface EstoqueItem {
  id: string;
  quantidade: number;
  produto: Produto;
}

interface Filial {
  id: string;
  nome: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminEstoque() {
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<string>("");
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [tecnicos, setTecnicos] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [transferData, setTransferData] = useState({
    produtoId: "",
    tecnicoId: "",
    quantidade: 1,
  });

  // Carregar filiais e técnicos
  useEffect(() => {
    async function loadData() {
      const filiaisRes = await apiFetch<Filial[]>("/filiais");
      setFiliais(filiaisRes);

      const tecnicosRes = await apiFetch<User[]>("/users");
      setTecnicos(tecnicosRes.filter((u: User) => u.role === "TECNICO"));
    }
    loadData();
  }, []);

  // Carregar estoque da filial selecionada
  useEffect(() => {
    if (selectedFilial) {
      apiFetch<EstoqueItem[]>(`/estoque/filial/${selectedFilial}`).then(setEstoque);
    }
  }, [selectedFilial]);

  const handleTransfer = async () => {
    if (!transferData.tecnicoId) {
      alert("Selecione um técnico de destino.");
      return;
    }

    try {
      await apiFetch("/estoque/transferir", {
        method: "POST",
        body: JSON.stringify({
          produtoId: transferData.produtoId,
          origemFilialId: selectedFilial, // a filial escolhida
          destinoTecnicoId: transferData.tecnicoId, // novo campo
          quantidade: transferData.quantidade,
        }),
      });
      alert("Transferência realizada!");
      setShowModal(false);
      setTransferData({ produtoId: "", tecnicoId: "", quantidade: 1 });
      if (selectedFilial) {
        apiFetch<EstoqueItem[]>(`/estoque/filial/${selectedFilial}`).then(setEstoque);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao transferir produto");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-primary">Gestão de Estoque</h1>

      {/* Selecionar filial */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Selecione a filial:</label>
        <select
          value={selectedFilial}
          onChange={(e) => setSelectedFilial(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Escolha uma filial --</option>
          {filiais.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela de estoque */}
      {selectedFilial && (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Produto</th>
              <th className="border px-4 py-2">Quantidade</th>
              <th className="border px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.produto.nome}</td>
                <td className="border px-4 py-2">{item.quantidade}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setTransferData({
                        ...transferData,
                        produtoId: item.produto.id,
                      });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Transferir para Técnico
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de transferência */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Transferir Produto</h2>

            <label className="block mb-2">Selecione Técnico</label>
            <select
              value={transferData.tecnicoId}
              onChange={(e) =>
                setTransferData({ ...transferData, tecnicoId: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-4"
            >
              <option value="">-- Escolha técnico --</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.email}
                </option>
              ))}
            </select>

            <label className="block mb-2">Quantidade</label>
            <input
              type="number"
              min={1}
              value={transferData.quantidade}
              onChange={(e) =>
                setTransferData({
                  ...transferData,
                  quantidade: Number(e.target.value),
                })
              }
              className="border px-3 py-2 rounded w-full mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
