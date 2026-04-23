import { useState, useEffect, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import SideBar from "../shared/SideBar";
import Select from "../shared/Select";
import Input from "../shared/Input";
import { announcementService } from "../../services/AnnouncementService";
import {
  getAnnouncementLabel,
  getAnnouncementStyles,
  getAnnouncementTypeOptions,
} from "../../utils/announcementUtils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../shared/pagination";

const PAGE_SIZE = 5;

const AnnouncementsCustomer = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadAnnouncements = useCallback(async () => {
    try {
      const type = categoryFilter !== "Todos" ? categoryFilter : null;
      const data = await announcementService.getAllAnnouncements(currentPage - 1, PAGE_SIZE, type);
      setAnnouncements(data.announcements || []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
    }
  }, [currentPage, categoryFilter]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const filteredAnnouncements = useMemo(() => {
    if (!searchTerm.trim()) return announcements;
    const q = searchTerm.toLowerCase();
    return announcements.filter(
      (ann) =>
        ann.title.toLowerCase().includes(q) ||
        ann.content.toLowerCase().includes(q),
    );
  }, [announcements, searchTerm]);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("ellipsis-left");
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis-right");
    pages.push(totalPages);
    return pages;
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SideBar active="customer-announcements" />
      <div className="flex-1 flex flex-col overflow-hidden ml-[280px]">
        <div className="py-8 px-20 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Central de Recados
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Novidades, promoções e dicas para você
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar recados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                />
              </div>
              <Select value={categoryFilter} onChange={handleCategoryChange}>
                <option value="Todos">Todos os tipos</option>
                {getAnnouncementTypeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {(searchTerm || categoryFilter !== "Todos") && (
              <div className="mt-4">
                <button
                  onClick={() => { setSearchTerm(""); setCategoryFilter("Todos"); setCurrentPage(1); }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          {/* Lista de Recados */}
          <div className="space-y-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => {
                const styles = getAnnouncementStyles(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className={`bg-gradient-to-br ${styles.bg} rounded-xl shadow-lg overflow-hidden border-2 ${styles.border} transition-all duration-300`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`${styles.badge} px-3 py-1 rounded-full text-sm font-semibold`}>
                            {getAnnouncementLabel(announcement.type)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(announcement.publishedAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{announcement.title}</h2>
                      <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum recado encontrado</p>
              </div>
            )}
          </div>

          {/* Footer: counter + pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalElements === 0
                ? "Nenhum recado encontrado"
                : `Página ${currentPage} de ${totalPages} — ${totalElements} recados no total`}
            </p>

            {totalPages > 0 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((p) => p - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page) =>
                    page === "ellipsis-left" || page === "ellipsis-right" ? (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsCustomer;
