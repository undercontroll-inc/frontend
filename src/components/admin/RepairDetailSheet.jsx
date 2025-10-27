import { useState } from 'react';
import { Sheet, SheetContent, SheetSection, SheetItem } from '../shared/Sheet';
import Button from '../shared/Button';
import { Star, Edit } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';

export const RepairDetailSheet = ({ isOpen, onClose, repair }) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  if (!repair) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Se já estiver no formato DD/MM/YYYY, retorna direto
    if (dateString.includes('/')) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, '($1) $2.$3-$4');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'EM_ANDAMENTO': { label: 'Em Andamento', icon: '⚙️' },
      'NAO_INICIADO': { label: 'Não Iniciado', icon: '⏸️' },
      'FINALIZADO': { label: 'Finalizado', icon: '✅' },
      'CANCELADO': { label: 'Cancelado', icon: '❌' },
      'Em Andamento': { label: 'Em Andamento', icon: '⚙️' },
      'Pendente': { label: 'Pendente', icon: '⏸️' },
      'Concluído': { label: 'Concluído', icon: '✅' },
      'Cancelado': { label: 'Cancelado', icon: '❌' }
    };
    return statusConfig[status] || { label: status, icon: '📋' };
  };

  const renderAppliances = () => {
    if (!repair.appliances) return [];

    if (Array.isArray(repair.appliances)) {
      return repair.appliances.map((appliance, index) => {
        if (typeof appliance === 'string') {
          return { key: index, text: appliance };
        }
        // Para objetos com type, brand, model
        return {
          key: index,
          text: `${appliance.type || ''} ${appliance.brand || ''} ${appliance.model || ''}`.trim()
        };
      });
    }

    if (typeof repair.appliances === 'object') {
      const app = repair.appliances;
      return [{
        key: 0,
        text: `${app.type || ''} ${app.brand || ''} ${app.model || ''}`.trim()
      }];
    }

    return [{ key: 0, text: repair.appliances }];
  };

  const renderReplacementParts = () => {
    if (!repair.parts || !Array.isArray(repair.parts)) {
      return [];
    }
    return repair.parts.map(part => part.name || part);
  };

  const statusBadge = getStatusBadge(repair.status);
  const appliances = renderAppliances();
  const replacementParts = renderReplacementParts();

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Ordem de Serviço #${repair.id}`}
    >
      <SheetContent>
        {/* Status Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <span>{statusBadge.icon}</span>
            <span className="font-medium">{statusBadge.label}</span>
          </div>
        </div>

        {/* Eletrodomésticos */}
        <SheetSection title="Eletrodomésticos">
          <div className="space-y-2">
            {appliances.map((appliance) => (
              <div key={appliance.key} className="flex items-start gap-2">
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-900">{appliance.text || 'Não especificado'}</span>
              </div>
            ))}
          </div>
        </SheetSection>

        {/* Peças Substituídas */}
        <SheetSection title="Peças Substituídas">
          <div className="space-y-2">
            {replacementParts.length > 0 ? (
              replacementParts.map((part, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-900">{part}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Nenhuma peça substituída</p>
            )}
          </div>
        </SheetSection>

        {/* Informações do Cliente */}
        <SheetSection title="Informações do Cliente">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <SheetItem label="Nome" value={repair.clientName || 'Felipe Guerra Dias'} className="border-0" />
            <SheetItem label="Email" value={repair.clientEmail || 'felipe.dias@email.com'} className="border-0" />
            <SheetItem 
              label="CPF" 
              value={repair.clientCPF ? formatCPF(repair.clientCPF) : '180.778.23X-XX'} 
              className="border-0" 
            />
            <SheetItem 
              label="Telefone" 
              value={repair.clientPhone ? formatPhone(repair.clientPhone) : '11 99672-2341'} 
              className="border-0" 
            />
          </div>
        </SheetSection>

        {/* Datas e Prazos */}
        {(repair.receivedAt || repair.deadline) && (
          <SheetSection title="Datas">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {repair.receivedAt && (
                <SheetItem 
                  label="Data de Recebimento" 
                  value={formatDate(repair.receivedAt)} 
                  className="border-0" 
                />
              )}
              {repair.deadline && (
                <SheetItem 
                  label="Prazo" 
                  value={formatDate(repair.deadline)} 
                  className="border-0" 
                />
              )}
              {repair.warranty && (
                <SheetItem 
                  label="Garantia" 
                  value={repair.warranty} 
                  className="border-0" 
                />
              )}
            </div>
          </SheetSection>
        )}

        {/* Valores */}
        {repair.totalValue && (
          <SheetSection title="Valores">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {repair.partsTotal && (
                <SheetItem 
                  label="Peças" 
                  value={`R$ ${repair.partsTotal.toFixed(2)}`} 
                  className="border-0" 
                />
              )}
              {repair.laborValue && (
                <SheetItem 
                  label="Mão de obra" 
                  value={`R$ ${repair.laborValue.toFixed(2)}`} 
                  className="border-0" 
                />
              )}
              {repair.discount > 0 && (
                <SheetItem 
                  label="Desconto" 
                  value={`- R$ ${repair.discount.toFixed(2)}`} 
                  className="border-0" 
                />
              )}
              <SheetItem 
                label="Total" 
                value={`R$ ${repair.totalValue.toFixed(2)}`} 
                className="border-0 font-bold text-base" 
              />
            </div>
          </SheetSection>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              console.log('Ver mais informações', repair);
            }}
          >
            Ver mais informações
          </Button>
        </div>

        <div className="pt-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setIsOrderModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Ver OS completa e editar
          </Button>
        </div>
      </SheetContent>

      {/* Modal de Detalhes da OS */}
      <OrderDetailModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        repair={repair}
        client={{
          name: repair.clientName || 'Felipe Guerra Dias',
          cpf: repair.clientCPF || '180.778.23X-XX',
          phone: repair.clientPhone || '11 99672-2341',
          email: repair.clientEmail || 'felipe.dias@email.com'
        }}
      />
    </Sheet>
  );
};

export default RepairDetailSheet;
