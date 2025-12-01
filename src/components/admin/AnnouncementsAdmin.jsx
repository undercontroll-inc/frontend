import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import SideBar from "../shared/SideBar";
import PageContainer from "../shared/PageContainer";
import Button from "../shared/Button";
import Input from "../shared/Input";
import { useToast } from "../../contexts/ToastContext";
import { announcementService } from "../../services/AnnouncementService";
import {
  ANNOUNCEMENT_TYPES,
  getAnnouncementLabel,
  getAnnouncementStyles,
  getAnnouncementTypeOptions,
} from "../../utils/announcementUtils";

const AnnouncementsAdmin = () => {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: ANNOUNCEMENT_TYPES.PROMOTIONS,
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  // Carregar anúncios do backend
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAllAnnouncements(0, 100);
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
      toast.error("Erro ao carregar anúncios");
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

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        type: announcement.type,
        title: announcement.title,
        content: announcement.content,
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        type: ANNOUNCEMENT_TYPES.PROMOTIONS,
        title: "",
        content: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setFormData({
      type: ANNOUNCEMENT_TYPES.PROMOTIONS,
      title: "",
      content: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpar erro do campo ao digitar/alterar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Limpar erro de destino ao marcar checkbox
    if (type === "checkbox" && errors.destination) {
      setErrors((prev) => ({ ...prev, destination: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetar erros
    const newErrors = {
      title: "",
      content: "",
      destination: "",
    };

    // Validar campos
    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Descrição é obrigatória";
    }

    // Se houver erros, mostrar e não prosseguir
    if (newErrors.title || newErrors.content) {
      setErrors(newErrors);
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);

      if (editingAnnouncement) {
        // Editar anúncio existente
        await announcementService.updateAnnouncement(
          editingAnnouncement.id,
          formData.title,
          formData.content,
          formData.type
        );
        toast.success("Recado atualizado com sucesso!");
      } else {
        // Criar novo anúncio
        await announcementService.publishAnnouncement(
          formData.title,
          formData.content,
          formData.type
        );
        toast.success("Recado criado com sucesso!");
      }

      // Recarregar lista de anúncios
      await loadAnnouncements();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar anúncio:", error);
      toast.error("Erro ao salvar anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este recado?")) {
      try {
        setLoading(true);
        await announcementService.deleteAnnouncement(id);
        toast.success("Recado excluído com sucesso!");

        // Recarregar lista de anúncios
        await loadAnnouncements();
      } catch (error) {
        console.error("Erro ao excluir anúncio:", error);
        toast.error("Erro ao excluir anúncio. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <SideBar active="announcements" />
        <div className="flex-1 flex flex-col overflow-hidden ml-[280px]">
          <div className="p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Gerenciar Recados
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Crie e gerencie recados para a central
                </p>
              </div>
              <Button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Novo Recado
              </Button>
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

            {/* Lista de Anúncios */}
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(announcement)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleDelete(announcement.id)}
                              className="p-2 bg-white/10 hover:bg-red-500/50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
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

        {/* Modal */}
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCloseModal();
                }
              }}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-modal-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {editingAnnouncement ? "Editar Recado" : "Novo Recado"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tipo *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        {getAnnouncementTypeOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Ex: Funcionamento no Feriado"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.title
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                          }`}
                        required
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Descrição *
                      </label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Descreva o recado..."
                        rows={5}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none ${errors.content
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                          }`}
                        required
                      />
                      {errors.content && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.content}
                        </p>
                      )}
                    </div>
                  </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Salvando..." : editingAnnouncement ? "Salvar Alterações" : "Criar Recado"}
                  </Button>
                </div>
              </div>
            </div>

            <style>{`
            @keyframes modal-in {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-modal-in {
              animation: modal-in 0.2s ease-out;
            }
          `}</style>
          </>
        )}
      </div>
    </>
  );
};

export default AnnouncementsAdmin;
