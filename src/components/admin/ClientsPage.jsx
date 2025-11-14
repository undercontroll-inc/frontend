import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ClientService from '../../services/ClientService';
import RepairService from '../../services/RepairService';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Loading from '../shared/Loading';
import SideBar from '../shared/SideBar';
import ClientModal from './ClientModal';
import { useToast } from '../../contexts/ToastContext';

export function ClientsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientRepairs, setClientRepairs] = useState([]);
  const [loadingRepairs, setLoadingRepairs] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Validação de acesso apenas para admin
  useEffect(() => {
    if (user && user.userType !== 'ADMINISTRATOR') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchQuery]);

  useEffect(() => {
    if (selectedClient) {
      loadClientRepairs(selectedClient.id);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await ClientService.getAllClients();
      setClients(data);
      // Seleciona o primeiro cliente por padrão
      if (data.length > 0) {
        setSelectedClient(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientRepairs = async (clientId) => {
    try {
      setLoadingRepairs(true);
      const { data } = await RepairService.getAllRepairs(clientId);
      setClientRepairs(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setClientRepairs([]);
    } finally {
      setLoadingRepairs(false);
    }
  };

  const filterClients = () => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = clients.filter(client => 
      client.name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.cpf?.includes(query) ||
      client.phone?.includes(query)
    );

    setFilteredClients(filtered);
  };

  const formatPhone = (phone) => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3');
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'EM_ANDAMENTO': { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
      'NAO_INICIADO': { label: 'Não Iniciado', color: 'bg-yellow-100 text-yellow-700' },
      'FINALIZADO': { label: 'Finalizado', color: 'bg-green-100 text-green-700' },
      'CANCELADO': { label: 'Cancelado', color: 'bg-red-100 text-red-700' }
    };
    return statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  };

  const renderAppliance = (appliance) => {
    if (typeof appliance === 'string') return appliance;
    if (Array.isArray(appliance) && appliance.length > 0) {
      const first = appliance[0];
      if (typeof first === 'string') return first;
      return `${first.type || ''} ${first.brand || ''}`.trim();
    }
    if (typeof appliance === 'object') {
      return `${appliance.type || ''} ${appliance.brand || ''}`.trim();
    }
    return 'Não especificado';
  };

  const handleRowClick = (client) => {
    setSelectedClient(client);
  };

  const handleOpenModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (clientData) => {
    try {
      if (editingClient) {
        // Atualizar cliente existente
        await ClientService.updateClient(editingClient.id, {
          ...clientData,
          userType: 'COSTUMER'
        });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        // Criar novo cliente
        await ClientService.createClient({
          ...clientData,
          userType: 'COSTUMER',
          password: 'senha123' // Senha padrão, idealmente seria gerada ou enviada por email
        });
        toast.success('Cliente cadastrado com sucesso!');
      }
      
      // Recarrega a lista de clientes
      loadClients();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente. Tente novamente.');
    }
  };

  if (!user || user.userType !== 'ADMINISTRATOR') {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar active="clients" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Área Principal - Tabela */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 pb-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Clientes</h1>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 relative w-full max-w-2xl">
                <Input
                  type="text"
                  placeholder="Pesquise o cliente pelo nome, email ou CPF"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <Button
                variant="primary"
                className="whitespace-nowrap"
                onClick={handleOpenModal}
              >
                <Plus className="h-5 w-5" />
                Cadastrar novo cliente
              </Button>
            </div>
          </div>

          {/* Table Container com Scroll */}
          <div className="flex-1 px-8 pb-8 overflow-hidden">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#041A2D] text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Celular/Telefone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">E-mail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                          Nenhum cliente encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr 
                          key={client.id}
                          className={`cursor-pointer transition-colors ${
                            selectedClient?.id === client.id 
                              ? 'bg-gray-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleRowClick(client)}
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {client.name || 'Não informado'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatPhone(client.phone)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {client.email || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Lateral Fixo - Detalhes do Cliente */}
        {selectedClient && (
          <div className="w-[450px] bg-gray-100 border-l border-gray-300 flex flex-col h-full overflow-hidden">
            {/* Header Fixo */}
            <div className="p-6 border-b border-gray-300 bg-white flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedClient.name || 'Cliente'}
              </h2>
              {selectedClient.createdAt && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Cadastrado desde:</span> {formatDate(selectedClient.createdAt)}
                </p>
              )}
            </div>

            {/* Informações do Cliente - Com Scroll */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4 bg-white border-b border-gray-300">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Telefone</h3>
                  <p className="text-base font-medium text-gray-900">
                    {formatPhone(selectedClient.phone) || 'Não informado'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Email</h3>
                  <p className="text-base font-medium text-gray-900">
                    {selectedClient.email || 'Não informado'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">CPF</h3>
                  <p className="text-base font-medium text-gray-900">
                    {formatCPF(selectedClient.cpf) || 'Não informado'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Endereço</h3>
                  <p className="text-base font-medium text-gray-900">
                    {selectedClient.address || 'Não informado'}
                  </p>
                </div>
              </div>

              {/* Histórico */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  Histórico
                  <span className="text-xs text-gray-500 normal-case">▼</span>
                </h3>

                {loadingRepairs ? (
                  <p className="text-sm text-gray-500 italic">Carregando...</p>
                ) : clientRepairs.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Nenhuma ordem de serviço encontrada</p>
                ) : (
                  <div className="space-y-3">
                    {clientRepairs.map((repair) => {
                      const statusBadge = getStatusBadge(repair.status);
                      return (
                        <div key={repair.id} className="bg-[#041A2D] rounded-lg p-4 text-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">OS: #{repair.id}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${statusBadge.color}`}>
                                {statusBadge.label}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-300 block">Atualizado em:</span>
                              <span className="text-xs text-gray-300">{formatDate(repair.updatedAt)}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Aparelho(s):</p>
                              <p className="font-medium">
                                {repair.appliances ? renderAppliance(repair.appliances) : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Marca(s):</p>
                              <p className="font-medium">
                                {repair.appliances && Array.isArray(repair.appliances) && repair.appliances[0]?.brand 
                                  ? repair.appliances[0].brand 
                                  : repair.appliances?.brand || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 text-sm">
                            <p className="text-gray-400 text-xs mb-1">Recebimento</p>
                            <p className="font-medium">{formatDate(repair.receivedAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        client={editingClient}
      />
    </div>
  );
}

export default ClientsPage;
