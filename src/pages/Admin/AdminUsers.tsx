import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch<User[]>("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar?")) return;
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Gestão de Usuários</h1>

      <div className="bg-white shadow rounded-lg p-6">
        {users.length === 0 ? (
          <p className="text-gray-600">Nenhum usuário encontrado.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Criado em</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
