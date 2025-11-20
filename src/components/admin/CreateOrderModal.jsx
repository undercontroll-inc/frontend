import { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Select from '../shared/Select';
import { CalendarTimePicker } from '../shared/CalendarTimePicker';
import ClientService from '../../services/ClientService';
import ComponentService from '../../services/ComponentService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export const CreateOrderModal = ({ isOpen, onClose, onSave }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  
  // Estados para componentes/peças
  const [availableComponents, setAvailableComponents] = useState([]);
  const [componentSearch, setComponentSearch] = useState('');
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [showComponentSuggestions, setShowComponentSuggestions] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(null);

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
      id: '',
      componentName: '',
      quantity: '',
      price: 0
    }
  ]);

  const [formData, setFormData] = useState({
    receivedAt: '',
    deadline: '',
    warranty: '',
    discount: '',
    clientObservation: '',
    technicalObservation: '',
    nf: '',
    returnGuarantee: false,
    fabricGuarantee: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadClients();
      loadComponents();
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
      const filtered = clients.filter(client => {
        const fullName = `${client.name || ''} ${client.lastName || ''}`.toLowerCase();
        const phoneDigits = client.phone?.replace(/\D/g, '') || '';
        const cpfDigits = client.cpf?.replace(/\D/g, '') || '';
        const searchDigits = query.replace(/\D/g, '');
        
        return fullName.includes(query) ||
               phoneDigits.includes(searchDigits) ||
               (cpfDigits && cpfDigits.includes(searchDigits));
      });
      setFilteredClients(filtered);
      setShowClientSuggestions(true);
    } else {
      setFilteredClients([]);
      setShowClientSuggestions(false);
    }
  }, [clientSearch, clients]);

  useEffect(() => {
    if (componentSearch.trim() && currentPartIndex !== null) {
      const query = componentSearch.toLowerCase();
      const filtered = availableComponents.filter(component => 
        component.name?.toLowerCase().includes(query) ||
        component.description?.toLowerCase().includes(query) ||
        component.code?.toLowerCase().includes(query)
      );
      setFilteredComponents(filtered);
      setShowComponentSuggestions(true);
    } else {
      setFilteredComponents([]);
      setShowComponentSuggestions(false);
    }
  }, [componentSearch, availableComponents, currentPartIndex]);

  const loadClients = async () => {
    try {
      const data = await ClientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar lista de clientes');
    }
  };

  const loadComponents = async () => {
    try {
      const data = await ComponentService.getAllComponents();
      setAvailableComponents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar componentes:', error);
      toast.error('Erro ao carregar lista de componentes');
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    const fullName = `${client.name} ${client.lastName}`;
    const cpfPart = client.cpf ? ` - CPF: ${formatCPF(client.cpf)}` : '';
    setClientSearch(`${fullName}${cpfPart}`);
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
    setParts(updated);
  };

  const handleComponentSelect = (component, index) => {
    const updated = [...parts];
    updated[index].id = component.id;
    updated[index].componentName = component.item || component.name || '';
    updated[index].price = component.price || 0;
    
    setParts(updated);
    setComponentSearch('');
    setShowComponentSuggestions(false);
    setCurrentPartIndex(null);
  };

  const handlePartSearchFocus = (index) => {
    setCurrentPartIndex(index);
    const currentPart = parts[index];
    if (currentPart.componentName) {
      setComponentSearch(currentPart.componentName);
      setShowComponentSuggestions(true);
    }
  };

  const handlePartSearchChange = (index, value) => {
    setCurrentPartIndex(index);
    setComponentSearch(value);
    
    // Se limpar o campo, limpa também o componente selecionado
    if (!value.trim()) {
      const updated = [...parts];
      updated[index].id = '';
      updated[index].componentName = '';
      updated[index].price = 0;
      setParts(updated);
    }
  };

  const addPart = () => {
    setParts([...parts, {
      id: '',
      componentName: '',
      quantity: '',
      price: 0
    }]);
  };

  const removePart = (index) => {
    if (parts.length > 1) {
      setParts(parts.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotals = () => {
    const discount = parseFloat(formData.discount) || 0;

    return {
      discount,
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
      appliances: appliances
        .filter(app => app.type.trim())
        .map(app => ({
          type: app.type,
          brand: app.brand || '',
          model: app.model || '',
          voltage: app.voltage,
          serial: app.serial || '',
          customerNote: app.customerNote || '',
          // laborValue é opcional - só inclui se preenchido
          ...(app.laborValue ? { laborValue: parseFloat(app.laborValue) } : {})
        })),
      parts: parts
        .filter(part => part.id && part.quantity)
        .map(part => ({
          id: parseInt(part.id, 10),
          quantity: parseInt(part.quantity, 10)
        })),
      discount: totals.discount || 0,
      receivedAt: formData.receivedAt || new Date().toLocaleDateString('pt-BR'),
      ...(formData.deadline ? { deadline: formData.deadline } : {}),
      serviceDescription: formData.clientObservation,
      notes: formData.technicalObservation,
      // optional fiscal note
      ...(formData.nf ? { nf: formData.nf } : {}),
      // guarantees
      returnGuarantee: !!formData.returnGuarantee,
      fabricGuarantee: !!formData.fabricGuarantee,
      status: 'NAO_INICIADO'
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
    setComponentSearch('');
    setShowComponentSuggestions(false);
    setCurrentPartIndex(null);
    setAppliances([{
      type: '',
      brand: '',
      model: '',
      voltage: '127 V',
      serial: '',
      customerNote: ''
    }]);
    setParts([{
      id: '',
      componentName: '',
      quantity: '',
      price: 0
    }]);
    setFormData({
      receivedAt: '',
      deadline: '',
      warranty: '',
      discount: '',
      clientObservation: '',
      technicalObservation: '',
      nf: '',
      returnGuarantee: false,
      fabricGuarantee: false
    });
    setErrors({});
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-6xl my-8 flex flex-col animate-modal-in" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#041A2D] text-white flex-shrink-0">
            <h2 className="text-xl font-semibold">Nova Ordem de Serviço</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarGutter: 'stable' }}>
            {/* Dados do Cliente */}
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Dados do Cliente</h3>
              
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Pesquisar por nome, CPF ou telefone"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      onFocus={() => clientSearch && setShowClientSuggestions(true)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>

                  {/* Suggestions Dropdown */}
                  {showClientSuggestions && filteredClients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-zinc-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-900">
                            {client.name} {client.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client.cpf && `CPF: ${formatCPF(client.cpf)} | `}
                            Tel: {formatPhone(client.phone)}
                            {client.email && ` | ${client.email}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => navigate("/clients")}
                  className="whitespace-nowrap"
                >
                  <Plus className="h-5 w-5" />
                  Cadastrar novo cliente
                </Button>
              </div>

              {/* Client Info Display */}
              {selectedClient && (
                <div className="grid grid-cols-4 gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nome Completo</label>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{selectedClient.name} {selectedClient.lastName}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">CPF</label>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{selectedClient.cpf ? formatCPF(selectedClient.cpf) : 'Não informado'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Telefone</label>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{formatPhone(selectedClient.phone)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{selectedClient.email || 'Não informado'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Informações da OS */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Informações da OS</h3>

              {/* Eletrodomésticos */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Eletrodomésticos *
                  </label>
                </div>

                <div className="space-y-4">
                  {appliances.map((appliance, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Eletrodoméstico {index + 1}</h4>
                        {appliances.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeAppliance(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1"
                          >
                            Remover
                          </Button>
                        )}
                      </div>

                      {/* Primeira linha: Tipo, Marca, Modelo */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Tipo *</label>
                          <Select
                            value={appliance.type}
                            onChange={(e) => handleApplianceChange(index, 'type', e.target.value)}
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
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Marca</label>
                          <Input
                            type="text"
                            placeholder="Ex: Brastemp"
                            value={appliance.brand || ''}
                            onChange={(e) => handleApplianceChange(index, 'brand', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Modelo</label>
                          <Input
                            type="text"
                            placeholder="Ex: BRM45"
                            value={appliance.model || ''}
                            onChange={(e) => handleApplianceChange(index, 'model', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Segunda linha: Voltagem, Nº Série, Valor Mão-de-obra */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Voltagem</label>
                          <Select
                            value={appliance.voltage}
                            onChange={(e) => handleApplianceChange(index, 'voltage', e.target.value)}
                          >
                            <option value="127 V">127 V</option>
                            <option value="220 V">220 V</option>
                            <option value="Bivolt">Bivolt</option>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Nº de Série</label>
                          <Input
                            type="text"
                            placeholder="Ex: ABC123456"
                            value={appliance.serial || ''}
                            onChange={(e) => handleApplianceChange(index, 'serial', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Valor Mão-de-obra (R$) - Opcional</label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={appliance.laborValue || ''}
                            onChange={(e) => handleApplianceChange(index, 'laborValue', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Terceira linha: Observação do cliente */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Observação do Cliente</label>
                        <Input
                          type="text"
                          placeholder="Descreva o problema relatado pelo cliente"
                          value={appliance.customerNote || ''}
                          onChange={(e) => handleApplianceChange(index, 'customerNote', e.target.value)}
                        />
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
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Peças do Estoque
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPart}
                    className="text-xs px-3 py-1.5"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar peça
                  </Button>
                </div>

                <div className="space-y-3">
                  {parts.map((part, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Peça {index + 1}</h4>
                        {parts.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removePart(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1"
                          >
                            Remover
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {/* Campo de busca do componente */}
                        <div className="col-span-2 relative">
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Componente *</label>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Pesquise o componente"
                              value={part.componentName || (currentPartIndex === index ? componentSearch : '')}
                              onChange={(e) => handlePartSearchChange(index, e.target.value)}
                              onFocus={() => handlePartSearchFocus(index)}
                              className="pl-8"
                            />
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          
                          {/* Suggestions Dropdown - Agora com z-index mais alto */}
                          {showComponentSuggestions && currentPartIndex === index && filteredComponents.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                              {filteredComponents.map((component) => (
                                <button
                                  key={component.id}
                                  type="button"
                                  onClick={() => handleComponentSelect(component, index)}
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                                >
                                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{component.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {component.code && `Cód: ${component.code} | `}
                                    R$ {(component.price || 0).toFixed(2)} | 
                                    Estoque: {component.quantity || 0} un.
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Quantidade */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-300 mb-1">Quantidade *</label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Qtd"
                            value={part.quantity}
                            onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                            disabled={!part.id}
                            className={!part.id ? 'bg-gray-100 cursor-not-allowed' : ''}
                          />
                          {!part.id && (
                            <p className="text-xs text-gray-500 mt-1">Selecione um componente primeiro</p>
                          )}
                        </div>

                        {/* Valor Unitário - Display only */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Unit.</label>
                          <div className="text-sm text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-zinc-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 h-[42px] flex items-center">
                            R$ {(part.price || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Total da peça - destaque */}
                      {part.id && part.quantity && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal desta peça:</span>
                            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              R$ {(((part.price || 0) * (parseFloat(part.quantity) || 0)) || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Datas e Valores */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <CalendarTimePicker
                  label="Data e Hora de Recebimento"
                  value={formData.receivedAt}
                  onChange={(value) => setFormData(prev => ({ ...prev, receivedAt: value }))}
                  required
                  error={errors.receivedAt}
                  placeholder="Selecione a data de recebimento"
                />

                <CalendarTimePicker
                  label="Data e Hora de Retirada"
                  value={formData.deadline}
                  onChange={(value) => setFormData(prev => ({ ...prev, deadline: value }))}
                  placeholder="Selecione a data de retirada (opcional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Desconto (Opcional)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    name="discount"
                    placeholder="Insira o valor do desconto (opcional)"
                    value={formData.discount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>


              {/* Observações */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
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

              {/* NF e Garantias */}
              <div className="mt-4 grid grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Nota Fiscal (opcional)</label>
                  <Input
                    type="text"
                    name="nf"
                    placeholder="Número da nota fiscal"
                    value={formData.nf}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="returnGuarantee"
                    name="returnGuarantee"
                    type="checkbox"
                    checked={formData.returnGuarantee}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="returnGuarantee" className="text-sm text-gray-700 dark:text-zinc-300">Garantia de Retorno</label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="fabricGuarantee"
                    name="fabricGuarantee"
                    type="checkbox"
                    checked={formData.fabricGuarantee}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="fabricGuarantee" className="text-sm text-gray-700 dark:text-zinc-300">Garantia de Fábrica</label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 flex-shrink-0">
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
        
        /* Custom scrollbar for modal content */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default CreateOrderModal;
