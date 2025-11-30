import React, { useState, useEffect, useMemo } from "react";
import { Search, Megaphone } from "lucide-react";
import SideBar from "../shared/SideBar";
import { announcementService } from "../../services/AnnouncementService";
import {
  getAnnouncementLabel,
  getAnnouncementStyles,
  getAnnouncementTypeOptions,
} from "../../utils/announcementUtils";

const AnnouncementsCustomer = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [loading, setLoading] = useState(false);

  // Carregar anúncios do backend
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAllAnnouncements(0, 100);
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "Todos" || ann.type === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [announcements, searchTerm, categoryFilter]);



  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SideBar active="customer-announcements" />
      <div className="flex-1 flex flex-col overflow-hidden ml-[280px]">
        <div className="p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#0B4BCC] to-[#0952d6] rounded-xl">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Central de Recados
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Novidades, promoções e dicas para você
                </p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 min-w-[350px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar recados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-[250px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex-shrink-0"
              >
                <option value="Todos">Todos os tipos</option>
                {getAnnouncementTypeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Recados */}
          <div className="space-y-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => {
                const styles = getAnnouncementStyles(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className={`bg-gradient-to-br ${styles.bg} rounded-xl shadow-lg overflow-hidden border-2 ${styles.border} transition-all duration-300 hover:shadow-xl`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
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
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Nenhum recado encontrado
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsCustomer;
