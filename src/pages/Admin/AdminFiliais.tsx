// src/pages/admin/AdminFiliais.tsx
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type Filial = {
    id: string;
    nome: string;
};

type Estoque = {
    id: string;
    quantidade: number;
    produto: {
        id: string;
        nome: string;
        preco: number;
        fornecedor: string;
    };
};

export default function AdminFiliais() {
    const [filiais, setFiliais] = useState<Filial[]>([]);
    const [estoque, setEstoque] = useState<Estoque[]>([]);
    const [filialSelecionada, setFilialSelecionada] = useState<string>("");

    useEffect(() => {
        async function fetchFiliais() {
            try {
                const res = await apiFetch<Filial[]>("/filiais");
                setFiliais(res);
            } catch (err) {
                console.error("Erro ao carregar filiais:", err);
            }
        }
        fetchFiliais();
    }, []);

    async function carregarEstoque(filialId: string) {
        try {
            setFilialSelecionada(filialId);
            const res = await apiFetch<Estoque[]>(`/filiais/${filialId}/estoque`);

            setEstoque(res);
        } catch (err) {
            console.error("Erro ao carregar estoque da filial:", err);
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Gestão de Filiais</h1>
            <p className="mb-6 text-gray-600">
                Selecione uma filial para visualizar seu estoque.
            </p>

            {/* Lista de filiais */}
            <div className="flex gap-4 mb-6">
                {filiais.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => carregarEstoque(f.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filialSelecionada === f.id
                            ? "bg-primary text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {f.nome}
                    </button>
                ))}
            </div>

            {/* Estoque da filial */}
            {filialSelecionada && (
                <div>
                    <h2 className="text-xl font-bold mb-4">
                        Estoque da filial:{" "}
                        {filiais.find((f) => f.id === filialSelecionada)?.nome}
                    </h2>

                    {estoque.length === 0 ? (
                        <p className="text-gray-600">Nenhum produto nesta filial.</p>
                    ) : (
                        <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3">Produto</th>
                                    <th className="p-3">Fornecedor</th>
                                    <th className="p-3">Preço</th>
                                    <th className="p-3">Quantidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estoque.map((e) => (
                                    <tr key={e.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{e.produto.nome}</td>
                                        <td className="p-3">{e.produto.fornecedor}</td>
                                        <td className="p-3">R$ {e.produto.preco.toFixed(2)}</td>
                                        <td className="p-3">{e.quantidade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
