import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetSection, SheetItem } from '../shared/Sheet';
import Button from '../shared/Button';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import RepairService from '../../services/RepairService';

export const ClientDetailSheet = ({ isOpen, onClose, client }) => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client && isOpen) {
      loadClientRepairs();
    }
  }, [client, isOpen]);

  const loadClientRepairs = async () => {
    if (!client?.id) return;
    
    console.log(client);

    try {
      setLoading(true);
      const data = await RepairService.getAllRepairs(client.id);
      setRepairs(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  };

  if (!client) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
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

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={client.name || 'Cliente'}
    >
      <SheetContent>
        {/* Data de Cadastro */}
        {client.createdAt && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Cadastrado desde: <span className="font-medium text-gray-900">{formatDate(client.createdAt)}</span>
            </p>
          </div>
        )}

        {/* Contato */}
        <SheetSection title="Telefone">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-base font-semibold text-gray-900">
              {formatPhone(client.phone) || 'Não informado'}
            </p>
          </div>
        </SheetSection>

        <SheetSection title="Email">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-base font-medium text-gray-900">
              {client.email || 'Não informado'}
            </p>
          </div>
        </SheetSection>

        {/* CPF */}
        <SheetSection title="CPF">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-base font-medium text-gray-900">
              {formatCPF(client.cpf) || 'Não informado'}
            </p>
          </div>
        </SheetSection>

        {/* Endereço */}
        <SheetSection title="Endereço">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-base font-medium text-gray-900">
              {client.address || 'Não informado'}
            </p>
          </div>
        </SheetSection>

        {/* Histórico de Ordens */}
        <SheetSection title="Histórico">
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500 italic">Carregando...</p>
            ) : repairs.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nenhuma ordem de serviço encontrada</p>
            ) : (
              repairs.map((repair) => {
                const statusBadge = getStatusBadge(repair.status);
                return (
                  <div key={repair.id} className="bg-[#041A2D] rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">OS: #{repair.id}</span>
                        <span className={`text-xs px-2 py-1 rounded ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-300">
                        Atualizado em: {formatDate(repair.updatedAt)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
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
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <p className="text-gray-400 text-xs mb-1">Recebimento</p>
                      <p className="font-medium">{formatDate(repair.receivedAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SheetSection>
      </SheetContent>
    </Sheet>
  );
};

export default ClientDetailSheet;
