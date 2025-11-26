import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import SideBar from "../shared/SideBar";
import PageContainer from "../shared/PageContainer";
import Button from "../shared/Button";
import Input from "../shared/Input";
import { useToast } from "../../contexts/ToastContext";

const AnnouncementsAdmin = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  const [formData, setFormData] = useState({
    category: "Promoções",
    title: "",
    description: "",
    forVisitors: true,
    forCustomers: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    destination: "",
  });

  // Carregar anúncios do localStorage na inicialização
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem("announcements");
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements));
    } else {
      // Dados iniciais de exemplo
      const initialData = [
        {
          id: 1,
          category: "Promoções",
          title: "🎉 Desconto Especial em Reparos!",
          description:
            "Ganhe 15% de desconto em qualquer reparo agendado até o final do mês. Aproveite para consertar aquele eletrodoméstico que está guardado!",
          date: "2025-11-25",
          categoryColor: "orange",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          category: "Avisos",
          title: "Horário Especial - Final de Ano",
          description:
            "Atenção! Em dezembro nosso horário de atendimento será das 9h às 15h. Planeje-se e agende sua visita com antecedência.",
          date: "2025-11-24",
          categoryColor: "blue",
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          category: "Recomendações",
          title: "Dicas de Manutenção - Aspiradores",
          description:
            "Limpe o filtro do seu aspirador a cada 3 usos para manter a potência de sucção. Troque o saco ou esvazie o reservatório regularmente para evitar problemas.",
          date: "2025-11-23",
          categoryColor: "green",
          createdAt: new Date().toISOString(),
        },
      ];
      setAnnouncements(initialData);
      localStorage.setItem("announcements", JSON.stringify(initialData));
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  const saveToLocalStorage = (data) => {
    localStorage.setItem("announcements", JSON.stringify(data));
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "Todos" || ann.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [announcements, searchTerm, categoryFilter]);

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        category: announcement.category,
        title: announcement.title,
        description: announcement.description,
        forVisitors: announcement.forVisitors ?? true,
        forCustomers: announcement.forCustomers ?? false,
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        category: "Promoções",
        title: "",
        description: "",
        forVisitors: true,
        forCustomers: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setFormData({
      category: "Promoções",
      title: "",
      description: "",
      forVisitors: true,
      forCustomers: false,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Resetar erros
    const newErrors = {
      title: "",
      description: "",
      destination: "",
    };

    // Validar campos
    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!formData.forVisitors && !formData.forCustomers) {
      newErrors.destination = "Selecione pelo menos um destino";
    }

    // Se houver erros, mostrar e não prosseguir
    if (newErrors.title || newErrors.description || newErrors.destination) {
      setErrors(newErrors);
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    let categoryColor = "orange";
    if (formData.category === "Promoções") categoryColor = "orange";
    else if (formData.category === "Avisos") categoryColor = "blue";
    else if (formData.category === "Recomendações") categoryColor = "green";

    const announcementData = {
      ...formData,
      date: new Date().toISOString().split("T")[0],
      categoryColor,
    };

    if (editingAnnouncement) {
      // Editar
      announcementData.id = editingAnnouncement.id;
      announcementData.createdAt = editingAnnouncement.createdAt;

      // SEMPRE manter o recado na tela de admin (announcements)
      // independente de estar marcado para visitantes ou clientes
      const updatedAnnouncements = announcements.map((ann) =>
        ann.id === editingAnnouncement.id ? announcementData : ann
      );
      setAnnouncements(updatedAnnouncements);
      saveToLocalStorage(updatedAnnouncements);

      // Atualizar em customerAnnouncements (clientes)
      const savedCustomerAnnouncements = localStorage.getItem(
        "customerAnnouncements"
      );
      const customerAnnouncements = savedCustomerAnnouncements
        ? JSON.parse(savedCustomerAnnouncements)
        : [];

      if (formData.forCustomers) {
        // Adicionar ou atualizar em customerAnnouncements
        const existsInCustomer = customerAnnouncements.some(
          (ann) => ann.id === editingAnnouncement.id
        );

        if (existsInCustomer) {
          const updatedCustomerAnnouncements = customerAnnouncements.map(
            (ann) =>
              ann.id === editingAnnouncement.id ? announcementData : ann
          );
          localStorage.setItem(
            "customerAnnouncements",
            JSON.stringify(updatedCustomerAnnouncements)
          );
        } else {
          const updatedCustomerAnnouncements = [
            announcementData,
            ...customerAnnouncements,
          ];
          localStorage.setItem(
            "customerAnnouncements",
            JSON.stringify(updatedCustomerAnnouncements)
          );
        }
      } else {
        // Remover de customerAnnouncements se não for mais para clientes
        const updatedCustomerAnnouncements = customerAnnouncements.filter(
          (ann) => ann.id !== editingAnnouncement.id
        );
        localStorage.setItem(
          "customerAnnouncements",
          JSON.stringify(updatedCustomerAnnouncements)
        );
      }

      handleCloseModal();
      toast.success("Recado atualizado com sucesso!");
    } else {
      // Criar novo
      const newAnnouncement = {
        id: Date.now(),
        ...announcementData,
        createdAt: new Date().toISOString(),
      };

      // SEMPRE adicionar na tela de admin (announcements)
      const updatedAnnouncements = [newAnnouncement, ...announcements];
      setAnnouncements(updatedAnnouncements);
      saveToLocalStorage(updatedAnnouncements);

      // Salvar para clientes se marcado
      if (formData.forCustomers) {
        const savedCustomerAnnouncements = localStorage.getItem(
          "customerAnnouncements"
        );
        const customerAnnouncements = savedCustomerAnnouncements
          ? JSON.parse(savedCustomerAnnouncements)
          : [];
        const updatedCustomerAnnouncements = [
          newAnnouncement,
          ...customerAnnouncements,
        ];
        localStorage.setItem(
          "customerAnnouncements",
          JSON.stringify(updatedCustomerAnnouncements)
        );
      }

      handleCloseModal();
      toast.success("Recado criado com sucesso!");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este recado?")) {
      const updatedAnnouncements = announcements.filter((ann) => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      saveToLocalStorage(updatedAnnouncements);
      toast.success("Recado excluído com sucesso!");
    }
  };

  const getCategoryStyles = (color) => {
    if (color === "blue") {
      return {
        bg: "from-[#041A2D] to-[#052540]",
        border: "border-[#0B4BCC]",
        badge: "bg-[#0B4BCC] text-white",
      };
    }
    if (color === "green") {
      return {
        bg: "from-[#047857] to-[#065f46]",
        border: "border-[#10b981]",
        badge: "bg-[#10b981]",
      };
    }
    return {
      bg: "from-[#BA4610] to-[#d45012]",
      border: "border-[#BA4610]",
      badge: "bg-white text-[#BA4610]",
    };
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
                  <option value="Todos">Todas as categorias</option>
                  <option value="Promoções">Promoções</option>
                  <option value="Avisos">Avisos</option>
                  <option value="Recomendações">Recomendações</option>
                </select>
              </div>
            </div>

            {/* Lista de Anúncios */}
            <div className="space-y-4">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => {
                  const styles = getCategoryStyles(announcement.categoryColor);
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
                              {announcement.category}
                            </span>
                            <span className="text-gray-300 text-sm">
                              {new Date(announcement.date).toLocaleDateString(
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
                          {announcement.description}
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
                        Categoria *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="Promoções">Promoções</option>
                        <option value="Avisos">Avisos</option>
                        <option value="Recomendações">Recomendações</option>
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                          errors.title
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
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Descreva o recado..."
                        rows={5}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4BCC] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none ${
                          errors.description
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        required
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Destino do Recado *
                      </label>
                      <div
                        className={`space-y-3 p-3 rounded-lg ${
                          errors.destination
                            ? "border-2 border-red-500 dark:border-red-500"
                            : ""
                        }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="forVisitors"
                            checked={formData.forVisitors}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[#0B4BCC] bg-white border-gray-300 rounded focus:ring-[#0B4BCC] focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Para Visitantes
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="forCustomers"
                            checked={formData.forCustomers}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[#0B4BCC] bg-white border-gray-300 rounded focus:ring-[#0B4BCC] focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Para Clientes
                          </span>
                        </label>
                      </div>
                      {errors.destination && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.destination}
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
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                  >
                    {editingAnnouncement ? "Salvar Alterações" : "Criar Recado"}
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
