import React, { useEffect, useState } from "react";
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
import LogoNavbar from "../../../public/images/logo_pelluci_navbar.png";
import Banner from "../../../public/images/banner_image.jpg";
import Foto from "../../../public/images/foto_pelluci.jpg";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  useEffect(() => {
    const faqItems = document.querySelectorAll(".faq-item");
''    
    const handleClick = (item) => () => {
      item.classList.toggle("active");
    };
    
    const handlers = [];
    
    faqItems.forEach((item) => {
      const handler = handleClick(item);
      handlers.push({ item, handler });
      item.addEventListener("click", handler);
    });

    // Carregar último anúncio do localStorage (apenas os marcados para visitantes)
    const savedAnnouncements = localStorage.getItem("announcements");
    if (savedAnnouncements) {
      const announcements = JSON.parse(savedAnnouncements);
      // Filtrar apenas os marcados para visitantes
      const visitorAnnouncements = announcements.filter(
        (ann) => ann.forVisitors !== false
      );
      if (visitorAnnouncements.length > 0) {
        setLatestAnnouncement(visitorAnnouncements[0]); // Pega o mais recente para visitantes
      }
    }

    // Cleanup: Remove event listeners ao desmontar
    return () => {
      handlers.forEach(({ item, handler }) => {
        item.removeEventListener("click", handler);
      });
    };
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

  const handleFacebookClick = () => {
    const facebookUrl = "https://www.facebook.com/comecialirmaospelluci/?locale=pt_BR";
    window.open(facebookUrl, "_blank");
  }

  const handleInstagramClick = () => {
    const instagramUrl = "https://www.instagram.com/comercial.irmaos.peluci/";
    window.open(instagramUrl, "_blank");
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
      <header className="header flex items-center justify-around p-2 bg-[#041A2D] fixed w-full top-0 z-50 shadow-lg backdrop-blur-md border-b border-white/10">
        <a href="#">
          <img
            src={LogoNavbar}
            alt="Logo da irmãos pelluci"
            className="h-12 sm:h-16 transition-transform hover:scale-105 duration-300 rounded-lg shadow-lg"
          />
        </a>
        <nav className="nav text-white hidden lg:block">
          <ul className="flex items-center gap-12">
            <li>
              <a
                href="#about"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Quem Somos
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Nossos Serviços
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Fale Conosco
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Perguntas Frequentes
              </a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent border-2 border-white text-white px-3 py-1 rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer font-medium shadow-md"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-[#BA4610] to-[#d45012] text-white px-3 py-1 rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer font-medium shadow-lg"
          >
            Crie sua conta
          </button>
        </div>
      </header>
      <main className="pt-20">
        <section
          className="hero-section relative h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-cover overflow-hidden"
          style={{ backgroundImage: `url(${Banner})`, backgroundPosition: 'center top' }}
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
              className="bg-[#0B4BCC] hover:bg-[#0a3fa0] text-white px-8 py-4 mt-2 rounded-xl text-lg font-semibold shadow-2xl hover: transition-all duration-300 cursor-pointer hover:scale-105 border border-white/20"
            >
              Agende uma visita agora!
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
            <ChevronDown className="h-8 w-8" />
          </div>
        </section>

        <section
          id="services"
          className="services-section pt-16 pb-16 px-16 sm:pt-16 sm:pb-20 sm:px-20 flex flex-col justify-around gap-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden"
        >

          <div className="relative z-10 mb-6">
            <h2 className="text-4xl sm:text-5xl font-bold mb-2 bg-[#041A2D] bg-clip-text text-transparent leading-tight pb-1">
              Nossos Serviços
            </h2>
            <p className="text-gray-600 text-lg">
              Qualidade e excelência em cada atendimento
            </p>
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

          <p className="text-lg text-gray-800 relative z-10">
            Entre os <b className="text-[#BA4610]">principais serviços</b>,
            destacam-se:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-[#0B4BCC] dark:hover:border-[#0B4BCC] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-[#0B4BCC] to-[#0B4BCC]/80 text-white p-3 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#041A2D] dark:text-gray-100">
                Conserto de eletrodomésticos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Realizamos reparos especializados em diversos tipos de eletrodomésticos com garantia de serviço, peças originais e qualidade comprovada.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-[#BA4610] dark:hover:border-[#BA4610] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-[#BA4610] to-[#BA4610]/80 text-white p-3 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#041A2D] dark:text-gray-100">
                Venda de peças originais
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Comercializamos peças e acessórios originais das principais marcas do mercado, garantindo durabilidade e o melhor desempenho para seu aparelho.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-[#0B4BCC] dark:hover:border-[#0B4BCC] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-[#0B4BCC] to-[#0B4BCC]/80 text-white p-3 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#041A2D] dark:text-gray-100">
                Assistência Técnica
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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

          <div className="flex justify-center mt-12 relative z-10">
            <p className="text-xl sm:text-2xl font-bold text-center bg-[#041A2D] bg-clip-text text-transparent">
              Desde 1987, confiança e qualidade em cada reparo!
            </p>
          </div>
        </section>

        <section
          id="faq"
          className="faq-section p-16 sm:p-20 bg-[#041A2D] relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight pb-1">
                Perguntas Frequentes
              </h2>
              <p className="text-gray-300 text-lg">
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

        <section
          id="about"
          className="about-section p-16 sm:p-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex flex-col lg:flex-row justify-around items-center gap-12 relative overflow-hidden"
        >

          <div className="text-content lg:w-1/2 flex flex-col gap-6 relative z-10">
            <div className="mb-6">
              <h2 className="text-4xl sm:text-5xl font-bold mb-2 bg-[#041A2D] bg-clip-text text-transparent leading-tight pb-1">
                Quem Somos
              </h2>
              <p className="text-gray-600 text-lg">
                Tradição, qualidade e confiança
              </p>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              A Comercial Irmãos Pelluci atua{" "}
              <span className="font-extrabold text-[#041A2D]">desde 1987</span> em São Paulo,
              oferecendo{" "}
              <span className="font-extrabold text-[#041A2D]">
                conserto de eletrodomésticos
              </span>{" "}
              e{" "}
              <span className="font-extrabold text-[#041A2D]">
                venda de peças e acessórios
              </span>{" "}
              com qualidade e confiança. Nosso compromisso sempre foi entregar
              soluções que unem experiência, eficiência e transparência.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Nosso objetivo é proporcionar tranquilidade, segurança e economia,
              prolongando a vida útil dos aparelhos e evitando gastos
              desnecessários, sempre colocando o cliente em primeiro lugar.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="relative bg-gradient-to-br from-[#041A2D] to-[#052540] border border-[#0B4BCC]/30 p-6 rounded-xl shadow-lg text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#0B4BCC] group overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">37+</div>
                  <div className="text-sm text-gray-300 font-medium">Anos de história</div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-[#041A2D] to-[#052540] border border-[#0B4BCC]/30 p-6 rounded-xl shadow-lg text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#0B4BCC] group overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">3</div>
                  <div className="text-sm text-gray-300 font-medium">Gerações</div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-[#041A2D] to-[#052540] border border-[#0B4BCC]/30 p-6 rounded-xl shadow-lg text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#0B4BCC] group overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">10.000+</div>
                  <div className="text-sm text-gray-300 font-medium">
                    Clientes satisfeitos
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="image-content lg:w-1/2 relative z-10 flex justify-center">
            <div className="relative group w-[80%]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B4BCC]/30 to-[#BA4610]/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img
                className="relative rounded-2xl shadow-2xl max-h-[700px] w-full object-cover border-4 border-gray-200 group-hover:scale-105 transition-transform duration-500"
                src={Foto}
                alt="Comercial Irmãos Pelluci"
              />
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="flex flex-col justify-center items-center p-16 sm:p-20 gap-8 bg-[#041A2D] text-white w-full relative overflow-hidden"
        >

          <div className="relative z-10 w-full mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight pb-1">
              Fale Conosco
            </h2>
            <p className="text-gray-300 text-lg">
              Entre em contato e agende sua visita técnica
            </p>
          </div>

          <div className="main-content flex flex-col lg:flex-row gap-8 w-full max-w-[77rem] relative z-10 my-6">
            <div className="contact-container flex flex-col lg:flex-row gap-12 w-full">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-10 rounded-2xl shadow-2xl border border-gray-200 lg:w-[48%]">
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
                  <div className="flex items-center gap-3 my-2">
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

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-2xl text-gray-800 border border-gray-200 lg:w-[48%]">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-br from-[#0B4BCC] to-[#0B4BCC]/80 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="font-bold text-xl text-[#041A2D]">
                      Endereço
                    </h2>
                  </div>
                  <p className="text-base text-gray-700">
                    Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000
                  </p>
                </div>

                <div className="mt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-br from-[#BA4610] to-[#BA4610]/80 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#041A2D]">
                      Horário de Funcionamento
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
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

        <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-8 min-h-[750px]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-2 bg-[#041A2D] bg-clip-text text-transparent leading-tight pb-1">
                Central de Recados
              </h2>
              <p className="text-gray-600 text-lg">
                Fique por dentro das novidades e promoções
              </p>
            </div>

            {/* Anúncio em Destaque */}
            <div className="bg-[#052540] rounded-xl shadow-lg overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
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
                  className="w-full sm:w-auto bg-[#0B4BCC] text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Ver todos os anúncios
                  <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer-section bg-[#041A2D] text-white p-16 border-t border-white/10 items-center">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-44 mb-8">
              <div className="flex flex-col items-center gap-6 my-4">
                <img
                  src={Logo}
                  alt=""
                  className="h-18 rounded-sm shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
                />
                <div className="flex gap-3">
                  <a
                    onClick={handleFacebookClick}
                    className="bg-white/10 hover:bg-[#0B4BCC] p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 cursor-pointer"
                  >
                    <i className="fa-brands fa-facebook-f text-lg"></i>
                  </a>
                  <a
                    onClick={handleInstagramClick}
                    className="bg-white/10 hover:bg-[#CF21A4] p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 cursor-pointer"
                  >
                    <i className="fa-brands fa-instagram text-lg"></i>
                  </a>
                  <a
                    onClick={handleWhatsAppClick}
                    className="bg-white/10 hover:bg-green-500 p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 cursor-pointer"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                  </a>
                </div>
                <p className="font-semibold text-sm text-gray-300 text-center md:text-left">
                  Agende já uma visita!
                </p>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-4">
                  Contato e Localização
                </h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="hover:text-white transition-colors">
                    <div className="font-semibold text-white text-sm">
                      Telefone
                    </div>
                    <div>(11) 2239-4448</div>
                  </li>
                  {/* <li className="hover:text-white transition-colors">
                    <div className="font-semibold text-white text-sm">
                      Whatsapp
                    </div>
                    <div>(11) 99882-3435</div>
                  </li> */}
                  <li className="hover:text-white transition-colors">
                    <div className="font-semibold text-white text-sm">
                      Email
                    </div>
                    <div>comercialirmaopeluci@gmail.com</div>
                  </li>
                </ul>

                <div className="mt-6">
                  <h2 className="font-bold text-sm mb-2">
                    Endereço
                  </h2>
                  <p className="text-gray-300 hover:text-white transition-colors">
                    Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-4">
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
                      → Quem Somos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → Nossos Serviços
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → Fale Conosco
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:font-bold hover:text-base transition-all hover:translate-x-1 inline-block duration-300"
                    >
                      → Perguntas Frequentes
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
          </div>
        </footer>
      </main>
    </div>
  );
};
