import SideBar from "../shared/SideBar";
import Loading from "../shared/Loading";
import { useState, useEffect } from "react";
import { MessageCircle, Phone } from "lucide-react";

const ComponentVisit = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // small simulated load for placeholder
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => {
    // Número do Alexandre
    const phoneNumber = "5511964007420";
    const message = encodeURIComponent(
      "Olá! Gostaria de agendar uma visita técnica."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCallClick = () => {
    const phoneNumber = "+551123417100"; // número exibido no mock
    window.open(`tel:${phoneNumber}`);
  };

  if (loading) return <Loading text="Carregando visita técnica..." />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="visita" />

      <div className="flex-1 p-8 pl-50">
        <div className="max-w-4xl mx-auto  py-15 px-15 ">
          {/* Card superior: Endereço / Horário / Consertamos */}
          <div className="bg-slate-900 text-white rounded-xl p-8 shadow-md h-65 w-180">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Endereço */}
              <div>
                <div className="text-xl font-bold pb-3">Endereço</div>
                <div className="text-white/90 leading-relaxed">
                  Av. Zelina, 505 - Vila Zelina,
                  <br />
                  São Paulo - SP, 03143-000
                </div>
              </div>

              {/* Horário de Funcionamento */}
              <div>
                <div className="text-xl font-bold pb-2">
                  Horário de Funcionamento
                </div>
                <div className="text-white/90 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Segunda à Sexta</span>
                    <span>09:00 - 17:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Sábado</span>
                    <span>09:00 - 12:00</span>
                  </div>
                  <div className="flex items-center gap-38 pb-5">
                    <span className="font-semibold">Domingo</span>
                    <span>Fechado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Linha divisória */}
            <div className="my-6 border-t border-white/30" />

            {/* Consertamos */}
            <div>
              <div className="text-lg font-bold">Consertamos</div>
              <div className="text-white/90 text-center leading-relaxed">
                Aspirador - Secador de Cabelo - Ferro de Passar - Liquidificador
                - Chapinha
                <br />
                Micro-ondas - Máquina de Café (Dolce Gusto) - Ventilador -
                Batedeira
              </div>
            </div>
          </div>

          {/* Texto CTA */}
          <div className="text-center mt-10 pt-10 pb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Agende sua visita técnica pelo WhatsApp ou entre em contato
              <br />
              por telefone para solicitar seu orçamento sob medida.
            </h2>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-colors"
              aria-label="Agendar pelo WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              Agendar pelo WhatsApp
            </button>

            <button
              onClick={handleCallClick}
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-colors"
              aria-label="Ligar agora"
            >
              <Phone className="h-5 w-5" />
              Ligar agora (11) 2341-7100
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentVisit;
