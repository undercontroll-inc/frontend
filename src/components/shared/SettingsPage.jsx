import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Upload,
  Trash2,
  User,
  ChevronRight,
  ChevronLeft,
  UserCircle,
  Palette,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/UserService";
import { cepService } from "../../services/CepService";
import { avatarService } from "../../services/AvatarService";
import { saveUserData } from "../../utils/auth";
import Input from "./Input";
import Button from "./Button";
import { useToast } from "../../contexts/ToastContext";
import Tooltip from "./Tooltip";
import UserDropdown from "./UserDropdown";
import Foto from "../../../public/images/logo_pelluci.jpg";

// Funções de formatação
const formatCPF = (value) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return value;
};

const formatPhone = (value) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    if (numbers.length <= 10) {
      // (11) 1234-5678
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
    } else {
      // (11) 91234-5678
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }
  }
  return value;
};

const unformatValue = (value) => {
  return value ? value.replace(/\D/g, "") : "";
};

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("personal");
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? saved === "true" : true;
  });

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    cpf: "",
    CEP: "",
    address: "",
    addressNumber: "",
    avatarUrl: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [editableFields, setEditableFields] = useState({
    personalInfo: false,
    contacts: false,
    address: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
        cpf: user.cpf || "",
        CEP: user.CEP || "",
        address: user.address || "",
        addressNumber: user.addressNumber || "",
        avatarUrl: user.avatarUrl || user.avatar_url || "",
      });
      setAvatarPreview(user.avatarUrl || user.avatar_url || null);
      setAvatarFile(null);
      setEditableFields({
        personalInfo: false,
        contacts: false,
        address: false,
      });
      setErrors({});
    }
  }, [user]);

  // Otimização: useCallback para funções que não dependem de estado
  const handleToggleSidebar = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", String(newState));
      return newState;
    });
  }, []);

  // Atalho Ctrl+S para toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggleSidebar]);

  const handleAvatarChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validation = avatarService.validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      try {
        const preview = await avatarService.fileToBase64(file);
        setAvatarPreview(preview);
        setAvatarFile(file);
      } catch (error) {
        toast.error("Erro ao processar a imagem");
      }
    },
    [toast]
  );

  const handleRemoveAvatar = useCallback(() => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Aplica formatação para phone
      let formattedValue = value;
      if (name === "phone") {
        formattedValue = formatPhone(value);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleCepChange = useCallback(
    async (e) => {
      const cep = e.target.value;
      handleChange(e);

      const cleanCep = cep.replace(/\D/g, "");

      if (cleanCep.length === 8) {
        setLoadingCep(true);
        const result = await cepService.getAddressByCep(cleanCep);
        setLoadingCep(false);

        if (result.success) {
          setFormData((prev) => ({
            ...prev,
            address: result.data.addressString,
            CEP: result.data.cep,
          }));
          toast.success("Endereço encontrado!");
        } else {
          toast.error(result.error);
        }
      }
    },
    [handleChange, toast]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Remove formatação para validação
    const cleanPhone = unformatValue(formData.phone);
    if (!cleanPhone) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Telefone inválido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.CEP.trim()) {
      newErrors.CEP = "CEP é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.phone, formData.email, formData.CEP]);

  const handleSave = useCallback(() => {
    if (!validateForm()) {
      return;
    }
    setShowConfirmation(true);
  }, [validateForm]);

  const confirmSave = useCallback(async () => {
    setLoading(true);

    try {
      const userId = user?.id || user?.userId || user?._id;

      if (!userId) {
        console.error("User object:", user);
        toast.error("Erro: ID do usuário não encontrado");
        setLoading(false);
        return;
      }

      let avatarUrl = formData.avatarUrl;

      if (avatarFile) {
        toast.info("Fazendo upload da imagem...");

        const uploadResult = await avatarService.uploadAvatar(
          avatarFile,
          userId
        );

        if (uploadResult.success) {
          avatarUrl = uploadResult.url;
        } else {
          console.warn(
            "Upload falhou, usando preview local:",
            uploadResult.error
          );
          avatarUrl = avatarPreview;
        }
      }

      // Remove formatação antes de enviar
      const dataToUpdate = {
        ...formData,
        phone: unformatValue(formData.phone),
        avatarUrl: avatarUrl,
      };

      const result = await userService.updateUser(userId, dataToUpdate);

      if (result.success) {
        const updatedData = {
          ...user,
          ...dataToUpdate,
          avatarUrl: avatarUrl,
          avatar_url: avatarUrl,
        };

        updateUser(updatedData);
        saveUserData(updatedData);

        toast.success("Configurações salvas com sucesso!");
        setShowConfirmation(false);
        navigate(-1);
      } else {
        toast.error(result.error || "Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro inesperado ao salvar configurações");
    } finally {
      setLoading(false);
    }
  }, [user, formData, avatarFile, avatarPreview, toast, updateUser, navigate]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const toggleEdit = useCallback((section) => {
    setEditableFields((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Otimização: useMemo para valores constantes
  const menuItems = useMemo(
    () => [
      {
        id: "personal",
        label: "Dados Pessoais",
        icon: UserCircle,
      },
      {
        id: "theme",
        label: "Tema",
        icon: Palette,
      },
    ],
    []
  );

  // Valores formatados para exibição
  const displayValues = useMemo(
    () => ({
      cpf: formatCPF(formData.cpf),
      phone: formatPhone(formData.phone),
    }),
    [formData.cpf, formData.phone]
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Customizada */}
      <div className="flex relative">
        <aside
          className={`${
            isOpen ? "w-56" : "w-16"
          } text-white border-r bg-[#0a1929] dark:bg-gray-950 border-gray-800 dark:border-gray-800 flex flex-col shadow-lg dark:shadow-gray-900/50 transition-all duration-300 ease-in-out relative`}
        >
          <div className={`p-4 border-b border-gray-800 ${!isOpen && "px-2"}`}>
            <div
              className={`flex items-center ${
                isOpen ? "gap-2" : "justify-center"
              }`}
            >
              <div className="">
                <img width={50} height={50} src={Foto} className="rounded-md" />
              </div>
              {isOpen && (
                <div className="flex-1">
                  <div className="font-bold text-base text-white">Pelluci</div>
                  <div className="text-xs text-gray-400">Sistema OS</div>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-2 flex flex-col space-y-1 overflow-y-auto">
            {isOpen && (
              <div className="px-3 py-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Configurações
                </h2>
              </div>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              const buttonContent = (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    group w-full flex items-center ${
                      isOpen ? "gap-3 px-3" : "justify-center px-2"
                    } py-2 rounded-md text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-[#0B4BCC] text-white"
                        : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
                    }
                  `}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform duration-200"
                    }`}
                  />
                  {isOpen && (
                    <span className="flex-1 text-left text-sm">
                      {item.label}
                    </span>
                  )}
                </button>
              );

              if (!isOpen) {
                return (
                  <Tooltip key={item.id} content={item.label} side="right">
                    {buttonContent}
                  </Tooltip>
                );
              }

              return buttonContent;
            })}
          </nav>

          <div className="p-2 border-t border-gray-800 sticky bottom-0 bg-[#0a1929] dark:bg-gray-950">
            <UserDropdown isOpen={isOpen} />
          </div>
        </aside>

        <div className="flex items-start pt-5 pl-2">
          <Tooltip
            content={isOpen ? "Recolher (Ctrl+S)" : "Expandir (Ctrl+S)"}
            side="right"
          >
            <button
              onClick={handleToggleSidebar}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#041A2D] dark:hover:text-gray-200 transition-all duration-200 hover:shadow-lg"
              aria-label={
                isOpen ? "Recolher menu (Ctrl+S)" : "Expandir menu (Ctrl+S)"
              }
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {activeTab === "personal" ? "Dados Pessoais" : "Tema e Aparência"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeTab === "personal"
                ? "Gerencie suas informações pessoais"
                : "Personalize a aparência do sistema"}
            </p>
          </div>

          {/* Aba Dados Pessoais */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              {/* Seção: Avatar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Foto de Perfil
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-[#041A2D] overflow-hidden ring-4 ring-gray-100 dark:ring-gray-700 flex items-center justify-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    {avatarPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveAvatar}
                        className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadClick}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: 5MB
                </p>
              </div>

              {/* Seção: Nome (Apenas visualização) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Nome
                  </h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    Apenas visualização
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {formData.name} {formData.lastName}
                </p>
              </div>

              {/* Seção: Contatos */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Contatos
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEdit("contacts")}
                  >
                    {editableFields.contacts ? "Cancelar" : "Editar"}
                  </Button>
                </div>
                {!editableFields.contacts ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Telefone
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {displayValues.phone}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {formData.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone
                      </label>
                      <Input
                        type="text"
                        name="phone"
                        placeholder="(11) 91234-5678"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        E-mail
                      </label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Seu e-mail"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Seção: CPF (Apenas visualização) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    CPF
                  </h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    Apenas visualização
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {displayValues.cpf || "Não informado"}
                </p>
              </div>

              {/* Seção: Endereço */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Endereço
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEdit("address")}
                  >
                    {editableFields.address ? "Cancelar" : "Editar"}
                  </Button>
                </div>
                {!editableFields.address ? (
                  <div className="space-y-1">
                    <p className="text-gray-700 dark:text-gray-300">
                      {formData.address}
                      {formData.addressNumber && `, ${formData.addressNumber}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      CEP: {formData.CEP}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CEP{" "}
                        {loadingCep && (
                          <span className="text-xs text-blue-600">
                            (buscando...)
                          </span>
                        )}
                      </label>
                      <Input
                        type="text"
                        name="CEP"
                        placeholder="00000-000"
                        value={formData.CEP}
                        onChange={handleCepChange}
                        error={errors.CEP}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Endereço
                      </label>
                      <Input
                        type="text"
                        name="address"
                        placeholder="Seu endereço"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número
                      </label>
                      <Input
                        type="text"
                        name="addressNumber"
                        placeholder="Número"
                        value={formData.addressNumber}
                        onChange={handleChange}
                        error={errors.addressNumber}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer fixo */}
              <div className="sticky bottom-0 mt-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button type="button" variant="primary" onClick={handleSave}>
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Aba Tema */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              {/* Seção: Tema */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Aparência do Sistema
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  As cores e temas do sistema serão configurados pelo
                  administrador
                </p>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-60 cursor-not-allowed">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Alternar Tema
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Funcionalidade em desenvolvimento
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Sistema
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Preferências de tema
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Em breve você poderá personalizar as cores e temas do
                      sistema de acordo com suas preferências.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão Voltar */}
              <div className="sticky bottom-0 mt-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmation && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[60] transition-opacity" />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6 animate-modal-in">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirmar alterações?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Você tem certeza que deseja salvar as alterações feitas nas suas
                configurações?
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={confirmSave}
                  loading={loading}
                  disabled={loading}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

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
    </div>
  );
};

export default SettingsPage;
