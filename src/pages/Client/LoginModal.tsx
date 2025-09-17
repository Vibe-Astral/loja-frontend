import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Define o esquema de validação para o formulário de login
const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

// 2. Tipos derivados do Zod
type FormData = z.infer<typeof schema>;
interface LoginModalProps {
    onClose: () => void;
}
// 3. O componente do modal
export default function LoginModal({ onClose }: LoginModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Erro ao logar");

            const result = await res.json();

            // 👇 Aqui você salva o token
            localStorage.setItem("token", result.access_token);

            console.log("Token salvo:", result.access_token);

            alert("Login realizado com sucesso!");

            // fecha o modal
            onClose();

            // redirecionar cliente pro portal/dashboard
            window.location.href = "/client/dashboard";
        } catch (err) {
            console.error(err);
            alert("Falha ao logar");
        }
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-8 bg-white w-96 max-w-full rounded-lg shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 className="text-xl font-bold text-center text-accent mb-6">Entrar na sua conta</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-background ${errors.email ? "border-red-500" : "border-gray-300 border"}`}
                            placeholder="seu@email.com"
                        />
                        {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                    </div>

                    {/* Senha */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            {...register("password")}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-background ${errors.password ? "border-red-500" : "border-gray-300 border"}`}
                            placeholder="Sua senha"
                        />
                        {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md font-bold transition-colors duration-200 ease-in-out hover:bg-accent"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}