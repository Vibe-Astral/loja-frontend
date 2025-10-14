// src/pages/Consultor/ConsultorPortal.tsx
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";

export default function ConsultorPortal() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-primary">Portal do Consultor</h1>
          <p className="mb-4 text-gray-700">
            Bem-vindo ao Portal do Consultor. Aqui você poderá registrar vendas,
            acompanhar clientes e gerenciar suas movimentações de estoque.
          </p>

          <p className="mb-6 text-gray-600">
            Para continuar, faça login com sua conta de consultor.
          </p>

          <Link
            to="/consultor/login"
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Acessar Login
          </Link>
        </div>
      </div>
    </>
  );
}
