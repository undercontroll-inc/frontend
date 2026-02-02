import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import RepairService from '../../services/RepairService';
import PageContainer from '../shared/PageContainer';
import Select from '../shared/Select';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Loading from '../shared/Loading';
import SideBar from '../shared/SideBar';
import RepairDetailSheet from './RepairDetailSheet';
import CreateOrderModal from './CreateOrderModal';

export function RepairPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Validação de acesso apenas para admin
  useEffect(() => {
    if (user && user.userType !== 'ADMINISTRATOR') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadRepairs();
  }, []);

  useEffect(() => {
    filterRepairs();
  }, [repairs, statusFilter, searchQuery]);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      const { data } = await RepairService.getAllRepairs();
      
      console.log(data);

      // Extrai os dados do cliente que já vêm na resposta
      const repairsWithClients = data.map((repair) => ({
        ...repair,
        clientName: repair.user?.name || 'N/A',
        clientEmail: repair.user?.email || '',
        clientCpf: repair.user?.cpf || '',
        clientPhone: repair.user?.phone || ''
      }));
      
      setRepairs(repairsWithClients);
    } catch (error) {
      console.error('Erro ao carregar ordens de serviço:', error);
      toast.error('Erro ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const filterRepairs = () => {
    let filtered = repairs;

    // Filtrar por status
    if (statusFilter !== 'Todos') {
      filtered = filtered.filter(repair => repair.status === statusFilter);
    }

    // Filtrar por busca (cliente ou ordem de serviço)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(repair => 
        repair.id?.toString().includes(query) ||
        repair.serviceOrderId?.toLowerCase().includes(query) ||
        repair.clientName?.toLowerCase().includes(query)
      );
    }

    setFilteredRepairs(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Se já estiver no formato DD/MM/YYYY, retorna direto
    if (dateString.includes('/')) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': 'Pendente',
      'IN_ANALYSIS': 'Em Análise',
      'COMPLETED': 'Concluído',
      'DELIVERED': 'Entregue',
    };
    return statusMap[status] || status;
  };

  const handleRowClick = (repair) => {
    setSelectedRepair(repair);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = async () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedRepair(null), 300); // Delay para animação
    
    console.log("CU");
    await loadRepairs();
  };

  const handleSaveOrder = async (orderData) => {
    try {
      await RepairService.createRepair(orderData);
      toast.success('Ordem de serviço criada com sucesso!');
      loadRepairs(); // Recarrega a lista
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar ordem de serviço:', error);
      toast.error('Erro ao criar ordem de serviço');
    }
  };

  if (!user || user.userType !== 'ADMINISTRATOR') {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 ">
      <SideBar />
      
      <div className="flex-1">
        <PageContainer>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-gray-100">Consertos</h1>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="!bg-[#ba5c00] hover:!bg-[#8a4500] hover:brightness-90 hover:shadow-lg transition-all duration-200 focus:ring-orange-100 text-sm px-4 py-2"
              >
                <Plus className="h-4 w-4" />
                Nova Ordem de Serviço
              </Button>
            </div>

            {/* Filters Section */}
            <div className=" rounded-lg shadow-sm p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquise o conserto pela OS ou nome do cliente"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="Todos">Status: Todos</option>
                  <option value="PENDING">Pendente</option>
                  <option value="IN_ANALYSIS">Em Análise</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="DELIVERED">Entregue</option>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || statusFilter !== 'Todos') && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('Todos');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-280px)]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#041A2D] text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Ordem de Serviço</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Eletrodoméstico(s)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Data de Recebimento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {filteredRepairs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          Nenhuma ordem de serviço encontrada
                        </td>
                      </tr>
                    ) : (
                      filteredRepairs.map((repair, index) => (
                        <tr 
                          key={repair.id}
                          className={`cursor-pointer transition-colors ${
                            index % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-blue-50 dark:bg-zinc-800"
                          }`}
                          onClick={() => handleRowClick(repair)}
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {getStatusLabel(repair.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                            #{repair.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {repair.clientName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            <div className="space-y-1">
                              {repair.appliances && Array.isArray(repair.appliances) ? (
                                repair.appliances.map((appliance, index) => (
                                  <div key={index}>
                                    {index + 1}. {typeof appliance === 'string' 
                                      ? appliance 
                                      : `${appliance.type || ''} ${appliance.brand || ''} ${appliance.model || ''}`.trim() || 'Eletrodoméstico'}
                                  </div>
                                ))
                              ) : repair.appliances && typeof repair.appliances === 'object' ? (
                                <div>
                                  1. {`${repair.appliances.type || ''} ${repair.appliances.brand || ''} ${repair.appliances.model || ''}`.trim() || 'Eletrodoméstico'}
                                </div>
                              ) : (
                                typeof repair.appliances === 'string' ? repair.appliances : 'N/A'
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(repair.receivedAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Mostrando {filteredRepairs.length} de {repairs.length} ordens de serviço
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Sheet de Detalhes */}
      <RepairDetailSheet
        isOpen={isSheetOpen}
        onClose={() => handleCloseSheet}
        repair={selectedRepair}
        onUpdate={loadRepairs}
      />

      {/* Modal de Criar OS */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveOrder}
      />
    </div>
  );
}