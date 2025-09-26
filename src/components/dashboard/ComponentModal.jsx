import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { isEmpty, isPositiveNumber } from '../../utils/validation';

const ComponentModal = ({ isOpen, onClose, component, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    supplier: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!component;

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name || '',
        description: component.description || '',
        brand: component.brand || '',
        price: component.price?.toString() || '',
        supplier: component.supplier || '',
        category: component.category || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        brand: '',
        price: '',
        supplier: '',
        category: ''
      });
    }
    setErrors({});
  }, [component, isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
      case 'description':
      case 'brand':
      case 'supplier':
      case 'category':
        return isEmpty(value) ? 'Este campo é obrigatório' : '';
      case 'price':
        if (isEmpty(value)) return 'Preço é obrigatório';
        if (!isPositiveNumber(value)) return 'O preço deve ser um número positivo';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
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
        price: parseFloat(formData.price)
      };

      await onSave(componentData, component?.id);
      onClose();
    } catch (error) {
      console.error('Error saving component:', error);
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Componente' : 'Novo Componente'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`
                w-full px-5 py-4 border rounded-lg bg-white text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 text-base
                ${errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComponentModal;
