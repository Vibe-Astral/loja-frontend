// src/pages/Technician/TechnicianLogin.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function TechnicianLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("https://loja-backend-4gnm.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Tenta extrair mensagem do backend quando não for OK
      if (!res.ok) {
        let detail = "Falha no login, verifique suas credenciais";
        try {
          const errJson = await res.json();
          if (errJson?.message) detail = Array.isArray(errJson.message) ? errJson.message[0] : errJson.message;
        } catch {}
        throw new Error(detail);
      }

      const result = await res.json();

      // Sempre salva o token
      localStorage.setItem("token", result.access_token);

      // Se o backend já devolve user, usa direto
      if (result.user) {
        if (result.user.role) localStorage.setItem("role", result.user.role);
        if (result.user.id) localStorage.setItem("userId", result.user.id);
        if (result.user.filialId) localStorage.setItem("filialId", result.user.filialId);
      } else {
        // Fallback: decodifica o JWT para obter os claims (role/filialId/sub)
        try {
          const [, payload] = result.access_token.split(".");
          const json = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          );
          if (json?.role) localStorage.setItem("role", json.role);
          if (json?.sub) localStorage.setItem("userId", json.sub);
          if (json?.filialId) localStorage.setItem("filialId", json.filialId);
        } catch {
          // silencioso — segue apenas com o token
        }
      }

      toast.success("Login realizado com sucesso!");
      navigate("/tecnico");
    } catch (err: any) {
      toast.error(err?.message || "Falha no login, verifique suas credenciais");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login Técnico</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="tecnico@erp.com"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              {...register("password")}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="********"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md font-bold transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
