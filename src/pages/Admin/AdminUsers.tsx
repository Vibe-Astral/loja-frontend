import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";
import { Link } from "react-router-dom";
type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  filial?: { id: string; nome: string } | null;
};

type Filial = {
  id: string;
  nome: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TECNICO");
  const [filialId, setFilialId] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPassword, setEditingPassword] = useState(""); // 👈 novo
  const [confirmarId, setConfirmarId] = useState<string | null>(null);
  const [deletando, setDeletando] = useState(false);

  // Atualizar usuário
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await apiFetch(`/users/${editingUser.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          email: editingUser.email,
          role: editingUser.role,
          filialId: editingUser.filial?.id || null,
          password: editingPassword || undefined, // 👈 só manda se preenchido
        }),
      });
      setEditingUser(null);
      setEditingPassword("");
      fetchUsers();
      toast.success("Usuário atualizado!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar usuário");
    }
  };


  const fetchUsers = async () => {
    try {
      const data = await apiFetch<User[]>("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const fetchFiliais = async () => {
    try {
      const data = await apiFetch<Filial[]>("/filiais");
      setFiliais(data);
    } catch (err) {
      console.error(err);
    }
  };

  async function confirmarDelete() {
    if (!confirmarId) return;
    try {
      await apiFetch(`/users/${confirmarId}`, { method: "DELETE" });
      toast.success("Usuário removido!");
      setUsers((prev) => prev.filter((u) => u.id !== confirmarId));
    } catch {
      toast.error("Erro ao deletar usuário");
    } finally {
      setDeletando(false);
      setConfirmarId(null);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          role,
          filialId: filialId || null,
        }),
      });
      setEmail("");
      setPassword("");
      setRole("TECNICO");
      setFilialId("");
      fetchUsers();
      toast.success("Usuário criado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFiliais();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Gestão de Usuários</h1>

      {/* Formulário */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Criar Usuário</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              type="email"
              className="border px-3 py-2 rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha</label>
            <input
              type="password"
              className="border px-3 py-2 rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Role</label>
            <select
              className="border px-3 py-2 rounded w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="CONSULTOR">CONSULTOR</option>
              <option value="TECNICO">TECNICO</option>
              <option value="CLIENTE">CLIENTE</option>
              <option value="ESTOQUISTA">ESTOQUISTA</option>
            </select>
          </div>
          <div>
            <label>Filial</label>
            <select
              className="border px-3 py-2 rounded w-full"
              value={filialId}
              onChange={(e) => setFilialId(e.target.value)}
            >
              <option value="">-- Nenhuma --</option>
              {filiais.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Criar
          </button>
        </form>
      </div>
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <Link to="/admin/vincular-tecnico" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >Vincular Filial Ao Usuario</Link>
      </div>
      {/* Lista de usuários */}
      <div className="bg-white shadow rounded-lg p-6">
        {users.length === 0 ? (
          <p className="text-gray-600">Nenhum usuário encontrado.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Filial</th>
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
                    {u.filial?.nome || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmarId(u.id)}
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

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Editar Usuário</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  className="border px-3 py-2 rounded w-full"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  className="border px-3 py-2 rounded w-full"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="CONSULTOR">CONSULTOR</option>
                  <option value="TECNICO">TECNICO</option>
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="ESTOQUISTA">ESTOQUISTA</option>
                </select>
              </div>
              <div>
                <label>Filial</label>
                <select
                  className="border px-3 py-2 rounded w-full"
                  value={editingUser.filial?.id || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      filial: e.target.value
                        ? { id: e.target.value, nome: filiais.find(f => f.id === e.target.value)?.nome || "" }
                        : null,
                    })
                  }
                >
                  <option value="">-- Nenhuma --</option>
                  {filiais.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Nova Senha (opcional)</label>
                <input
                  type="password"
                  className="border px-3 py-2 rounded w-full"
                  value={editingPassword}
                  onChange={(e) => setEditingPassword(e.target.value)}
                  placeholder="Deixe em branco para não alterar"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmarId && (
        <ConfirmModal
          isOpen={!!confirmarId}
          title="Confirmar exclusão"
          message="Tem certeza que deseja excluir este usuário?"
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          loading={deletando} // precisa ser um estado boolean
          onCancel={() => setConfirmarId(null)}
          onConfirm={confirmarDelete}
        />
      )}
    </div>
  );
}
