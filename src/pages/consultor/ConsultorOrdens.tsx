import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { apiFetch } from "@/utils/api";

export default function ConsultorOrdens() {
    const [ordens, setOrdens] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [clienteId, setClienteId] = useState("");
    const [clienteNome, setClienteNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [usarAvulso, setUsarAvulso] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔹 Carrega todas as O.S.
    async function carregarOrdens() {
        setLoading(true);
        try {
            const res = await apiFetch<any[]>("/ordens-servico");
            setOrdens(res);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar ordens");
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Carrega lista de clientes
    async function carregarClientes() {
        try {
            const res = await apiFetch<any[]>("/users");
            setClientes(res.filter((u) => u.role === "CLIENTE"));
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar clientes");
        }
    }

    // 🔹 Cria nova O.S.
    async function criarOrdem() {
        if (!usarAvulso && !clienteId) {
            toast.error("Selecione o cliente");
            return;
        }
        if (usarAvulso && !clienteNome.trim()) {
            toast.error("Informe o nome do cliente");
            return;
        }

        try {
            await apiFetch("/ordens-servico", {
                method: "POST",
                body: JSON.stringify({
                    clienteId: usarAvulso ? null : clienteId,
                    clienteNome: usarAvulso ? clienteNome : null,
                    descricao,
                }),
            });

            toast.success("Ordem criada com sucesso!");
            setShowForm(false);
            setClienteId("");
            setClienteNome("");
            setDescricao("");
            carregarOrdens();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao criar ordem");
        }
    }

    useEffect(() => {
        carregarOrdens();
        carregarClientes();
    }, []);

    if (loading) return <div className="p-4">Carregando ordens...</div>;
    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">📋 Ordens de Serviço</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancelar" : "➕ Nova O.S."}
                </Button>
            </div>

            {/* 🧾 Formulário de nova O.S. */}
            {showForm && (
                <div className="border p-4 rounded-md bg-gray-50 space-y-3">
                    <h2 className="font-semibold text-gray-700">Criar Ordem de Serviço</h2>

                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                checked={!usarAvulso}
                                onChange={() => setUsarAvulso(false)}
                            />{" "}
                            Cliente Cadastrado
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={usarAvulso}
                                onChange={() => setUsarAvulso(true)}
                            />{" "}
                            Cliente Avulso
                        </label>
                    </div>

                    {!usarAvulso ? (
                        <select
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            className="border p-2 w-full rounded-md"
                        >
                            <option value="">Selecione o cliente...</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nome || c.email}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            placeholder="Nome do cliente avulso"
                            value={clienteNome}
                            onChange={(e) => setClienteNome(e.target.value)}
                            className="border p-2 w-full rounded-md"
                        />
                    )}

                    <textarea
                        placeholder="Descrição do serviço"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="border p-2 w-full rounded-md min-h-[80px]"
                    />

                    <Button onClick={criarOrdem}>Criar Ordem</Button>
                </div>
            )}

            {/* 📋 Lista de ordens */}
            {ordens.length === 0 ? (
                <p className="text-gray-500">Nenhuma O.S. criada ainda.</p>
            ) : (
                ordens.map((ordem) => (
                    <Card
                        key={ordem.id}
                        className={`shadow-md border-l-4 ${ordem.status === "FECHADA"
                                ? "border-green-500"
                                : ordem.tecnicoId
                                    ? "border-yellow-500"
                                    : "border-gray-400"
                            }`}
                    >
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-blue-700">{ordem.codigo}</h2>
                                <p className="text-sm text-gray-600">
                                    Cliente: {ordem.cliente?.nome || ordem.clienteNome || "—"}
                                </p>
                                <p className="text-sm">
                                    Técnico: {ordem.tecnico?.nome || "—"}
                                </p>
                                <p className="text-sm">
                                    Status:{" "}
                                    <b
                                        className={`${ordem.status === "FECHADA"
                                                ? "text-green-600"
                                                : ordem.tecnicoId
                                                    ? "text-yellow-600"
                                                    : "text-gray-600"
                                            }`}
                                    >
                                        {ordem.status}
                                    </b>
                                </p>
                            </div>

                            <Button
                                onClick={() =>
                                    (window.location.href = `/consultor/ordens/${ordem.id}`)
                                }
                            >
                                Detalhes
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
