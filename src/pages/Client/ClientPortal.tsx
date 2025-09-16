import { Navbar } from "@/components/Navbar";
import React from "react";
import { Link } from "react-router-dom";

export default function ClientPortal() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center text-primary mb-4">
            Portal do Cliente
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Aqui você acompanha suas <span className="font-semibold">ordens de serviço</span>, 
            conversa diretamente com um consultor e mantém o histórico dos seus reparos em um só lugar.  
          </p>

          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2 text-primary">📋 Ordens de Serviço</h3>
              <p className="text-gray-700 text-sm">
                Consulte o status de cada reparo, acompanhe prazos e detalhes do atendimento.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2 text-primary">💬 Contato com Consultor</h3>
              <p className="text-gray-700 text-sm">
                Tire dúvidas rapidamente via WhatsApp com nossos consultores especializados.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2 text-primary">🗂 Histórico</h3>
              <p className="text-gray-700 text-sm">
                Veja todos os serviços já realizados, com notas e garantias associadas.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <Link
              to="/client/portal/auth"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition"
            >
              Cadastrar / Logar
            </Link>

            <div>
              <a
                href="https://wa.me/5599999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition"
              >
                <span className="mr-2">📱</span> Falar com Consultor
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
