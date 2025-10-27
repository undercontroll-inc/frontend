import { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Select from '../shared/Select';
import ClientModal from './ClientModal';
import ClientService from '../../services/ClientService';
import { useToast } from '../../contexts/ToastContext';

export const CreateOrderModal = ({ isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const [appliances, setAppliances] = useState([
    {
      type: '',
      brand: '',
      model: '',
      voltage: '127 V',
      serial: '',
      customerNote: ''
    }
  ]);

  const [parts, setParts] = useState([
    {
      name: '',
      quantity: '',
      unitValue: '',
      totalValue: 0
    }
  ]);

  const [formData, setFormData] = useState({
    receivedAt: '',
    deadline: '',
    warranty: '',
    discount: '',
    laborValue: '',
    clientObservation: '',
    technicalObservation: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadClients();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (clientSearch.trim()) {
      const query = clientSearch.toLowerCase();
      const filtered = clients.filter(client => 
        client.name?.toLowerCase().includes(query) ||
        client.cpf?.includes(query) ||
        client.phone?.includes(query)
      );
      setFilteredClients(filtered);
      setShowClientSuggestions(true);
    } else {
      setFilteredClients([]);
      setShowClientSuggestions(false);
    }
  }, [clientSearch, clients]);

  const loadClients = async () => {
    try {
      const data = await ClientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar lista de clientes');
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setClientSearch(`${client.name} - CPF: ${formatCPF(client.cpf)}`);
    setShowClientSuggestions(false);
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setClientSearch('');
    setShowClientSuggestions(false);
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const handleApplianceChange = (index, field, value) => {
    const updated = [...appliances];
    updated[index][field] = value;
    setAppliances(updated);
  };

  const addAppliance = () => {
    setAppliances([...appliances, {
      type: '',
      brand: '',
      model: '',
      voltage: '127 V',
      serial: '',
      customerNote: ''
    }]);
  };

  const removeAppliance = (index) => {
    if (appliances.length > 1) {
      setAppliances(appliances.filter((_, i) => i !== index));
    }
  };

  const handlePartChange = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;

    // Calcula o valor total automaticamente
    if (field === 'quantity' || field === 'unitValue') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(updated[index].quantity) || 0;
      const unitValue = field === 'unitValue' ? parseFloat(value) || 0 : parseFloat(updated[index].unitValue) || 0;
      updated[index].totalValue = quantity * unitValue;
    }

    setParts(updated);
  };

  const addPart = () => {
    setParts([...parts, {
      name: '',
      quantity: '',
      unitValue: '',
      totalValue: 0
    }]);
  };

  const removePart = (index) => {
    if (parts.length > 1) {
      setParts(parts.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotals = () => {
    const partsTotal = parts.reduce((sum, part) => sum + (parseFloat(part.totalValue) || 0), 0);
    const laborValue = parseFloat(formData.laborValue) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const totalValue = partsTotal + laborValue - discount;

    return {
      partsTotal,
      laborValue,
      discount,
      totalValue
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedClient) {
      newErrors.client = 'Selecione um cliente';
      toast.error('Selecione um cliente para continuar');
    }

    // Valida se há pelo menos um eletrodoméstico com tipo preenchido
    const hasValidAppliance = appliances.some(app => app.type.trim());
    if (!hasValidAppliance) {
      newErrors.appliances = 'Adicione pelo menos um eletrodoméstico';
      toast.error('Adicione pelo menos um eletrodoméstico');
    }

    if (!formData.receivedAt) {
      newErrors.receivedAt = 'Data de recebimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const totals = calculateTotals();

    const orderData = {
      userId: selectedClient.id,
      appliances: appliances.filter(app => app.type.trim()),
      parts: parts.filter(part => part.name.trim()),
      ...totals,
      receivedAt: formData.receivedAt,
      deadline: formData.deadline,
      warranty: formData.warranty,
      serviceDescription: formData.clientObservation,
      notes: formData.technicalObservation,
      status: 'NAO_INICIADO',
      updatedAt: new Date().toISOString()
    };

    onSave(orderData);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedClient(null);
    setClientSearch('');
    setShowClientSuggestions(false);
    setAppliances([{
      type: '',
      brand: '',
      model: '',
      voltage: '127 V',
      serial: '',
      customerNote: ''
    }]);
    setParts([{
      name: '',
      quantity: '',
      unitValue: '',
      totalValue: 0
    }]);
    setFormData({
      receivedAt: '',
      deadline: '',
      warranty: '',
      discount: '',
      laborValue: '',
      clientObservation: '',
      technicalObservation: ''
    });
    setErrors({});
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSaveNewClient = async (clientData) => {
    try {
      const newClient = await ClientService.createClient({
        ...clientData,
        password: 'senha123',
        userType: 'COSTUMER',
        createdAt: new Date().toLocaleDateString('pt-BR')
      });
      
      toast.success('Cliente cadastrado com sucesso!');
      await loadClients();
      handleClientSelect(newClient);
      setIsClientModalOpen(false);
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast.error('Erro ao cadastrar cliente');
    }
  };

  const totals = calculateTotals();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col animate-modal-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#041A2D] text-white">
            <h2 className="text-xl font-semibold">Nova Ordem de Serviço</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Dados do Cliente */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Cliente</h3>
              
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Pesquisar por nome ou CPF"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      onFocus={() => clientSearch && setShowClientSuggestions(true)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>

                  {/* Suggestions Dropdown */}
                  {showClientSuggestions && filteredClients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">
                            CPF: {formatCPF(client.cpf)} | Tel: {formatPhone(client.phone)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsClientModalOpen(true)}
                  className="whitespace-nowrap"
                >
                  <Plus className="h-5 w-5" />
                  Cadastrar novo cliente
                </Button>
              </div>

              {/* Client Info Display */}
              {selectedClient && (
                <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
                    <div className="text-sm text-gray-900">{selectedClient.name}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">CPF</label>
                    <div className="text-sm text-gray-900">{formatCPF(selectedClient.cpf)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Telefone</label>
                    <div className="text-sm text-gray-900">{formatPhone(selectedClient.phone)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <div className="text-sm text-gray-900">{selectedClient.email || 'Não informado'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Informações da OS */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da OS</h3>

              {/* Eletrodomésticos */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Eletrodomésticos *
                  </label>
                </div>

                <div className="space-y-3">
                  {appliances.map((appliance, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-5 gap-3 mb-3">
                        <Select
                          value={appliance.type}
                          onChange={(e) => handleApplianceChange(index, 'type', e.target.value)}
                        >
                          <option value="">Selecione o Eletrodoméstico</option>
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

                        <Input
                          type="text"
                          placeholder="Insira a marca e o modelo"
                          value={`${appliance.brand} ${appliance.model}`.trim()}
                          onChange={(e) => {
                            const [brand, ...modelParts] = e.target.value.split(' ');
                            handleApplianceChange(index, 'brand', brand || '');
                            handleApplianceChange(index, 'model', modelParts.join(' '));
                          }}
                        />

                        <Select
                          value={appliance.voltage}
                          onChange={(e) => handleApplianceChange(index, 'voltage', e.target.value)}
                        >
                          <option value="127 V">127 V</option>
                          <option value="220 V">220 V</option>
                          <option value="Bivolt">Bivolt</option>
                        </Select>

                        <Input
                          type="text"
                          placeholder="Insira o nº da Série"
                          value={appliance.serial}
                          onChange={(e) => handleApplianceChange(index, 'serial', e.target.value)}
                        />

                        <Input
                          type="text"
                          placeholder="Insira o valor"
                          value={appliance.laborValue || ''}
                          onChange={(e) => handleApplianceChange(index, 'laborValue', e.target.value)}
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder="Observação do cliente sobre esse eletrodoméstico"
                            value={appliance.customerNote}
                            onChange={(e) => handleApplianceChange(index, 'customerNote', e.target.value)}
                          />
                        </div>
                        {appliances.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeAppliance(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addAppliance}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              {/* Peças */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Peças</label>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-[#041A2D] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Peças</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Quantidade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Valor Unitário</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Valor Somado</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold w-32">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((part, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="Pesquise a peça desejada"
                                value={part.name}
                                onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                                className="pl-8"
                              />
                              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              placeholder="Insira a quantidade"
                              value={part.quantity}
                              onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="R$ 0,00"
                              value={part.unitValue}
                              onChange={(e) => handlePartChange(index, 'unitValue', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded">
                              R$ {part.totalValue.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {parts.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => removePart(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remover
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addPart}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              {/* Datas e Valores */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Recebimento *
                  </label>
                  <Input
                    type="date"
                    name="receivedAt"
                    value={formData.receivedAt}
                    onChange={handleInputChange}
                    error={errors.receivedAt}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Retirada
                  </label>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Garantia
                  </label>
                  <Input
                    type="text"
                    name="warranty"
                    placeholder="Insira os dias de garantia"
                    value={formData.warranty}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    name="discount"
                    placeholder="Insira o valor do desconto"
                    value={formData.discount}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mão-de-Obra Total
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    name="laborValue"
                    placeholder="Insira o valor da mão-de-obra"
                    value={formData.laborValue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Valor Total */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Valor Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {totals.totalValue.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Peças: R$ {totals.partsTotal.toFixed(2)} + Mão-de-obra: R$ {totals.laborValue.toFixed(2)} - Desconto: R$ {totals.discount.toFixed(2)}
                </div>
              </div>

              {/* Observações */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações do Cliente
                  </label>
                  <textarea
                    name="clientObservation"
                    placeholder="Escreva uma observação sobre esse serviço"
                    value={formData.clientObservation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações Técnicas
                  </label>
                  <textarea
                    name="technicalObservation"
                    placeholder="Escreva uma observação sobre esse serviço"
                    value={formData.technicalObservation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Criar OS
            </Button>
          </div>
        </div>
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveNewClient}
      />

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

export default CreateOrderModal;
