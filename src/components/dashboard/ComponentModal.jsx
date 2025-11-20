import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { isEmpty, isPositiveNumber } from "../../utils/validation";

const ComponentModal = ({ isOpen, onClose, component, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    supplier: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!component;

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name || "",
        description: component.description || "",
        brand: component.brand || "",
        price: component.price?.toString() || "",
        supplier: component.supplier || "",
        category: component.category || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        brand: "",
        price: "",
        supplier: "",
        category: "",
      });
    }
    setErrors({});
  }, [component, isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
      case "description":
      case "brand":
      case "supplier":
      case "category":
        return isEmpty(value) ? "Este campo é obrigatório" : "";
      case "price":
        if (isEmpty(value)) return "Preço é obrigatório";
        if (!isPositiveNumber(value))
          return "O preço deve ser um número positivo";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const componentData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await onSave(componentData, component?.id);
      onClose();
    } catch (error) {
      console.error("Error saving component:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full my-8 flex flex-col" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {/* Header Fixo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? "Editar Componente" : "Novo Componente"}
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form - Body Scrollável */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <Input
              label="Nome do Componente *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Digite o nome do componente"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`
                  w-full px-5 py-4 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 text-base
                  ${
                    errors.description
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 dark:border-gray-600 focus:border-slate-500 focus:ring-slate-200"
                  }
                `}
                placeholder="Descreva o componente"
                rows={4}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <Input
              label="Marca *"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              error={errors.brand}
              placeholder="Marca do componente"
              required
            />

            <Input
              label="Preço (R$) *"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              error={errors.price}
              placeholder="0.00"
              required
            />

            <Input
              label="Fornecedor *"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              error={errors.supplier}
              placeholder="Nome do fornecedor"
              required
            />

            <Input
              label="Categoria *"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              error={errors.category}
              placeholder="Categoria do componente"
              required
            />
          </div>

          {/* Footer Fixo */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1"
            >
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentModal;
