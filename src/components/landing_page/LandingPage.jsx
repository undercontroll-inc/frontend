import React, { useEffect } from "react";
import {
  ChevronDown,
  Wrench,
  ShieldCheck,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import FAQItem from "./FAQItem";
import Logo from "../../../public/images/logo_pelluci.png";
import Banner from "../../../public/images/banner_image.jpg";
import Foto from "../../../public/images/foto_pelluci.jpg";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("active");
      });
    });
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

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
      <header className="header flex items-center justify-around p-2 bg-gradient-to-r from-[#041A2D] via-[#052540] to-[#041A2D] fixed w-full top-0 z-50 shadow-lg backdrop-blur-md border-b border-white/10">
        <a href="#">
          <img
            src={Logo}
            alt="Logo da irmãos pelluci"
            className="h-14 sm:h-16 transition-transform hover:scale-105 duration-300 rounded-lg shadow-lg"
          />
        </a>
        <nav className="nav text-white hidden lg:block">
          <ul className="flex items-center gap-12">
            <li>
              <a
                href="#about"
                className="link-underline-animation transition-colors duration-300 font-medium"
              >
                Quem somos
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="link-underline-animation transition-colors duration-300 font-medium"
              >
                Nossos Serviços
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="link-underline-animation transition-colors duration-300 font-medium"
              >
                Contato
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="link-underline-animation transition-colors duration-300 font-medium"
              >
                Perguntas Frequentes
              </a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent border-2 border-white text-white px-3 py-1 rounded-lg hover:bg-white hover:text-[#041A2D] transition-all duration-300 cursor-pointer font-medium shadow-md"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-[#BA4610] to-[#d45012] text-white px-3 py-1 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer font-medium shadow-lg"
          >
            Crie sua conta
          </button>
        </div>
      </header>
      <main className="pt-20">
        <section
          className="hero-section relative h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${Banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#041A2D]/80 via-[#041A2D]/70 to-[#BA4610]/30"></div>

          <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
            <h1 className="text-5xl w-full sm:text-6xl lg:text-6xl font-bold mb-10 text-white drop-shadow-2xl">
              Bem-vindo à Comercial Irmãos Pelluci{" "}
            </h1>
            <p className="text-xl sm:text-2xl mb-10 text-white/95 drop-shadow-lg font-light">
              Reparos rápidos e confiáveis para seus eletrodomésticos
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gradient-to-r from-[#0B4BCC] to-[#0B4BCC] hover:from-[#0a3fa0] hover:to-[#0a3fa0] text-white px-8 py-4 mt-2 rounded-xl text-lg font-semibold shadow-2xl hover: transition-all duration-300 cursor-pointer hover:scale-105 border border-white/20"
            >
              Agende uma visita agora!
            </button>
          </div>

          {/* Decoração */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
            <ChevronDown className="h-8 w-8" />
          </div>
        </section>

        {/* Central de Anúncios */}
        <section className="bg-white py-39 px-4 sm:px-8 border-b border-gray-200 mt-[-50px]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#041A2D] to-[#BA4610] bg-clip-text text-transparent mb-2">
                📢 Central de Anúncios
              </h2>
              <p className="text-gray-600 text-lg">
                Fique por dentro das novidades e promoções
              </p>
            </div>

            {/* Anúncio em Destaque */}
            <div className="bg-gradient-to-br from-[#041A2D] to-[#052540] rounded-xl shadow-lg overflow-hidden border-2 border-[#0B4BCC] hover:shadow-xl transition-all duration-300">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#0B4BCC] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Feriados
                  </span>
                  <span className="text-gray-300 text-sm">19 Nov 2025</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Funcionamento no Dia da Consciência Negra
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Informamos que no dia{" "}
                  <span className="font-semibold text-white">
                    20 de novembro (quarta-feira)
                  </span>
                  , feriado nacional, estaremos{" "}
                  <span className="font-semibold text-white">fechados</span>.
                  Retornaremos ao atendimento normal no dia seguinte.
                </p>
                <button
                  onClick={() => navigate("/announcements")}
                  className="w-full sm:w-auto bg-[#0B4BCC] hover:bg-[#0a3fa0] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Ver todos os anúncios
                  <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="about-section p-16 sm:p-20 bg-gradient-to-br from-[#041A2D] via-[#052540] to-[#041A2D] flex flex-col lg:flex-row justify-around items-center gap-12 relative overflow-hidden"
        >
          {/* Decoração de fundo */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-72 h-72 bg-[#BA4610] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#0B4BCC] rounded-full blur-3xl"></div>
          </div>

          <div className="text-content lg:w-1/2 flex flex-col gap-6 text-white relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quem Somos
            </h2>
            <p className="text-lg leading-relaxed text-gray-200">
              A Comercial Irmãos Pelluci atua{" "}
              <span className="font-extrabold">desde 1987</span> em São Paulo,
              oferecendo{" "}
              <span className="font-extrabold">
                conserto de eletrodomésticos
              </span>{" "}
              e{" "}
              <span className="font-extrabold">
                venda de peças e acessórios
              </span>{" "}
              com qualidade e confiança. Nosso compromisso sempre foi entregar
              soluções que unem experiência, eficiência e transparência.
            </p>
            <p className="text-lg leading-relaxed text-gray-200">
              Nosso objetivo é proporcionar tranquilidade, segurança e economia,
              prolongando a vida útil dos aparelhos e evitando gastos
              desnecessários, sempre colocando o cliente em primeiro lugar.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 text-center">
                <div className="text-3xl font-bold">37+</div>
                <div className="text-sm text-gray-300">Anos de história</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 text-center">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-gray-300">Gerações</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-gray-300">
                  Clientes satisfeitos
                </div>
              </div>
            </div>
          </div>

          <div className="image-content lg:w-1/2 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BCC]/30 to-[#BA4610]/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <img
                className="relative rounded-2xl shadow-2xl h-auto w-full object-cover border-4 border-white/10 group-hover:scale-105 transition-transform duration-300"
                src={Foto}
                alt="Comercial Irmãos Pelluci"
              />
            </div>
          </div>
        </section>
        <section
          id="services"
          className="services-section p-16 sm:p-20 flex flex-col justify-around gap-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden"
        >
          {/* Decoração de fundo */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-40 right-40 w-96 h-96 bg-[#0B4BCC] rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 left-40 w-72 h-72 bg-[#BA4610] rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-[#041A2D] to-[#BA4610] bg-clip-text text-transparent leading-tight pb-1">
              Nossos Serviços
            </h2>
          </div>

          <p className="text-lg leading-relaxed text-gray-700 relative z-10">
            Na <b className="text-[#BA4610]">Comercial Irmãos Pelluci</b>,
            acreditamos que cada reparo vai além de uma simples execução técnica
            — é uma oportunidade de entregar
            <b className="text-[#BA4610]"> excelência</b> e{" "}
            <b className="text-[#BA4610]">confiança</b> a cada cliente. Com{" "}
            <b className="text-[#BA4610]">três gerações</b> no comando do
            negócio e mais de três décadas de experiência, unimos tradição a um{" "}
            <b className="text-[#BA4610]">
              atendimento próximo e personalizado
            </b>
            , sempre focado em entender as necessidades antes de propor a
            solução. Trabalhamos com as principais marcas do mercado, utilizamos{" "}
            <b className="text-[#BA4610]">peças originais</b> e oferecemos um
            serviço ágil e acessível, criando relações de confiança que se
            mantêm ao longo dos anos.
          </p>

          <p className="text-lg font-semibold text-gray-800 relative z-10">
            Entre os <b className="text-[#BA4610]">principais serviços</b>,
            destacam-se
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-[#0B4BCC] dark:hover:border-[#0B4BCC] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-[#0B4BCC] to-[#0B4BCC]/80 text-white p-3 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#041A2D] dark:text-gray-100">
                Conserto de eletrodomésticos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Realizamos reparos especializados em diversos tipos de eletrodomésticos com garantia de serviço, peças originais e qualidade comprovada.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-[#BA4610] dark:hover:border-[#BA4610] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-[#BA4610] to-[#BA4610]/80 text-white p-3 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#041A2D] dark:text-gray-100">
                Venda de peças originais
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Comercializamos peças e acessórios originais das principais marcas do mercado, garantindo durabilidade e o melhor desempenho para seu aparelho.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-[#0B4BCC] dark:hover:border-[#0B4BCC] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-[#0B4BCC] to-[#0B4BCC]/80 text-white p-3 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#041A2D] dark:text-gray-100">
                Assistência Técnica
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                <b className="text-[#BA4610]">Aspiradores</b>,{" "}
                <b className="text-[#BA4610]">secadores de cabelo</b>,{" "}
                <b className="text-[#BA4610]">ferros de passar</b>,{" "}
                <b className="text-[#BA4610]">liquidificadores</b>,{" "}
                <b className="text-[#BA4610]">chapinhas</b>,{" "}
                <b className="text-[#BA4610]">micro-ondas</b>,{" "}
                <b className="text-[#BA4610]">máquina de café (Dolce Gusto)</b>,{" "}
                <b className="text-[#BA4610]">ventiladores</b>,{" "}
                <b className="text-[#BA4610]">batedeiras</b>, entre outros
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8 relative z-10">
            <div className="bg-gradient-to-r from-[#041A2D] to-[#041A2D]/90 text-white px-8 py-6 rounded-2xl shadow-2xl border border-white/10">
              <p className="text-lg sm:text-xl font-bold text-center">
                Desde 1987, confiança e qualidade em cada reparo!
              </p>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="flex flex-col justify-center items-center p-16 sm:p-20 gap-8 bg-gradient-to-br from-[#041A2D] via-[#052540] to-[#041A2D] text-white w-full relative overflow-hidden"
        >
          {/* Decoração de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-96 h-96 bg-[#BA4610] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#0B4BCC] rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 w-full">
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Nossos contatos
            </h2>
          </div>

          <div className="main-content flex flex-col lg:flex-row gap-8 w-full max-w-6xl relative z-10">
            <div className="contact-container flex flex-col lg:flex-row gap-8 w-full">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-10 rounded-2xl shadow-2xl border border-gray-200 flex-1">
                <h2 className="font-bold mt-3 mb-10 text-xl text-center text-[#041A2D]">
                  Visite nossa loja e faça um orçamento gratuito!
                </h2>
                <p className="text-[18px] text-gray-800 font-semibold mb-8">
                  Nossos contatos:
                </p>
                <div className="buttons flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={handleWhatsAppClick}
                    className="rounded-xl px-4 py-3 w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer font-semibold text-white hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    Agendar pelo Whatsapp
                  </button>
                  <div className="flex items-center gap-3 my-1">
                    <div className="h-px bg-gray-400 flex-1"></div>
                    <span className="text-gray-700 font-semibold text-sm">
                      Ou
                    </span>
                    <div className="h-px bg-gray-400 flex-1"></div>
                  </div>
                  <button
                    onClick={handleCallClick}
                    className="rounded-xl px-4 py-3 w-full bg-gradient-to-r from-[#0B4BCC] to-[#0952d6] hover:from-[#0a3fa0] hover:to-[#0a3fa0] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer font-semibold text-white hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Ligar agora (11) 2341-7100
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-2xl text-gray-800 border border-gray-200 flex-1">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gradient-to-br from-[#0B4BCC] to-[#0B4BCC]/80 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="font-bold text-xl text-[#041A2D]">
                      Endereço
                    </h2>
                  </div>
                  <p className="text-base ml-11 text-gray-700">
                    Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000
                  </p>
                </div>

                <div className="mt-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gradient-to-br from-[#BA4610] to-[#BA4610]/80 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#041A2D]">
                      Horário de Funcionamento
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3 mt-4 ml-11">
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        Segunda à Sexta
                      </span>
                      <span className="text-[#0B4BCC] font-bold">
                        09:00 - 17:00
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        Sábado
                      </span>
                      <span className="text-[#0B4BCC] font-bold">
                        09:00 - 12:00
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        Domingo
                      </span>
                      <span className="text-red-600 font-bold">Fechado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="faq"
          className="faq-section p-16 sm:p-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-5xl p-2 font-bold mb-4 bg-gradient-to-r from-[#041A2D] to-[#BA4610] bg-clip-text text-transparent">
                Perguntas Frequentes
              </h2>
              <p className="text-gray-600 text-lg">
                Tire suas dúvidas sobre nossos serviços
              </p>
            </div>
            <div className="accordion space-y-4">
              <FAQItem
                question="Como posso realizar um orçamento? O orçamento possui custo?"
                answer={
                  <>
                    Você pode solicitar um orçamento{" "}
                    <span className="text-[#BA4610] font-semibold">
                      gratuito
                    </span>{" "}
                    entrando em contato conosco pelo{" "}
                    <span className="text-[#BA4610] font-semibold">
                      WhatsApp
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      telefone
                    </span>{" "}
                    ou visitando nossa{" "}
                    <span className="text-[#BA4610] font-semibold">loja</span>.
                    Nossa equipe fará uma avaliação inicial{" "}
                    <span className="text-[#BA4610] font-semibold">
                      sem custos
                    </span>{" "}
                    e apresentará o valor do serviço antes de iniciar qualquer
                    reparo.
                  </>
                }
              />
              {/* Validar maquina de cafe */}
              {/* Adicionar faq dizendo que não trabalham com garantia de fabrica */}
              <FAQItem
                question="Quais tipos de eletrodomésticos e marcas vocês atendem?"
                answer={
                  <>
                    Atendemos uma ampla variedade de eletrodomésticos, incluindo{" "}
                    <span className="text-[#BA4610] font-semibold">
                      aspiradores
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      secadores de cabelo
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      ferros de passar
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      liquidificadores
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      chapinhas
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      micro-ondas
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      máquinas de café
                    </span>
                    ,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      ventiladores
                    </span>{" "}
                    e{" "}
                    <span className="text-[#BA4610] font-semibold">
                      batedeiras
                    </span>
                    . Trabalhamos com as{" "}
                    <span className="text-[#BA4610] font-semibold">
                      principais marcas
                    </span>{" "}
                    do mercado e utilizamos{" "}
                    <span className="text-[#BA4610] font-semibold">
                      peças originais
                    </span>{" "}
                    para garantir a qualidade.
                  </>
                }
              />
              <FAQItem
                question="Vocês trabalham com o conserto de geladeiras e fogões (linha branca)?"
                answer={
                  <>
                    Nossa especialidade são{" "}
                    <span className="text-[#BA4610] font-semibold">
                      eletrodomésticos de pequeno porte
                    </span>{" "}
                    e uso doméstico. Por esse motivo,{" "}
                    <span className="text-[#BA4610] font-semibold">
                      não realizamos serviços
                    </span>{" "}
                    para linha branca, como geladeiras, fogões e máquinas de
                    lavar.
                  </>
                }
              />
              <FAQItem
                question="Existe garantia para os serviços realizados?"
                answer={
                  <>
                    <span className="text-[#BA4610] font-semibold">Sim!</span>{" "}
                    Todos os nossos serviços possuem{" "}
                    <span className="text-[#BA4610] font-semibold">
                      garantia
                    </span>
                    . O prazo varia de acordo com o tipo de reparo realizado e
                    será informado no momento da prestação do serviço.
                    Trabalhamos apenas com{" "}
                    <span className="text-[#BA4610] font-semibold">
                      peças originais
                    </span>{" "}
                    para assegurar a{" "}
                    <span className="text-[#BA4610] font-semibold">
                      durabilidade
                    </span>{" "}
                    e{" "}
                    <span className="text-[#BA4610] font-semibold">
                      qualidade
                    </span>{" "}
                    do reparo.
                  </>
                }
              />
              <FAQItem
                question="Consigo acompanhar o andamento do conserto do meu eletrodoméstico?"
                answer={
                  <>
                    <span className="text-[#BA4610] font-semibold">Sim!</span>{" "}
                    Você pode acompanhar o andamento do conserto{" "}
                    <span className="text-[#BA4610] font-semibold">
                      diretamente em nosso site
                    </span>
                    , após realizar um simples{" "}
                    <span className="text-[#BA4610] font-semibold">
                      cadastro
                    </span>
                    . Caso tenha alguma dúvida ou precise de mais informações
                    durante o processo, entre em contato pelos nossos{" "}
                    <span className="text-[#BA4610] font-semibold">
                      meios de comunicação
                    </span>
                    .
                  </>
                }
              />
            </div>
          </div>
        </section>
        <footer className="footer-section bg-gradient-to-br from-[#041A2D] via-[#052540] to-[#041A2D] text-white p-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              {/* Logo e Redes Sociais */}
              <div className="flex flex-col items-center justify-center md:items-start">
                <div className="flex flex-col items-center">
                  <img
                    src={Logo}
                    alt=""
                    className="h-36 rounded-lg shadow-lg justify-self-center"
                  />
                  <div className="flex gap-4 my-4">
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-[#0B4BCC] p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
                    >
                      <i className="fa-brands fa-facebook-f text-lg"></i>
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-[#CF21A4] p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
                    >
                      <i className="fa-brands fa-instagram text-lg"></i>
                    </a>
                    <a
                      onClick={handleWhatsAppClick}
                      href="#"
                      className="bg-white/10 hover:bg-green-500 p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
                    >
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                    </a>
                  </div>
                  <p className="font-semibold text-sm text-gray-300 mt-4">
                    Agende já uma visita
                  </p>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  Contato
                </h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2 hover:text-white transition-colors">
                    <div>
                      <div className="font-semibold text-white text-sm">
                        Telefone
                      </div>
                      <div>(11) 2239-4448</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 hover:text-white transition-colors">
                    <div>
                      <div className="font-semibold text-white text-sm">
                        Whatsapp
                      </div>
                      <div>(11) 99882-3435</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 hover:text-white transition-colors">
                    <div>
                      <div className="font-semibold text-white text-sm">
                        Email
                      </div>
                      <div>comercialirmaopeluci@gmail.com</div>
                    </div>
                  </li>
                </ul>

                <div className="mt-6">
                  <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
                    Endereço
                  </h2>
                  <p className="text-gray-300 hover:text-white transition-colors">
                    Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000
                  </p>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  Links Rápidos
                </h2>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a
                      href="#"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → Início
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → Quem somos?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → Serviços
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → Contatos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → FAQ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 Comercial Irmãos Pelluci. Todos os direitos reservados.
              </p>
            </div>
            {/* aside removed: social icons moved back into footer left column */}
          </div>
        </footer>
      </main>
    </div>
  );
};
