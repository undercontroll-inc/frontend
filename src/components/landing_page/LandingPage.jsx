import React, { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FAQItem from "./FAQItem";

export const LandingPage = () => {

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
      <header className="header flex items-center justify-around p-4 bg-[#0E1D2A]">
        <img src="https://placehold.co/100x50" alt="" />
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
          <button className="bg-transparent border border-white text-white px-4 py-2 rounded mr-2">
            Entrar
          </button>
          <button className="bg-white text-[#0E1D2A] px-4 py-2 rounded">
            Registrar
          </button>
        </div>
      </header>
      <main>
        <section
          className="hero-section h-screen flex flex-col items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/1200x800')" }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo ao Nosso Serviço de Reparos
          </h1>
          <p className="text-xl mb-8">
            Reparos rápidos e confiáveis para todos os seus dispositivos
          </p>
          <button className="bg-[#0B4BCC] text-white px-6 py-3 mt-8 rounded-lg text-lg">
            Agende uma visita agora!
          </button>
        </section>
        <section
          id="about"
          className="about-section p-16 bg-gray-700 flex justify-around"
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
            <img
              className="rounded-md"
              src="https://placehold.co/600x400"
              alt=""
            />
          </div>
        </section>
        <section
          id="services"
          className="services-section p-16 flex flex-col justify-around gap-4 pl-30 bg-gray-200"
        >
          <h2 className="text-3xl font-bold mb-6">Nossos Serviços</h2>
          <p>
            Na Comercial Irmãos Pelluci, acreditamos que cada reparo vai além de
            uma simples execução técnica — é uma oportunidade de entregar
            excelência e confiança a cada cliente. Com três gerações no comando
            do negócio e mais de três décadas de experiência, unimos tradição a
            um atendimento próximo e personalizado, sempre focado em entender as
            necessidades antes de propor a solução. Trabalhamos com as
            principais marcas do mercado, utilizamos peças originais e
            oferecemos um serviço ágil e acessível, criando relações de
            confiança que se mantêm ao longo dos anos.
          </p>
          <p>Entre os principais serviços, destacam-se</p>
          <ul className="list-disc list-inside mt-4">
            <li>
              <b>Conserto</b> de eletrodomésticos
            </li>
            <li>
              <b>Venda</b> de peças e acessórios originais e de qualidade
            </li>
            <li>
              Assistência em <b>aspiradores</b>, <b>secadores de cabelo</b>,{" "}
              <b>ferros de passar</b>,<b>liquidificadores</b>, <b>chapinhas</b>,{" "}
              <b>micro-ondas</b>,<b>máquina de café (Dolce Gusto)</b>,
              <b>ventiladores</b>, <b>batedeiras</b>, entre outros
            </li>
          </ul>
          <div className="flex justify-center mt-12">
            <p>
              <b>Desde 1987, confiança e qualidade em cada reparo</b>
            </p>
          </div>
        </section>
        <section
          id="contact"
          className="flex justify-center items-center p-16 bg-gray-700 text-white w-full"
        >
          <div className="contact-container flex gap-30">
            <div className="bg-gray-800 p-8 w-80 rounded-lg mr-16">
              <h2 className="font-bold mb-6 text-lg">Faça o seu orçamento!</h2>
              <p className="text-sm">Nossos contatos</p>
              <div className="buttons flex flex-col items-center justify-center gap-3 mt-4">
                <button className="border-4 rounded-md py-1 w-full">
                  Whatsapp <i className="fa-solid fa-phone ml-4 text-lg"></i>
                </button>
                <button className="border-4 rounded-md py-1 w-full">
                  Telefone{" "}
                  <i className="fa-brands fa-whatsapp ml-4 text-xl "></i>
                </button>
                <p>Ou</p>
                <button className="border-4 rounded-md py-1 w-full font-bold">
                  Crie uma conta
                </button>
                <p className="text-sm h-0">Já possui uma conta?</p>
                <a className="text-sm mt-2 font-bold" href="">
                  Faça login
                </a>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg w-fit">
              <h2 className="font-bold text-lg mb-1">Endereço</h2>
              <p className="text-md mb-6">
                Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000
              </p>

              <h2 className="text-lg font-bold">Horário de Funcionamento</h2>
              <div className="flex flex-col gap-2 mt-3 text-md">
                <div className="flex gap-8">
                  <ul className="font-medium flex flex-col gap-1">
                    <li>Segunda-feira</li>
                    <li>Terça-feira</li>
                    <li>Quarta-feira</li>
                    <li>Quinta-feira</li>
                    <li>Sexta-feira</li>
                    <li>Sábado</li>
                    <li>Domingo</li>
                  </ul>
                  <ul className="flex flex-col gap-1">
                    <li>09:00 - 17:00</li>
                    <li>09:00 - 18:00</li>
                    <li>09:00 - 18:00</li>
                    <li>09:00 - 18:00</li>
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
            <FAQItem question="Como posso realizar um orçamento? O orçamento possui custo?" answer="Resposta 1" />
            <FAQItem question="Quais tipos de eletrodomésticos e marcas vocês atendem?" answer="Resposta 1" />
            <FAQItem question="Vocês trabalham com o conserto de geladeiras e fogões (linha branca)?" answer="Resposta 1" />
            <FAQItem question="Existe garantia para os serviços realizados?" answer="Resposta 1" />
            <FAQItem question="Consigo acompanhar o andamento do conserto do meu eletrodoméstico?" answer="Resposta 1" />
          </div>
        </section>
        <footer className="footer-section bg-[#0E1D2A] text-white p-16 flex justify-around">
          <div className="footer ">
            <div className="flex flex-col items-center">
              <img src="https://placehold.co/80x70" alt="" />
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
            <p><u>Telefone</u>: (11) 2222-3333</p>
            <p><u>Whatsapp</u>: (11) 99999-9999</p>
            <p><u>Email</u>: 5W2M1@example.com</p>
            
            <h2 className="font-bold mt-5">Endereço</h2>
            <p>Av. Zelina, 505 - Vila Zelina, São Paulo - SP, 03143-000</p>
          </div>
          <div>
            <ul className="flex flex-col gap-1 text-base">
              <li><a href="#">Início</a></li>
              <li><a href="#">Quem somos?</a></li>
              <li><a href="#">Missão, visão, valores</a></li>
              <li><a href="#">Mais informações</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
};
