import { useState, useEffect } from 'react';
import { X, Edit2, Save, Trash2 } from 'lucide-react';
import Button from '../shared/Button';
import Select from '../shared/Select';
import RepairService from '../../services/RepairService';
import { useToast } from '../../contexts/ToastContext';

export const OrderDetailModal = ({ isOpen, onClose, repair, client, onUpdate }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para edição
  const [editedRepair, setEditedRepair] = useState(null);

  // Atualiza os dados quando o repair mudar
  useEffect(() => {
    if (repair) {
      setEditedRepair({
        ...repair,
        appliances: Array.isArray(repair.appliances) ? [...repair.appliances] : [],
        parts: Array.isArray(repair.parts) ? [...repair.parts] : []
      });
    }
  }, [repair]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reseta o modo de edição ao fechar
      setIsEditing(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStatusChange = (newStatus) => {
    setEditedRepair(prev => ({ ...prev, status: newStatus }));
  };

  const handleRemoveAppliance = (index) => {
    setEditedRepair(prev => ({
      ...prev,
      appliances: prev.appliances.filter((_, i) => i !== index)
    }));
  };

  const handleRemovePart = (index) => {
    setEditedRepair(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Prepara os dados para envio
      const dataToUpdate = {
        status: editedRepair.status,
        appliances: editedRepair.appliances,
        parts: editedRepair.parts
      };

      await RepairService.patchRepair(repair.id, dataToUpdate);
      
      toast.success('Ordem de serviço atualizada com sucesso!');
      setIsEditing(false);
      
      // Atualiza a lista na página principal
      if (onUpdate) {
        await onUpdate();
      }
      
      // Fecha o modal após salvar
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Erro ao atualizar ordem de serviço:', error);
      toast.error('Erro ao atualizar ordem de serviço');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Restaura os dados originais
    setEditedRepair({
      ...repair,
      appliances: Array.isArray(repair.appliances) ? [...repair.appliances] : [],
      parts: Array.isArray(repair.parts) ? [...repair.parts] : []
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  if (!isOpen || !repair || !editedRepair) return null;

  // Calcula totais
  const partsTotal = repair.partsTotal || 0;
  const laborValue = repair.laborValue || 0;
  const discount = repair.discount || 0;
  const totalValue = repair.totalValue || (partsTotal + laborValue - discount);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-modal-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                Ordem de Serviço #{repair.id}
              </h2>
              {isEditing && (
                <span className="text-sm bg-blue-500 px-3 py-1 rounded">
                  Modo de Edição
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {/* Status */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Status da Ordem</h3>
              {isEditing ? (
                <Select
                  value={editedRepair.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="max-w-xs"
                >
                  <option value="NAO_INICIADO">Não Iniciado</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="CANCELADO">Cancelado</option>
                </Select>
              ) : (
                <span className={`inline-flex items-center px-3 py-2 rounded-lg font-medium ${
                  editedRepair.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
                  editedRepair.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800' :
                  editedRepair.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {editedRepair.status === 'NAO_INICIADO' ? 'Não Iniciado' :
                   editedRepair.status === 'EM_ANDAMENTO' ? 'Em Andamento' :
                   editedRepair.status === 'FINALIZADO' ? 'Finalizado' :
                   editedRepair.status === 'CANCELADO' ? 'Cancelado' : editedRepair.status}
                </span>
              )}
            </div>

            {/* Dados do Cliente */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dados do Cliente</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Nome</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client?.name || repair.clientName || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">CPF</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client?.cpf || repair.clientCPF || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Telefone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client?.phone || repair.clientPhone || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client?.email || repair.clientEmail || 'Não informado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações da OS */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações da OS</h3>

              {/* Eletrodomésticos */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Eletrodomésticos</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#041A2D] text-white">
                        {isEditing && <th className="px-4 py-2 text-center font-semibold w-12">Ação</th>}
                        <th className="px-4 py-2 text-left font-semibold">Eletrodoméstico</th>
                        <th className="px-4 py-2 text-left font-semibold">Marca / Modelo</th>
                        <th className="px-4 py-2 text-left font-semibold">Voltagem</th>
                        <th className="px-4 py-2 text-left font-semibold">Número de Série</th>
                        <th className="px-4 py-2 text-left font-semibold">Mão-de-Obra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {editedRepair.appliances && Array.isArray(editedRepair.appliances) && editedRepair.appliances.length > 0 ? (
                        editedRepair.appliances.map((appliance, index) => (
                          <tr key={index} className="bg-gray-50">
                            {isEditing && (
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => handleRemoveAppliance(index)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Remover eletrodoméstico"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            )}
                            <td className="px-4 py-2">{appliance.type || 'N/A'}</td>
                            <td className="px-4 py-2">
                              {appliance.brand && appliance.model 
                                ? `${appliance.brand} ${appliance.model}`
                                : appliance.brand || appliance.model || 'N/A'}
                            </td>
                            <td className="px-4 py-2">{appliance.voltage || 'N/A'}</td>
                            <td className="px-4 py-2">{appliance.serial || 'N/A'}</td>
                            <td className="px-4 py-2">
                              {index === 0 ? formatCurrency(laborValue / (editedRepair.appliances.length || 1)) : ''}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-50">
                          <td colSpan={isEditing ? "6" : "5"} className="px-4 py-2 text-center text-gray-500">
                            Nenhum eletrodoméstico registrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Valor Total Mão de Obra */}
                <div className="flex justify-end mt-2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm">
                    Total: {formatCurrency(laborValue)}
                  </div>
                </div>
              </div>

              {/* Peças */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Peças</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#041A2D] text-white">
                        {isEditing && <th className="px-4 py-2 text-center font-semibold w-12">Ação</th>}
                        <th className="px-4 py-2 text-left font-semibold w-12">Q</th>
                        <th className="px-4 py-2 text-left font-semibold">Peças</th>
                        <th className="px-4 py-2 text-left font-semibold">Quantidade</th>
                        <th className="px-4 py-2 text-left font-semibold">Valor Unitário</th>
                        <th className="px-4 py-2 text-left font-semibold">Valor Somado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {editedRepair.parts && Array.isArray(editedRepair.parts) && editedRepair.parts.length > 0 ? (
                        editedRepair.parts.map((part, index) => (
                          <tr key={index} className="bg-white">
                            {isEditing && (
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => handleRemovePart(index)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Remover peça"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            )}
                            <td className="px-4 py-2">
                              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                                Q
                              </div>
                            </td>
                            <td className="px-4 py-2">{part.item || part.name || 'N/A'}</td>
                            <td className="px-4 py-2">{part.quantity || 1}</td>
                            <td className="px-4 py-2">{formatCurrency(part.price || 0)}</td>
                            <td className="px-4 py-2">{formatCurrency(((part.price || 0) * (part.quantity || 0)) || 0)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white">
                          <td colSpan={isEditing ? "6" : "5"} className="px-4 py-2 text-center text-gray-500">
                            Nenhuma peça registrada
                          </td>
                        </tr>
                      )}
                      {/* Linha Total */}
                      {editedRepair.parts && editedRepair.parts.length > 0 && (
                        <tr className="bg-blue-600 text-white font-semibold">
                          {isEditing && <td className="px-4 py-2"></td>}
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2">Total</td>
                          <td className="px-4 py-2">{editedRepair.parts.reduce((sum, part) => sum + (part.quantity || 1), 0)}</td>
                          <td className="px-4 py-2">-</td>
                          <td className="px-4 py-2">{formatCurrency(partsTotal)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Datas e Valores */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Data de Recebimento
                    </label>
                    <input
                      type="text"
                      value={formatDate(repair.receivedAt)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Data de Retirada
                    </label>
                    <input
                      type="text"
                      value={formatDate(repair.deadline)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Garantia
                  </label>
                  <input
                    type="text"
                    value={repair.warranty || 'Não informado'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Desconto (opcional)
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(discount)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Valor Total
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(totalValue)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Observações do Cliente
                </h4>
                <div className="space-y-2 text-sm">
                  {repair.appliances && Array.isArray(repair.appliances) ? (
                    repair.appliances.map((appliance, index) => (
                      appliance.customerNote && (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          <p className="font-medium text-gray-900">Item {index + 1} - {appliance.type}</p>
                          <p className="text-gray-700">{appliance.customerNote}</p>
                        </div>
                      )
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma observação do cliente</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Observações Técnicas (opcional)
                </h4>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 min-h-[100px]">
                  {repair.serviceDescription || repair.notes || 'Nenhuma observação técnica registrada'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
            <Button
              type="button"
              variant="primary"
              onClick={onClose}
            >
              Fechar
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
  );
};

export default OrderDetailModal;
