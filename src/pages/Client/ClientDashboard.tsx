import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 pega o token salvo no login
        if (!token) {
          alert("Você precisa estar logado!");
          window.location.href = "/client/portal";
          return;
        }

        const res = await fetch("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar usuário");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        alert("Sessão inválida. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "/client/portal";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Área do Cliente</h1>
        {user ? (
          <div className="mt-4">
            <p><strong>ID:</strong> {user.userId}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : (
          <p>Não foi possível carregar os dados do usuário.</p>
        )}
      </div>
    </>
  );
}
