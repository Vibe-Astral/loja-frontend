import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import toast from "react-hot-toast";

type User = {
  id: string;
  email: string;
  role: string;
  filial?: { id: string; nome: string } | null;
};

type Filial = {
  id: string;
  nome: string;
};

export default function AdminVincularTecnico() {
  const [tecnicos, setTecnicos] = useState<User[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [users, filiais] = await Promise.all([
          apiFetch<User[]>("/users"),
          apiFetch<Filial[]>("/filiais"),
        ]);
        setTecnicos(users.filter((u) => u.role === "TECNICO"));
        setFiliais(filiais);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVincular = async (userId: string, filialId: string) => {
    try {
      await apiFetch(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ filialId }),
      });
      toast.success("Técnico vinculado com sucesso!");
      // Atualiza lista
      const users = await apiFetch<User[]>("/users");
      setTecnicos(users.filter((u) => u.role === "TECNICO"));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao vincular técnico");
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👨‍🔧 Vincular Técnico a Filial</h1>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Filial Atual</th>
            <th className="border px-3 py-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {tecnicos.map((t) => (
            <tr key={t.id}>
              <td className="border px-3 py-2">{t.email}</td>
              <td className="border px-3 py-2">
                {t.filial?.nome ?? "Não vinculado"}
              </td>
              <td className="border px-3 py-2">
                <select
                  defaultValue={t.filial?.id ?? ""}
                  onChange={(e) => handleVincular(t.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">-- Selecione filial --</option>
                  {filiais.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
