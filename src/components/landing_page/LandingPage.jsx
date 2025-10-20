import React, { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FAQItem from "./FAQItem";
import Logo from "../../../public/images/logo_pelluci.jpg";
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

  return (
    <div>
      <header className="header flex items-center justify-around p-4 bg-[#041A2D]">
        <img src={Logo} alt="" />
        <nav className="nav text-white">
          <ul className="flex items-center gap-24">
            <li>
              <a href="#about">Quem somos</a>
            </li>
            <li>
              <a href="#services">Nossos Serviços</a>
            </li>
            <li>
              <a href="#contact">Contato</a>
            </li>
            <li>
              <a href="#faq">Perguntas Frequentes</a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent border border-white text-white px-4 py-2 rounded mr-2 cursor-pointer"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-[#BA4610] text-white px-4 py-2 rounded cursor-pointer"
          >
            Crie sua conta
          </button>
        </div>
      </header>
      <main>
        <section
          className="hero-section h-screen flex flex-col items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${Banner})` }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo à Comercial Irmãos Pelluci!
          </h1>
          <p className="text-xl mb-8">
            Reparos rápidos e confiáveis para seus eletrodomésticos
          </p>
          <button className="bg-[#0B4BCC] text-white px-6 py-3 mt-8 rounded-lg text-lg">
            Agende uma visita agora!
          </button>
        </section>
        <section
          id="about"
          className="about-section p-16 bg-[#041A2D] flex justify-around"
        >
          <div className="text-content w-lg flex flex-col gap-4 text-white">
            <h2 className="text-3xl font-bold mb-6">Quem Somos</h2>
            <p className="text-md">
              A Comercial Irmãos Pelluci atua <b>desde 1987</b> em São Paulo,
              oferecendo <b>conserto de eletrodomésticos</b> e{" "}
              <b>venda de peças e acessórios</b> com qualidade e confiança.
              Nosso compromisso sempre foi entregar soluções que unem
              experiência, eficiência e transparência.
            </p>
            <p className="text-md">
              Nosso objetivo é proporcionar tranquilidade, segurança e economia,
              prolongando a vida útil dos aparelhos e evitando gastos
              desnecessários, sempre colocando o cliente em primeiro lugar.
            </p>
          </div>
          <div className="image-content w-lg">
            <img className="rounded-md h-90 ml-16" src={Foto} alt="" />
          </div>
        </section>
        <section
          id="services"
          className="services-section p-16 flex flex-col justify-around gap-4 pl-30 bg-gray-200"
        >
          <h2 className="text-3xl font-bold mb-6">Nossos Serviços</h2>
          <p>
            Na <b className="text-[#BA4610]">Comercial Irmãos Pelluci</b>,
            acreditamos que cada reparo vai além de uma simples execução técnica
            — é uma oportunidade de entregar
            <b className="text-[#BA4610]">excelência</b> e{" "}
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
          <p>
            Entre os <b className="text-[#BA4610]">principais serviços</b>,
            destacam-se
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>
              <b className="text-[#BA4610]">Conserto</b> de eletrodomésticos
            </li>
            <li>
              <b className="text-[#BA4610]">Venda</b> de peças e acessórios
              originais e de qualidade
            </li>
            <li>
              Assistência em <b className="text-[#BA4610]">aspiradores</b>,{" "}
              <b className="text-[#BA4610]">secadores de cabelo</b>,{" "}
              <b className="text-[#BA4610]">ferros de passar</b>,
              <b className="text-[#BA4610]">liquidificadores</b>,{" "}
              <b className="text-[#BA4610]">chapinhas</b>,{" "}
              <b className="text-[#BA4610]">micro-ondas</b>,
              <b className="text-[#BA4610]">máquina de café (Dolce Gusto)</b>,
              <b className="text-[#BA4610]">ventiladores</b>,{" "}
              <b className="text-[#BA4610]">batedeiras</b>, entre outros
            </li>
          </ul>
          <div className="flex justify-center mt-12">
            <p>
              <b className="text-xl">
                Desde 1987, confiança e qualidade em cada reparo
              </b>
            </p>
          </div>
        </section>
        <section
          id="contact"
          className="flex justify-center items-center p-16 bg-[#041A2D] text-white w-full"
        >
          <div className="contact-container flex gap-30">
            <div className="bg-gray-200 p-8 w-80 rounded-lg mr-16">
              <h2 className="font-bold mb-6 text-lg text-center text-[#041A2D]">
                Visite nossa loja e faça um orçamento gratuito!
              </h2>
              <p className="text-md text-black">Nossos contatos:</p>
              <div className="buttons flex flex-col items-center justify-center gap-3 mt-4">
                <button className="rounded-md px-3 h-12 w-full bg-green-400 shadow-md shadow-gray-400">
                  <i className="fa-brands fa-whatsapp mr-2 text-xl"></i>
                  Agendar pelo Whatsapp
                </button>
                <p className="text-black font-semibold">Ou</p>
                <button className="rounded-md px-3 h-12 w-full bg-[#0B4BCC] shadow-md shadow-gray-400">
                  <i className="fa-solid fa-phone mr-2 text-lg"></i>
                  Ligar agora (11) 2341-7100{" "}
                </button>
              </div>
            </div>
            <div className="bg-gray-200 p-8 rounded-lg w-fit text-black">
              <h2 className="font-bold text-lg mb-1">Endereço</h2>
              <p className="text-md mb-6">
                Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000
              </p>

              <h2 className="text-lg font-bold mt-16">Horário de Funcionamento</h2>
              <div className="flex flex-col gap-2 mt-3 text-md">
                <div className="flex gap-8">
                  <ul className="font-medium flex flex-col gap-1">
                    <li>Segunda à Sexta</li>
                    <li>Sábado</li>
                    <li>Domingo</li>
                  </ul>
                  <ul className="flex flex-col gap-1">
                    <li>09:00 - 17:00</li>
                    <li>09:00 - 12:00</li>
                    <li>Fechado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="faq-section p-16 bg-gray-200 px-40">
          <h2 className="text-3xl font-bold mb-6">Perguntas Frequentes</h2>
          <div className="accordion mb-8">
            <FAQItem
              question="Como posso realizar um orçamento? O orçamento possui custo?"
              answer="Resposta 1"
            />
            <FAQItem
              question="Quais tipos de eletrodomésticos e marcas vocês atendem?"
              answer="Resposta 1"
            />
            <FAQItem
              question="Vocês trabalham com o conserto de geladeiras e fogões (linha branca)?"
              answer="Resposta 1"
            />
            <FAQItem
              question="Existe garantia para os serviços realizados?"
              answer="Resposta 1"
            />
            <FAQItem
              question="Consigo acompanhar o andamento do conserto do meu eletrodoméstico?"
              answer="Resposta 1"
            />
          </div>
        </section>
        <footer className="footer-section bg-[#041A2D] text-white p-16 flex justify-around">
          <div className="footer ">
            <div className="flex flex-col items-center">
              <img src={Logo} alt="" />
              <div className="icons flex gap-2 my-3 text-xl">
                <i className="fa-brands fa-facebook-f"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <p className="font-semibold text-sm">Agende já uma visita</p>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-md">Contato</h2>
            <p>
              <u>Telefone</u>: (11) 2222-3333
            </p>
            <p>
              <u>Whatsapp</u>: (11) 99999-9999
            </p>
            <p>
              <u>Email</u>: 5W2M1@example.com
            </p>

            <h2 className="font-bold mt-5">Endereço</h2>
            <p>Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000</p>
          </div>
          <div>
            <ul className="flex flex-col gap-1 text-base">
              <li>
                <a href="#">Início</a>
              </li>
              <li>
                <a href="#about">Quem somos?</a>
              </li>
              <li>
                <a href="#services">Serviços</a>
              </li>
              <li>
                <a href="#contact">Contatos</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
};
