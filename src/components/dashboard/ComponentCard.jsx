import { Edit, Trash2 } from 'lucide-react';
import Button from '../shared/Button';
import { formatCurrency } from '../../utils/validation';

const ComponentCard = ({ component, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o componente "${component.name}"?`)) {
      onDelete(component.id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{component.name}</h3>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {component.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {component.description}
      </p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Marca</span>
          <span className="text-gray-900">{component.brand}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Fornecedor</span>
          <span className="text-gray-900">{component.supplier}</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-2xl font-bold text-green-600 mb-4">
        {formatCurrency(component.price)}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(component)}
          className="flex-1"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          className="flex-1"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default ComponentCard;