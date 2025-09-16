import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import LoginModal from "./LoginModal"; // Importa o novo componente
import { useNavigate } from "react-router-dom";
import PG from '@/assets/PG_SEMFUNDO.png'
// 1. Define o esquema de validação com Zod
const schema = z.object({
    name: z.string().min(10, "Nome precisa ter pelo menos 10 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

// 2. Tipos derivados do Zod
type FormData = z.infer<typeof schema>;

export default function FormAuth() {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false); // Adiciona o estado para o modal

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    role: "CLIENTE", // 👈 sempre cliente
                }),
            });

            if (!res.ok) throw new Error("Erro ao criar conta");

            const result = await res.json();
            console.log("Usuário criado:", result);
            const token = localStorage.getItem("token");

            await fetch("http://localhost:3000/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Conta criada com sucesso!");
            navigate("/client/dashboard");

        } catch (err) {
            console.error(err);
            alert("Falha ao criar conta");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-background px-4 py-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-stretch w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden">

                {/* Lado visual / imagem */}
                <div className="hidden lg:flex lg:w-1/2 bg-brand-accent items-center justify-center">
                    {/* Substitua a URL abaixo pela sua própria imagem ou use um SVG */}
                    <img
                        src={PG}
                        alt="Mascote Luiz TEC PG"
                        className="object-contain w-3/4 h-3/4 animate-fade-in"
                    />
                </div>

                {/* Formulário */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full lg:w-1/2 p-6 space-y-4 flex flex-col justify-center"
                >
                    <h2 className="text-2xl font-bold text-center text-accent">Criar Conta</h2>

                    {/* Nome */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Nome</label>
                        <input
                            {...register("name")}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-background ${errors.name ? "border-red-500" : "border-gray-300 border"
                                }`}
                            placeholder="Seu nome"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-background ${errors.email ? "border-red-500" : "border-gray-300 border"
                                }`}
                            placeholder="seu@email.com"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
                        )}
                    </div>

                    {/* Senha e Confirmação de Senha - Lado a Lado em telas maiores */}
                    <div className="flex flex-col lg:flex-row lg:gap-4">
                        <div className="flex flex-col lg:w-1/2 mb-4 lg:mb-0">
                            <label className="mb-1 text-sm font-medium text-gray-700">Senha</label>
                            <input
                                type="password"
                                {...register("password")}
                                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-background ${errors.password ? "border-red-500" : "border-gray-300 border"
                                    }`}
                                placeholder="Sua senha"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col lg:w-1/2">
                            <label className="mb-1 text-sm font-medium text-gray-700">Confirmação</label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-background ${errors.confirmPassword ? "border-red-500" : "border-gray-300 border"
                                    }`}
                                placeholder="Confirme a senha"
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white 5 py-2 rounded-md font-bold transition-colors duration-200 ease-in-out hover:bg-accent"
                    >
                        Criar Conta
                    </button>

                    <div className="flex flex-col items-center space-y-4">
                        <span className="text-sm text-gray-500">- Ou continue com -</span>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center space-x-2 bg-gray-300 text-gray-800 py-2 rounded-md font-semibold transition-colors duration-200 ease-in-out hover:bg-gray-200 "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12.24 10.284v3.136h5.362c-.22 1.34-1.258 2.68-3.033 3.493l-.01.008a6.574 6.574 0 0 1-5.018 0l-.01-.008a6.574 6.574 0 0 1-3.033-3.493l-.01-.008h-.002l-.004-.002v-.004h-.002v-.004l-.002-.004V10.284H12.24z" fill="#4285F4" />
                                <path d="M12.24 10.284v3.136h5.362c-.22 1.34-1.258 2.68-3.033 3.493l-.01.008a6.574 6.574 0 0 1-5.018 0l-.01-.008a6.574 6.574 0 0 1-3.033-3.493l-.01-.008h-.002l-.004-.002v-.004h-.002v-.004l-.002-.004V10.284H12.24z" fill="#EA4335" />
                                <path d="M12.24 10.284v3.136h5.362c-.22 1.34-1.258 2.68-3.033 3.493l-.01.008a6.574 6.574 0 0 1-5.018 0l-.01-.008a6.574 6.574 0 0 1-3.033-3.493l-.01-.008h-.002l-.004-.002v-.004h-.002v-.004l-.002-.004V10.284H12.24z" fill="#FBBC04" />
                                <path d="M12.24 10.284v3.136h5.362c-.22 1.34-1.258 2.68-3.033 3.493l-.01.008a6.574 6.574 0 0 1-5.018 0l-.01-.008a6.574 6.574 0 0 1-3.033-3.493l-.01-.008h-.002l-.004-.002v-.004h-.002v-.004l-.002-.004V10.284H12.24z" fill="#34A853" />
                            </svg>
                            <span>Entrar com Google</span>
                        </button>
                    </div>

                    <div className="text-center text-sm mt-4">
                        Já tem uma conta?{" "}
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowLoginModal(true); }} className="font-semibold text-brand-primary hover:underline">
                            Logar
                        </a>
                    </div>
                </form>
            </div>

            {/* Renderiza o modal se showLoginModal for true */}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </div>
    );
}