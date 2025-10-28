import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { isEmpty, isPositiveNumber } from "../../utils/validation";

const ItemModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    item: "",
    brand: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!item;

  useEffect(() => {
    if (item) {
      setFormData({
        item: item.item || "",
        brand: item.brand || "",
        category: item.category || "",
        quantity: item.quantity?.toString() || "",
        price: item.price || "",
        supplier: item.supplier || "",
        description: item.description || "",
      });
    } else {
      setFormData({
        item: "",
        brand: "",
        category: "",
        quantity: "",
        price: "",
        supplier: "",
        description: "",
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case "item":
      case "brand":
      case "category":
      case "supplier":
      case "description":
        return isEmpty(value) ? "Este campo é obrigatório" : "";
      case "quantity":
        if (isEmpty(value)) return "Quantidade é obrigatória";
        if (!isPositiveNumber(value) || parseInt(value) < 0)
          return "A quantidade deve ser um número positivo";
        return "";
      case "price":
        if (isEmpty(value)) return "Preço é obrigatório";
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
      // Formatar o preço com R$ se não tiver
      let formattedPrice = formData.price.trim();
      if (!formattedPrice.startsWith('R$')) {
        formattedPrice = `R$ ${formattedPrice}`;
      }

      const itemData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: formattedPrice,
      };

      await onSave(itemData, item?.id);
      onClose();
    } catch (error) {
      console.error("Error saving item:", error);
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
    <div className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Editar Item" : "Cadastrar novo item"}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item */}
            <div className="md:col-span-2">
              <Input
                label="Item *"
                name="item"
                value={formData.item}
                onChange={handleInputChange}
                error={errors.item}
                placeholder="Insira o nome do item"
                required
              />
            </div>

            {/* Marca */}
            <div>
              <Input
                label="Marca *"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                error={errors.brand}
                placeholder="Insira a marca"
                required
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`
                  w-full px-5 py-4 h-10 border rounded-lg bg-white text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 text-base
                  ${
                    errors.category
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-slate-500 focus:ring-slate-200"
                  }
                `}
                required
              >
                <option value="">Selecione a categoria</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Ferramentas">Ferramentas</option>
                <option value="Informática">Informática</option>
                <option value="Peças de Reposição">Peças de Reposição</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-2">{errors.category}</p>
              )}
            </div>

            {/* Quantidade */}
            <div>
              <Input
                label="Quantidade *"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleInputChange}
                error={errors.quantity}
                placeholder="Insira a quantidade"
                required
              />
            </div>

            {/* Preço */}
            <div>
              <Input
                label="Preço (R$) *"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                error={errors.price}
                placeholder="Insira o preço"
                required
              />
            </div>

            {/* Fornecedor */}
            <div>
              <Input
                label="Fornecedor *"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                error={errors.supplier}
                placeholder="Insira o fornecedor"
                required
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`
                  w-full px-5 py-4 border rounded-lg bg-white text-gray-900 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 text-base
                  ${
                    errors.description
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-slate-500 focus:ring-slate-200"
                  }
                `}
                placeholder="Insira uma descrição"
                rows={3}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-2">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500"
            >
              {loading ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
