import { useState, useEffect } from 'react';
import { X, Edit2, Save, Trash2, Plus } from 'lucide-react';
import Button from '../shared/Button';
import Select from '../shared/Select';
import Input from '../shared/Input';
import RepairService from '../../services/RepairService';
import ComponentService from '../../services/ComponentService';
import { useToast } from '../../contexts/ToastContext';

export const OrderDetailModal = ({ isOpen, onClose, repair, client, onUpdate }) => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [showComponentSelector, setShowComponentSelector] = useState(false);
  
  // Estados para edição
  const [editedRepair, setEditedRepair] = useState(null);
  const [removedItemIds, setRemovedItemIds] = useState([]);

  // Busca componentes (peças) disponíveis quando o modal abre em modo de edição
  useEffect(() => {
    if (isOpen && isEditing) {
      loadAvailableComponents();
    }
  }, [isOpen, isEditing]);

  const loadAvailableComponents = async () => {
    try {
      const components = await ComponentService.getAllComponents();
      setAvailableComponents(components || []);
    } catch (error) {
      console.error('Erro ao carregar componentes:', error);
      toast.error('Erro ao carregar peças disponíveis');
    }
  };

  // Atualiza os dados quando o repair mudar
  useEffect(() => {
    if (repair) {
      setEditedRepair({
        ...repair,
        appliances: Array.isArray(repair.appliances) ? repair.appliances.map(a => ({ ...a })) : [],
        parts: Array.isArray(repair.parts) ? repair.parts.map(p => ({ ...p })) : [],
        serviceDescription: repair.serviceDescription || repair.notes || ''
      });
    }
  }, [repair]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setRemovedItemIds([]); // Limpa lista de itens removidos ao abrir
    } else {
      document.body.style.overflow = 'unset';
      // Reseta o modo de edição ao fechar
      setIsEditing(false);
      setRemovedItemIds([]);
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

  const handleApplianceChange = (index, field, value) => {
    setEditedRepair(prev => ({
      ...prev,
      appliances: prev.appliances.map((app, i) => 
        i === index ? { ...app, [field]: value } : app
      )
    }));
  };

  const handleRemoveAppliance = (index) => {
    setEditedRepair(prev => {
      const applianceToRemove = prev.appliances[index];
      console.log('Removendo appliance:', applianceToRemove);
      
      // Se o item tem ID, adiciona à lista de removidos para deletar depois
      if (applianceToRemove?.id) {
        console.log('Adicionando ID à lista de removidos:', applianceToRemove.id);
        setRemovedItemIds(prevIds => {
          const newIds = [...prevIds, applianceToRemove.id];
          console.log('Lista atualizada de IDs removidos:', newIds);
          return newIds;
        });
      } else {
        console.log('Appliance sem ID (novo item), não será deletado');
      }
      
      return {
        ...prev,
        appliances: prev.appliances.filter((_, i) => i !== index)
      };
    });
  };

  const handlePartChange = (index, value) => {
    setEditedRepair(prev => ({
      ...prev,
      parts: prev.parts.map((part, i) => 
        i === index ? { ...part, quantity: Number(value) || 1 } : part
      )
    }));
  };

  const handleRemovePart = (index) => {
    setEditedRepair(prev => ({
      ...prev,
      parts: prev.parts.map((part, i) => 
        i === index ? { ...part, quantity: 0, _removed: true } : part
      )
    }));
  };

  const handleAddAppliance = () => {
    setEditedRepair(prev => ({
      ...prev,
      appliances: [...prev.appliances, { 
        id: null, 
        type: '', 
        brand: '', 
        model: '', 
        volt: '', 
        series: '', 
        customerNote: '',
        laborValue: 0
      }]
    }));
  };

  const handleAddComponentToParts = (componentId) => {
    const component = availableComponents.find(c => c.id === parseInt(componentId));
    if (!component) return;

    // Verifica se a peça já foi adicionada
    const alreadyAdded = editedRepair.parts.some(p => p.componentId === component.id);
    if (alreadyAdded) {
      toast.error('Esta peça já foi adicionada ao pedido');
      return;
    }

    setEditedRepair(prev => ({
      ...prev,
      parts: [...prev.parts, { 
        id: null,
        componentId: component.id,
        item: component.name || component.type || '',
        quantity: 1,
        price: component.price || 0
      }]
    }));
    
    setShowComponentSelector(false);
    toast.success('Peça adicionada ao pedido');
  };

  const handleServiceDescriptionChange = (value) => {
    setEditedRepair(prev => ({ ...prev, serviceDescription: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Primeiro, deleta os itens removidos (apenas IDs válidos)
      const validRemovedIds = removedItemIds.filter(id => id && id !== null);
      console.log('IDs a serem removidos:', validRemovedIds);
      
      if (validRemovedIds.length > 0) {
        console.log('Deletando items:', validRemovedIds);
        const deletePromises = validRemovedIds.map(itemId => 
          RepairService.deleteOrderItem(itemId)
        );
        await Promise.all(deletePromises);
        console.log('Items deletados com sucesso');
      }
      
      // Prepara os dados para envio com IDs
      const dataToUpdate = {
        status: editedRepair.status,
        appliances: editedRepair.appliances.map(app => ({
          id: app.id || null,
          type: app.type,
          brand: app.brand,
          model: app.model,
          volt: app.volt,
          series: app.series,
          customerNote: app.customerNote,
          laborValue: Number(app.laborValue) || 0
        })),
        parts: editedRepair.parts
          .filter(part => part.id || part.componentId) // Remove partes sem ID válido
          .map(part => ({
            id: part.id || part.componentId || null,
            quantity: part._removed ? 0 : (Number(part.quantity) || 1)
          })),
        serviceDescription: editedRepair.serviceDescription
      };
      
      console.log('Dados a serem enviados no PATCH:', JSON.stringify(dataToUpdate, null, 2));

      // Depois, atualiza a ordem
      await RepairService.patchRepair(repair.id, dataToUpdate);
      
      toast.success('Ordem de serviço atualizada com sucesso!');
      setIsEditing(false);
      setShowComponentSelector(false);
      setRemovedItemIds([]); // Limpa lista de removidos após sucesso
      
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
      appliances: Array.isArray(repair.appliances) ? repair.appliances.map(a => ({ ...a })) : [],
      parts: Array.isArray(repair.parts) ? repair.parts.map(p => ({ ...p })) : [],
      serviceDescription: repair.serviceDescription || repair.notes || ''
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
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-modal-in">
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
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-zinc-950">
            {/* Status */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">Status da Ordem</h3>
              {isEditing ? (
                <Select
                  value={editedRepair.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="max-w-xs"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="COMPLETED">Concluído</option>
                </Select>
              ) : (
                <span className={`inline-flex items-center px-3 py-2 rounded-lg font-medium ${
                  editedRepair.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  editedRepair.status === 'IN_ANALYSIS' ? 'bg-blue-100 text-blue-800' :
                  editedRepair.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                  editedRepair.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {editedRepair.status === 'PENDING' ? 'Pendente' :
                   editedRepair.status === 'COMPLETED' ? 'Concluído' :
                   editedRepair.status === 'IN_ANALYSIS' ? 'Em Análise' :
                   editedRepair.status === 'DELIVERED' ? 'Entregue' : editedRepair.status}
                </span>
              )}
            </div>

            {/* Dados do Cliente */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">Dados do Cliente</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mb-1">Nome</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                    {client?.name || repair.clientName || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mb-1">CPF</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                    {client?.cpf || repair.clientCPF || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mb-1">Telefone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                    {client?.phone || repair.clientPhone || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                    {client?.email || repair.clientEmail || 'Não informado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações da OS */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">Informações da OS</h3>

              {/* Eletrodomésticos */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Eletrodomésticos</h4>
                  {isEditing && (
                    <button
                      onClick={handleAddAppliance}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Eletrodoméstico
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#041A2D] text-white">
                        {isEditing && <th className="px-4 py-2 text-center font-semibold w-12">Ação</th>}
                        <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                        <th className="px-4 py-2 text-left font-semibold">Marca</th>
                        <th className="px-4 py-2 text-left font-semibold">Modelo</th>
                        <th className="px-4 py-2 text-left font-semibold">Voltagem</th>
                        <th className="px-4 py-2 text-left font-semibold">Nº Série</th>
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
                            <td className="px-2 py-2">
                              {isEditing ? (
                                <Select
                                  value={appliance.type || ''}
                                  onChange={(e) => handleApplianceChange(index, 'type', e.target.value)}
                                  className="w-full text-sm"
                                >
                                  <option value="">Selecione</option>
                                  <option value="Geladeira">Geladeira</option>
                                  <option value="Micro-ondas">Micro-ondas</option>
                                  <option value="Cafeteira">Cafeteira</option>
                                  <option value="Liquidificador">Liquidificador</option>
                                  <option value="Ferro de Passar">Ferro de Passar</option>
                                  <option value="Ar Condicionado">Ar Condicionado</option>
                                  <option value="Máquina de Lavar">Máquina de Lavar</option>
                                  <option value="Fogão">Fogão</option>
                                  <option value="Ventilador">Ventilador</option>
                                  <option value="Outro">Outro</option>
                                </Select>
                              ) : (
                                appliance.type || 'N/A'
                              )}
                            </td>
                            <td className="px-2 py-2">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={appliance.brand || ''}
                                  onChange={(e) => handleApplianceChange(index, 'brand', e.target.value)}
                                  className="w-full text-sm"
                                  placeholder="Marca"
                                />
                              ) : (
                                appliance.brand || 'N/A'
                              )}
                            </td>
                            <td className="px-2 py-2">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={appliance.model || ''}
                                  onChange={(e) => handleApplianceChange(index, 'model', e.target.value)}
                                  className="w-full text-sm"
                                  placeholder="Modelo"
                                />
                              ) : (
                                appliance.model || 'N/A'
                              )}
                            </td>
                            <td className="px-2 py-2">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={appliance.volt || ''}
                                  onChange={(e) => handleApplianceChange(index, 'volt', e.target.value)}
                                  className="w-full text-sm"
                                  placeholder="Voltagem"
                                />
                              ) : (
                                appliance.volt || 'N/A'
                              )}
                            </td>
                            <td className="px-2 py-2">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={appliance.series || ''}
                                  onChange={(e) => handleApplianceChange(index, 'series', e.target.value)}
                                  className="w-full text-sm"
                                  placeholder="Nº Série"
                                />
                              ) : (
                                appliance.series || 'N/A'
                              )}
                            </td>
                            <td className="px-2 py-2">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={appliance.laborValue || 0}
                                  onChange={(e) => handleApplianceChange(index, 'laborValue', e.target.value)}
                                  className="w-28 text-sm"
                                  placeholder="0.00"
                                />
                              ) : (
                                formatCurrency(appliance.laborValue || 0)
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-50">
                          <td colSpan={isEditing ? "8" : "7"} className="px-4 py-2 text-center text-gray-500">
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
                    Total Mão-de-Obra: {formatCurrency(editedRepair.appliances.reduce((sum, app) => sum + (Number(app.laborValue) || 0), 0))}
                  </div>
                </div>
              </div>

              {/* Peças */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Peças</h4>
                  {isEditing && (
                    <button
                      onClick={() => setShowComponentSelector(!showComponentSelector)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Peça do Sistema
                    </button>
                  )}
                </div>

                {/* Seletor de Peças */}
                {isEditing && showComponentSelector && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Selecione uma peça do sistema:
                    </label>
                    <div className="flex gap-2">
                      <Select
                        onChange={(e) => e.target.value && handleAddComponentToParts(e.target.value)}
                        className="flex-1"
                        defaultValue=""
                      >
                        <option value="">Selecione uma peça...</option>
                        {availableComponents.map((component) => (
                          <option key={component.id} value={component.id}>
                            {component.item || component.type} - R$ {(component.price || 0).toFixed(2)}
                          </option>
                        ))}
                      </Select>
                      <button
                        onClick={() => setShowComponentSelector(false)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#041A2D] text-white">
                        {isEditing && <th className="px-4 py-2 text-center font-semibold w-12">Ação</th>}
                        <th className="px-4 py-2 text-left font-semibold">Nome da Peça</th>
                        <th className="px-4 py-2 text-left font-semibold">Quantidade</th>
                        <th className="px-4 py-2 text-left font-semibold">Valor Unitário</th>
                        <th className="px-4 py-2 text-left font-semibold">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {editedRepair.parts && Array.isArray(editedRepair.parts) && editedRepair.parts.length > 0 ? (
                        editedRepair.parts.map((part, index) => (
                          !part._removed && (
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
                              <td className="px-2 py-2">{part.item || part.name || 'N/A'}</td>
                              <td className="px-2 py-2">
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    min="1"
                                    value={part.quantity || 1}
                                    onChange={(e) => handlePartChange(index, e.target.value)}
                                    className="w-20 text-sm"
                                  />
                                ) : (
                                  part.quantity || 1
                                )}
                              </td>
                              <td className="px-2 py-2">{formatCurrency(part.price || 0)}</td>
                              <td className="px-2 py-2">{formatCurrency(((part.price || 0) * (part.quantity || 1)))}</td>
                            </tr>
                          )
                        ))
                      ) : (
                        <tr className="bg-white">
                          <td colSpan={isEditing ? "5" : "4"} className="px-4 py-2 text-center text-gray-500">
                            Nenhuma peça registrada
                          </td>
                        </tr>
                      )}
                      {/* Linha Total */}
                      {editedRepair.parts && editedRepair.parts.length > 0 && (
                        <tr className="bg-blue-600 text-white font-semibold">
                          {isEditing && <td className="px-4 py-2"></td>}
                          <td className="px-4 py-2">Total</td>
                          <td className="px-4 py-2">{editedRepair.parts.reduce((sum, part) => sum + (Number(part.quantity) || 1), 0)}</td>
                          <td className="px-4 py-2">-</td>
                          <td className="px-4 py-2">
                            {formatCurrency(editedRepair.parts.reduce((sum, part) => sum + ((part.price || 0) * (part.quantity || 1)), 0))}
                          </td>
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
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Data de Recebimento
                    </label>
                    <Input
                      type="text"
                      value={formatDate(repair.receivedAt)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Data de Retirada
                    </label>
                    <Input
                      type="text"
                      value={formatDate(repair.deadline)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Garantia
                  </label>
                  <Input
                    type="text"
                    value={repair.warranty || 'Não informado'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Desconto (opcional)
                  </label>
                  <Input
                    type="text"
                    value={formatCurrency(discount)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Valor Total
                  </label>
                  <Input
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
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Observações do Cliente por Item
                </h4>
                <div className="space-y-2 text-sm">
                  {editedRepair.appliances && Array.isArray(editedRepair.appliances) && editedRepair.appliances.length > 0 ? (
                    editedRepair.appliances.map((appliance, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-zinc-800 p-2 rounded">
                        <p className="font-medium text-gray-900 dark:text-zinc-100 mb-1">
                          Item {index + 1} - {appliance.type || 'Sem tipo'}
                        </p>
                        {isEditing ? (
                          <textarea
                            value={appliance.customerNote || ''}
                            onChange={(e) => handleApplianceChange(index, 'customerNote', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded text-sm resize-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                            rows="2"
                            placeholder="Observação do cliente..."
                          />
                        ) : (
                          <p className="text-gray-700 dark:text-zinc-300">{appliance.observation || 'Sem observação'}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Nenhum item com observação</p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Observações Técnicas (opcional)
                </h4>
                {isEditing ? (
                  <textarea
                    value={editedRepair.serviceDescription || ''}
                    onChange={(e) => handleServiceDescriptionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded text-sm resize-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                    rows="6"
                    placeholder="Digite as observações técnicas aqui..."
                  />
                ) : (
                  <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded text-sm text-gray-700 dark:text-zinc-300 min-h-[100px]">
                    {editedRepair.serviceDescription || 'Nenhuma observação técnica registrada'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
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
