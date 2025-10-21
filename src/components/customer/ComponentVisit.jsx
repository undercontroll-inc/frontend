import SideBar from "../shared/SideBar";
import Loading from "../shared/Loading";
import { useState, useEffect } from "react";
import { MessageCircle, Phone, MapPin, Clock, Wrench } from "lucide-react";

const ComponentVisit = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - Visita";

    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => {
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

  const services = [
    "Aspirador",
    "Secador de Cabelo",
    "Ferro de Passar",
    "Liquidificador",
    "Chapinha",
    "Micro-ondas",
    "Máquina de Café (Dolce Gusto)",
    "Ventilador",
    "Batedeira",
  ];

  if (loading) return <Loading text="Carregando visita técnica..." />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideBar active="visita" />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Visita Técnica
            </h1>
            <p className="text-gray-600">
              Agende sua visita ou entre em contato para solicitar um orçamento personalizado
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-br from-[#041A2D] to-[#062E4F] p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Nosso Endereço
                    </h3>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    Av. Zelina, 505 - Vila Zelina
                    <br />
                    São Paulo - SP, 03143-000
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Horário de Atendimento
                    </h3>
                  </div>
                  <div className="text-white/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Segunda - Sexta</span>
                      <span className="text-sm">09:00 - 17:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sábado</span>
                      <span className="text-sm">09:00 - 12:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Domingo</span>
                      <span className="text-sm text-red-300">Fechado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#041A2D]/10 rounded-lg">
                  <Wrench className="h-5 w-5 text-[#041A2D]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Aparelhos que Consertamos
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#041A2D]/20 hover:bg-[#041A2D]/5 transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#041A2D]" />
                    <span className="text-sm text-gray-700 font-medium">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Pronto para agendar?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Entre em contato pelo WhatsApp ou telefone e receba seu orçamento personalizado
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-green-600 hover:bg-green-700 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                aria-label="Agendar pelo WhatsApp"
              >
                <MessageCircle className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>Agendar pelo WhatsApp</span>
              </button>

              <button
                onClick={handleCallClick}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-[#041A2D] hover:bg-[#062E4F] text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                aria-label="Ligar agora"
              >
                <Phone className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>Ligar: (11) 2341-7100</span>
              </button>
            </div>
          </div>

          {/*           <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1">
                  Atendimento Rápido
                </h4>
                <p className="text-sm text-amber-800">
                  Nossa equipe está pronta para atendê-lo e fornecer o melhor serviço de reparo para seus aparelhos.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ComponentVisit;
