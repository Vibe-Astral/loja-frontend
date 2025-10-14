import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { apiFetch } from "@/utils/api";

export default function TecnicoOrdens() {
    const [ordens, setOrdens] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [clientes, setClientes] = useState<any[]>([]);
    const [clienteId, setClienteId] = useState("");
    const [clienteNome, setClienteNome] = useState("");
    const [usarAvulso, setUsarAvulso] = useState(false);
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const tokenData = JSON.parse(atob(localStorage.getItem("token")?.split(".")[1] || "null") || "{}");
    const tecnicoId = user?.id || tokenData?.sub;

    // 🔹 Carrega todas as ordens do técnico ou sem técnico
    async function carregarOrdens() {
        setLoading(true);
        try {
            const res = await apiFetch<any[]>("/ordens-servico");
            const minhas = res.filter(
                (os) => os.tecnicoId === tecnicoId || os.tecnicoId === null
            );
            setOrdens(minhas);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar ordens");
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Carrega os clientes disponíveis
    async function carregarClientes() {
        try {
            const res = await apiFetch<any[]>("/users/clientes");
            setClientes(res.filter((u) => u.role === "CLIENTE"));
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar clientes");
        }
    }

    // 🔹 Cria nova ordem de serviço
    async function criarOrdem() {
        try {
            if (!usarAvulso && !clienteId) {
                toast.error("Selecione o cliente");
                return;
            }
            if (usarAvulso && !clienteNome.trim()) {
                toast.error("Informe o nome do cliente");
                return;
            }

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

    // 🔹 Técnico assume a O.S.
    async function assumirOrdem(id: string) {
        try {
            await apiFetch(`/ordens-servico/${id}/assumir`, { method: "POST" });
            toast.success("O.S. assumida com sucesso!");
            carregarOrdens();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao assumir O.S.");
        }
    }

    useEffect(() => {
        carregarOrdens();
        carregarClientes();
    }, []);

    if (loading) return <div className="p-4">Carregando...</div>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">📋 Minhas Ordens de Serviço</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancelar" : "➕ Nova O.S."}
                </Button>
            </div>

            {showForm && (
                <div className="border p-4 rounded-md bg-gray-50 space-y-3">
                    <h2 className="font-semibold">Nova O.S.</h2>

                    <label className="block text-sm text-gray-600">Tipo de Cliente</label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                checked={!usarAvulso}
                                onChange={() => setUsarAvulso(false)}
                            />{" "}
                            Cadastrado
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={usarAvulso}
                                onChange={() => setUsarAvulso(true)}
                            />{" "}
                            Avulso
                        </label>
                    </div>

                    {!usarAvulso ? (
                        <>
                            <label className="block text-sm text-gray-600">Cliente</label>
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
                        </>
                    ) : (
                        <>
                            <label className="block text-sm text-gray-600">
                                Nome do Cliente Avulso
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: José da Silva"
                                value={clienteNome}
                                onChange={(e) => setClienteNome(e.target.value)}
                                className="border p-2 w-full rounded-md"
                            />
                        </>
                    )}

                    <label className="block text-sm text-gray-600">Descrição</label>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descreva o serviço..."
                        className="border p-2 w-full rounded-md"
                    />

                    <Button onClick={criarOrdem}>Criar Ordem</Button>
                </div>
            )}

            {ordens.map((ordem) => (
                <Card key={ordem.id} className="shadow-md border-l-4 border-blue-500">
                    <CardContent className="p-4 flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-blue-600">{ordem.codigo}</h2>
                            <p className="text-sm text-gray-500">
                                Cliente: {ordem.cliente?.nome || ordem.clienteNome || "—"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Técnico: {ordem.tecnico?.nome || "—"}
                            </p>
                            <p className="text-sm">
                                Status: <b>{ordem.status}</b>
                            </p>
                        </div>

                        {!ordem.tecnicoId && ordem.status === "ABERTA" ? (
                            <Button
                                onClick={() => assumirOrdem(ordem.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Assumir
                            </Button>
                        ) : (
                            <Button
                                onClick={() =>
                                    (window.location.href = `/tecnico/ordens/${ordem.id}`)
                                }
                            >
                                Detalhes
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
