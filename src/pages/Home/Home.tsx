import { Navbar } from "@/components/Navbar";
import { Typewriter } from "react-simple-typewriter";

// Imports das imagens
import bgll from "@/assets/conserto.jpg";
import SamsungLogo from "@/assets/Samsung_Logo.svg.png";
import AppleLogo from "@/assets/Apple_logo_black.svg.png";
import XiaomiLogo from "@/assets/Xiaomi_logo_2021.svg.webp";
import MotorolaLogo from "@/assets/Motorola_logo.svg.png";
import LGLogo from "@/assets/LG_logo_2014.svg.png";
import RealmeLogo from "@/assets/Realme_logo_SVG.svg.png";
import InfinixLogo from "@/assets/Infinix_logo.png";
import Bateria from "@/assets/bateria.png";
import CelularQuebrado from "@/assets/celular quebrado.png";
import SmartphoneQuebrado from "@/assets/smartphone-quebrado.png";
import faceid from '@/assets/face_id_100.png'
import camera from '@/assets/capa-para-smartphone.png'
import conector from '@/assets/trocaConector.png'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-background text-white">

        {/* Hero Section */}
        <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          {/* Imagem de fundo */}
          <img src={bgll} alt="fundo" className="absolute inset-0 w-full h-full object-cover" />


          {/* Overlay leve (pode ajustar 30 → 20/40) */}
          <div className="absolute inset-0 bg-black/30 -z-0" />

          {/* Conteúdo */}
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Assistência Técnica Especializada em Celulares
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-6 mx-auto drop-shadow">
              <Typewriter
                words={[
                  "Troca de tela, bateria, microfone...",
                  "Reparos em placas com qualidade.",
                  "Assistência técnica de confiança.",
                ]}
                loop={0} // 0 = infinito
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </p>
            <button className="bg-accent text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-500 transition">
              Solicitar Atendimento
            </button>
          </div>
        </section>



        {/* Serviços */}
        <section className="bg-white text-gray-900 py-16 px-6">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Alguns de Nossos Serviços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { nome: "Troca de Tela", img: CelularQuebrado },
              { nome: "Bateria", img: Bateria },
              { nome: "Reparos em Placas", img: SmartphoneQuebrado },
              { nome: "Conector de Carga", img: conector },
              { nome: "Face ID", img: faceid },
              { nome: "Câmeras", img: camera },
            ].map((servico, i) => (
              <div
                key={i}
                className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center"
              >
                {servico.img && (
                  <img
                    src={servico.img}
                    alt={servico.nome}
                    className="w-16 h-16 mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold text-center">
                  {servico.nome}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-16 px-6 bg-primary text-white">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher a Luiz Tec PG?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
            {[
              {
                title: "Prontidão",
                desc: "Atendimento rápido via WhatsApp.",
              },
              {
                title: "Qualidade",
                desc: "Peças testadas e aprovadas.",
              },
              {
                title: "Técnicos Formados",
                desc: "Profissionais certificados e qualificados.",
              },
            ].map((d, i) => (
              <div
                key={i}
                className="bg-white text-primary p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-bold mb-2">{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marcas */}
        <section className="bg-white py-16 px-6">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Marcas que atendemos
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {[SamsungLogo, XiaomiLogo, MotorolaLogo, AppleLogo, LGLogo, RealmeLogo,InfinixLogo].map(
              (logo, i) => (
                <div
                  key={i}
                  className="w-28 h-28 bg-gray-100 flex items-center justify-center rounded-lg shadow"
                >
                  <img src={logo} alt="marca" className="max-h-16" />
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-background py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Precisa consertar seu celular?
          </h2>
          <a
            href="https://wa.me/5599999999999"
            target="_blank"
            className="bg-accent text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-500 transition"
          >
            Fale conosco no WhatsApp
          </a>
        </section>
      </div>
    </>
  );
}
