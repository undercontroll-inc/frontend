import { useState, useEffect, useRef } from "react";
import { X, Pencil, Check, Upload, Trash2, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/UserService";
import { cepService } from "../../services/CepService";
import { avatarService } from "../../services/AvatarService";
import { saveUserData } from "../../utils/auth";
import Input from "./Input";
import Button from "./Button";
import { useToast } from "../../contexts/ToastContext";

export const Settings = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

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
    if (isOpen && user) {
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
      // Reset todas as seções para não editável
      setEditableFields({
        personalInfo: false,
        contacts: false,
        address: false,
      });
      setErrors({});
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleEdit = (section) => {
    setEditableFields((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const startEditSection = (section) => {
    // Se já estiver editando, fecha a edição; senão, abre
    setEditableFields((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const cancelEditSection = (section) => {
    // Restaura os valores originais do usuário
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
        CEP: user.CEP || "",
        address: user.address || "",
        addressNumber: user.addressNumber || "",
      }));
    }
    setEditableFields((prev) => ({
      ...prev,
      [section]: false,
    }));
    setErrors({});
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valida o arquivo usando o serviço
    const validation = avatarService.validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Cria preview da imagem (apenas preview, não salva ainda)
    try {
      const preview = await avatarService.fileToBase64(file);
      setAvatarPreview(preview);
      setAvatarFile(file);
    } catch (error) {
      toast.error("Erro ao processar a imagem");
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value;
    handleChange(e);

    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, "");

    // Se o CEP tem 8 dígitos, busca o endereço
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
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
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSave = async () => {
    setLoading(true);

    try {
      // Obtém o ID do usuário de forma robusta
      const userId = user?.id || user?.userId || user?._id;

      if (!userId) {
        console.error("User object:", user);
        toast.error("Erro: ID do usuário não encontrado");
        setLoading(false);
        return;
      }

      let avatarUrl = formData.avatarUrl;

      // Se houver um novo arquivo de avatar, tenta fazer o upload
      if (avatarFile) {
        toast.info("Fazendo upload da imagem...");

        const uploadResult = await avatarService.uploadAvatar(
          avatarFile,
          userId
        );

        if (uploadResult.success) {
          avatarUrl = uploadResult.url;
        } else {
          // Se o upload falhar, usa o preview local (base64) como fallback
          console.warn(
            "Upload falhou, usando preview local:",
            uploadResult.error
          );
          avatarUrl = avatarPreview;
        }
      }

      // Prepara os dados para atualizar
      const dataToUpdate = {
        ...formData,
        avatarUrl: avatarUrl,
      };

      // Chama a API para atualizar os dados do usuário
      const result = await userService.updateUser(userId, dataToUpdate);

      if (result.success) {
        // Atualiza os dados localmente
        const updatedData = {
          ...user,
          ...dataToUpdate,
          avatarUrl: avatarUrl,
          avatar_url: avatarUrl, // Compatibilidade com possível nome diferente
        };

        // Atualiza no contexto e localStorage (salva a foto aqui)
        updateUser(updatedData);
        saveUserData(updatedData);

        toast.success("Configurações salvas com sucesso!");
        setShowConfirmation(false);
        onClose();
      } else {
        toast.error(result.error || "Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro inesperado ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Principal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-modal-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Configurações
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Seção: Avatar */}
              <div className="flex items-center justify-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#041A2D] overflow-hidden ring-4 ring-gray-100 dark:ring-gray-800 flex items-center justify-center">
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
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Seção: Nome (Apenas visualização) */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Nome
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Apenas visualização
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {formData.name} {formData.lastName}
                  </p>
                </div>
              </div>

              {/* Seção: Contatos */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Contatos
                  </h3>
                  <button
                    type="button"
                    onClick={() => startEditSection("contacts")}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {!editableFields.contacts ? (
                    <>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Telefone:{" "}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {formData.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Email:{" "}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {formData.email}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Telefone
                        </label>
                        <Input
                          type="text"
                          name="phone"
                          placeholder="Seu telefone"
                          value={formData.phone}
                          onChange={handleChange}
                          error={errors.phone}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
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
              </div>

              {/* Seção: CPF (Apenas visualização) */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    CPF
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Apenas visualização
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {formData.cpf || "Não informado"}
                  </p>
                </div>
              </div>

              {/* Seção: Endereço */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Endereço
                  </h3>
                  <button
                    type="button"
                    onClick={() => startEditSection("address")}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="p-4">
                  {!editableFields.address ? (
                    <div className="space-y-1">
                      <p className="text-gray-700 dark:text-gray-300">
                        {formData.address}
                        {formData.addressNumber &&
                          `, ${formData.addressNumber}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        CEP: {formData.CEP}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
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
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
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
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
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
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={handleSave}>
              Salvar
            </Button>
          </div>
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
    </>
  );
};

export default Settings;
