import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("https://loja-backend-4gnm.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao logar");

      const result = await res.json();
      localStorage.setItem("token", result.access_token);
      localStorage.setItem("role", "ADMIN");

      window.location.href = "/admin"; // redireciona para o portal
    } catch (err) {
      alert("Falha no login");
      console.log("Falha no login", err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow p-6 rounded-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-primary">Login Admin</h2>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg font-bold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
