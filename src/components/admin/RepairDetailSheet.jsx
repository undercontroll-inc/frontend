import { useState } from 'react';
import { Sheet, SheetContent, SheetSection, SheetItem } from '../shared/Sheet';
import Button from '../shared/Button';
import { Edit } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';

export const RepairDetailSheet = ({ isOpen, onClose, repair, onUpdate }) => {
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
      'PENDING': { label: 'Pendente' },
      'COMPLETED': { label: 'Concluído' },
      'EM_ANDAMENTO': { label: 'Em Andamento' },
      'NAO_INICIADO': { label: 'Não Iniciado' },
      'FINALIZADO': { label: 'Finalizado' },
      'CANCELADO': { label: 'Cancelado' },
      'Em Andamento': { label: 'Em Andamento' },
      'Pendente': { label: 'Pendente' },
      'Concluído': { label: 'Concluído' },
      'Cancelado': { label: 'Cancelado' }
    };
    return statusConfig[status] || { label: status };
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
    return repair.parts.map(part => {
      // Se part é uma string, retorna direto
      if (typeof part === 'string') {
        return part;
      }
      // Se é um objeto, retorna item, name, ou uma string vazia
      return part.item || part.name || part.componentName || 'Peça não identificada';
    });
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
      <SheetContent className='dark:bg-zinc-950'>
        {/* Status Badge */}
        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
            repair.status === 'COMPLETED' || repair.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
            repair.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800' :
            repair.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
            repair.status === 'PENDING' || repair.status === 'NAO_INICIADO' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            <span>{statusBadge.label}</span>
          </div>
        </div>

        {/* Eletrodomésticos */}
        <SheetSection title="Eletrodomésticos">
          <div className="space-y-2">
            {appliances.length > 0 ? (
              appliances.map((appliance) => (
                <div key={appliance.key} className="flex items-start  gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-500">•</span>
                  <span className="text-sm text-gray-900 dark:text-gray-300">{appliance.text || 'Não especificado'}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Nenhum eletrodoméstico registrado</p>
            )}
          </div>
        </SheetSection>

        {/* Peças Substituídas */}
        <SheetSection title="Peças Substituídas">
          <div className="space-y-2">
            {replacementParts.length > 0 ? (
              replacementParts.map((part, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-500">•</span>
                  <span className="text-sm text-gray-900 dark:text-gray-300">{part}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Nenhuma peça substituída</p>
            )}
          </div>
        </SheetSection>

        {/* Informações do Cliente */}
        <SheetSection title="Informações do Cliente">
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <SheetItem label="Nome" value={repair.clientName || 'Não informado'} className="border-0" />
            <SheetItem label="Email" value={repair.clientEmail || 'Não informado'} className="border-0" />
            <SheetItem 
              label="CPF" 
              value={repair.clientCpf ? formatCPF(repair.clientCpf) : 'Não informado'} 
              className="border-0" 
            />
            <SheetItem 
              label="Telefone" 
              value={repair.clientPhone ? formatPhone(repair.clientPhone) : 'Não informado'} 
              className="border-0" 
            />
          </div>
        </SheetSection>

        {/* Datas e Prazos */}
        {(repair.receivedAt || repair.deadline) && (
          <SheetSection title="Datas">
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
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
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
              {repair.partsTotal && (
                <SheetItem 
                  label="Peças" 
                  value={`R$ ${repair.partsTotal.toFixed(2).replace('.', ',')}`} 
                  className="border-0" 
                />
              )}
              {repair.laborTotal && (
                <SheetItem 
                  label="Mão de obra" 
                  value={`R$ ${repair.laborTotal.toFixed(2).replace('.', ',')}`} 
                  className="border-0" 
                />
              )}
              {repair.discount > 0 && (
                <SheetItem 
                  label="Desconto" 
                  value={`- R$ ${repair.discount.toFixed(2).replace('.', ',')}`} 
                  className="border-0" 
                />
              )}
              <SheetItem 
                label="Total" 
                value={`R$ ${repair.totalValue.toFixed(2).replace('.', ',')}`} 
                className="border-0 font-bold text-base" 
              />
            </div>
          </SheetSection>
        )}

        {/* Botão de Editar */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
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
        onClose={() => {
          setIsOrderModalOpen(false);
          onClose();
        }}
        repair={repair}
        client={{
          name: repair.clientName || 'Não informado',
          cpf: repair.clientCPF || 'Não informado',
          phone: repair.clientPhone || 'Não informado',
          email: repair.clientEmail || 'Não informado'
        }}
        onUpdate={onUpdate}
      />
    </Sheet>
  );
};

export default RepairDetailSheet;
