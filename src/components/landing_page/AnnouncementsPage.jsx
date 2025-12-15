import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import LogoNavbar from "../../../public/images/logo_pelluci_navbar.png";
import { announcementService } from "../../services/AnnouncementService";
import {
  getAnnouncementLabel,
  getAnnouncementStyles,
  getAnnouncementTypeOptions,
} from "../../utils/announcementUtils";

export const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [announcements, setAnnouncements] = useState([]);

  // Carregar anúncios do localStorage
  useEffect(() => {
    getAllAnnouncements();
  }, [currentPage, itemsPerPage]);

  // Filtrar anúncios por tipo e apenas os marcados para visitantes
  const filteredAnnouncements = useMemo(() => {
    // Filtrar apenas anúncios marcados para visitantes
    const visitorAnnouncements = announcements ?? [].filter(
      (ann) => ann.forVisitors !== false
    );

    if (categoryFilter === "Todos") {
      return visitorAnnouncements;
    }
    return visitorAnnouncements.filter(
      (ann) => ann.type === categoryFilter
    );
  }, [categoryFilter, announcements]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(
    startIndex,
    endIndex
  );

  const getAllAnnouncements = async () => {
    const response = await announcementService.getAllAnnouncements(
      currentPage - 1,
      itemsPerPage
    );
    setAnnouncements(response);
  }

  // Resetar para página 1 quando mudar filtro ou itens por página
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
      {/* Header/Navbar */}
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
                href="/#services"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Nossos Serviços
              </a>
            </li>
            <li>
              <a
                href="/#faq"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Perguntas Frequentes
              </a>
            </li>
            <li>
              <a
                href="/#about"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Quem Somos
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Fale Conosco
              </a>
            </li>
            <li>
              <a
                href="/#announcements"
                className="link-underline-animation transition-colors duration-3000 font-medium"
              >
                Central de Recados
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
            className="bg-gradient-to-r from-[#ba5c00] to-[#d45012] text-white px-3 py-1 rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer font-medium shadow-lg"
          >
            Crie sua conta
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20 px-4 sm:px-8">
        {/* Botão Voltar */}
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                const announcementsSection = document.querySelector('.announcements-section');
                if (announcementsSection) {
                  announcementsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="mt-8 mb-6 flex items-center gap-2 text-[#041A2D] hover:text-[#0B4BCC] transition-colors duration-300 font-medium group cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Voltar para página inicial
          </button>
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold bg-[#041A2D] bg-clip-text text-transparent mb-2 leading-tight pb-1">
              Central de Recados
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe todas as novidades, feriados e promoções
            </p>
          </div>

          {/* Filtros e Controles */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Filtro de Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filtrar por tipo:
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none transition-all cursor-pointer appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option value="Todos">Todos</option>
                  {getAnnouncementTypeOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Itens por Página */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recados por página:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none transition-all cursor-pointer appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {/* Informações */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Mostrando{" "}
                <span className="font-semibold">{startIndex + 1}</span> a{" "}
                <span className="font-semibold">
                  {Math.min(endIndex, filteredAnnouncements.length)}
                </span>{" "}
                de{" "}
                <span className="font-semibold">
                  {filteredAnnouncements.length}
                </span>{" "}
                recado(s)
              </p>
            </div>
          </div>

          {/* Lista de Anúncios */}
          <div className="space-y-6">
            {currentAnnouncements.length > 0 ? (
              currentAnnouncements.map((announcement) => {
                const styles = getAnnouncementStyles(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className={`bg-gradient-to-br ${styles.bg} rounded-xl shadow-lg overflow-hidden border-2 ${styles.border} hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`${styles.badge} px-3 py-1 rounded-full text-sm font-semibold`}
                        >
                          {getAnnouncementLabel(announcement.type)}
                        </span>
                        <span className="text-gray-300 text-sm">
                          {new Date(announcement.publishedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                        {announcement.title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
                <p className="text-gray-500 text-lg">
                  Nenhum recado encontrado para os filtros selecionados.
                </p>
              </div>
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B4BCC] text-white rounded-lg hover:bg-[#0a3fa0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5" />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                        currentPage === page
                          ? "bg-[#041A2D] text-white scale-110"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:scale-105"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B4BCC] text-white rounded-lg hover:bg-[#0a3fa0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:scale-105"
              >
                Próxima
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
