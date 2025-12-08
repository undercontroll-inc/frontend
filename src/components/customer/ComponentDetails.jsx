import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileDown } from "lucide-react";
import SideBar from "../shared/SideBar";
import Loading from "../shared/Loading";
import Button from "../shared/Button";
import RepairService from "../../services/RepairService";
import { useAuth } from "../../contexts/AuthContext";

const formatCurrency = (v) => {
  if (v == null) return "-";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatUpdatedAt = (s) => {
  if (!s) return null;
  if (typeof s !== "string") return String(s);
  return s.includes("T") ? s.replace("T", " ") : s;
};

const ComponentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validacao do primeiro login
    if(user.inFirstLogin) {
      navigate("/nova-senha");
    }
  }, [user]);

  useEffect(() => {
    loadRepairDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    document.title = "Dashboard - Detalhes";
  }, []);
  const loadRepairDetails = async () => {
    try {
      setLoading(true);
      const data = await RepairService.getRepairById(id);
      setRepair(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/repairs");
  };

  const handleExportPDF = () => {
    // Função para exportar PDF (implementar depois)
    console.log("Exportar para PDF");
  };

  if (loading) return <Loading text="Carregando detalhes..." />;
  if (!repair) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
        <SideBar active="repairs" />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 'var(--sidebar-offset, 280px)', transition: 'margin-left 300ms ease-in-out' }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ordem de serviço não encontrada
            </h2>
            <Button onClick={handleBack} variant="primary">
              Voltar para Consertos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (repair.status) {
      case "PENDING":
        return "text-yellow-400 border-yellow-400";
      case "IN_ANALYSIS":
        return "text-blue-400 border-blue-400";
      case "COMPLETED":
        return "text-green-400 border-green-400";
      case "DELIVERED":
        return "text-green-600 border-green-600";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getStatusLabel = () => {
    switch (repair.status) {
      case "PENDING":
        return "Pendente";
      case "IN_ANALYSIS":
        return "Em Análise";
      case "COMPLETED":
        return "Concluído";
      case "DELIVERED":
        return "Entregue";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <SideBar active="repairs" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen" style={{ marginLeft: 'var(--sidebar-offset, 280px)', transition: 'margin-left 300ms ease-in-out' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header com botões */}
          <div className="flex items-center justify-between mb-6">
            <Button onClick={handleBack} size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          {/* Card principal */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden border border-gray-300 dark:border-zinc-700">
            {/* Cabeçalho */}
            <div className="bg-[#041A2D] text-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-base font-semibold">
                    OS: #{`A${repair.id}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Status:</span>
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-medium bg-transparent border ${getStatusColor()}`}
                    >
                      {getStatusLabel()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-100">
                  Atualizado: {formatUpdatedAt(repair.updatedAt) || "-"}
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 bg-gray-50 dark:bg-zinc-900">{/* Seção: Eletrodomésticos + caixas de informações ao lado */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                  Eletrodomésticos
                </h3>
                {repair.appliances && repair.appliances.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                    {/* Tabela de eletrodomésticos (esquerda) */}
                    <div>
                      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-zinc-700 shadow-sm">
                        <table className="w-full">
                          <thead className="bg-[#041A2D] text-white text-xs font-semibold">
                            <tr>
                              <th className="text-left px-3 py-2">Eletrodoméstico</th>
                              <th className="text-left px-3 py-2">Marca / Modelo</th>
                              <th className="text-left px-3 py-2">Voltagem</th>
                              <th className="text-left px-3 py-2">Nº Série</th>
                              <th className="text-left px-3 py-2">Mão de Obra</th>
                            </tr>
                          </thead>
                          <tbody>
                            {repair.appliances.map((appliance, idx) => (
                              <tr
                                key={idx}
                                className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                  {appliance.type || "-"}
                                </td>
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                  {appliance.brand && appliance.model
                                    ? `${appliance.brand} ${appliance.model}`
                                    : "-"}
                                </td>
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                  {appliance.volt || "-"}
                                </td>
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                  {appliance.series || "-"}
                                </td>
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-medium">
                                  {idx === 0
                                    ? formatCurrency(repair.laborTotal)
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-[#041A2D] text-white font-bold text-xs">
                              <td className="px-3 py-2" colSpan={4}>
                                Total
                              </td>
                              <td className="px-3 py-2">
                                {formatCurrency(repair.laborTotal)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Caixas (direita) */}
                    <div className="space-y-3">
                      {/* Linha de cima: 3 caixas */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide text-center">
                            Recebimento
                          </div>
                          <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 px-2 py-1.5 text-gray-900 dark:text-gray-100 text-xs text-center shadow-sm">
                            {repair.receivedAt || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide text-center">
                            Retirada
                          </div>
                          <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 px-2 py-1.5 text-gray-900 dark:text-gray-100 text-xs text-center shadow-sm">
                            {repair.status === "COMPLETED" || repair.status === "DELIVERED"
                              ? repair.deadline || "-"
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide text-center">
                            Garantia
                          </div>
                          <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 px-2 py-1.5 text-gray-900 dark:text-gray-100 text-xs text-center shadow-sm">
                            {repair.warranty || "-"}
                          </div>
                        </div>
                      </div>
                      {/* Linha de baixo: 2 caixas */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide text-center">
                            Desconto
                          </div>
                          <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 px-2 py-1.5 text-gray-900 dark:text-gray-100 text-xs text-center shadow-sm">
                            {repair.discount && repair.discount > 0
                              ? formatCurrency(repair.discount)
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide text-center">
                            Valor Total
                          </div>
                          <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 px-2 py-1.5 text-gray-900 dark:text-gray-100 text-sm font-bold text-center shadow-sm">
                            {formatCurrency(repair.totalValue)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Nenhum eletrodoméstico cadastrado
                  </p>
                )}
              </div>

              {/* Seção: Peças + Observações do Cliente ao lado */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                  Peças
                </h3>
                {repair.parts && repair.parts.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                    {/* Tabela de peças (esquerda) */}
                    <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-zinc-700 shadow-sm">
                      <table className="w-full">
                        <thead className="bg-[#041A2D] text-white text-xs font-semibold">
                          <tr>
                            <th className="text-left px-3 py-2">Peças</th>
                            <th className="text-left px-3 py-2">Quantidade</th>
                            <th className="text-left px-3 py-2">Valor Unitário</th>
                            <th className="text-left px-3 py-2">Valor Somado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {repair.parts.map((part, idx) => (
                            <tr
                              key={idx}
                              className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                            >
                              <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                {part.item || part.name || "-"}
                              </td>
                              <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                {part.quantity || 0}
                              </td>
                              <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                {formatCurrency(part.price)}
                              </td>
                              <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-medium">
                                {formatCurrency(((part.price || 0) * (part.quantity || 0)) || 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#041A2D] text-white font-bold text-xs">
                            <td className="px-3 py-2">Total</td>
                            <td className="px-3 py-2">
                              {repair.parts.reduce(
                                (sum, p) => sum + (p.quantity || 0),
                                0
                              )}
                            </td>
                            <td className="px-3 py-2">-</td>
                            <td className="px-3 py-2">
                              {formatCurrency(repair.partsTotal)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {/* Observações do Cliente (direita) */}
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        Observações do Cliente
                      </div>
                      {repair.appliances && repair.appliances.length > 0 ? (
                        repair.appliances.map((ap, idx) => (
                          <div key={idx} className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 p-3 shadow-sm">
                            <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                              {`Item ${idx + 1} - ${ap.type || "Aparelho"}`}
                            </div>
                            <div className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-wrap">
                              {ap.customerNote &&
                                ap.customerNote.trim().length > 0
                                ? ap.customerNote
                                : "-"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 p-3 text-xs text-gray-700 dark:text-gray-300 shadow-sm">
                          Nenhuma observação cadastrada
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Nenhuma peça cadastrada
                  </p>
                )}
              </div>

              {/* Observações do Cliente (global) - mostrar apenas se não houver notas por eletrodoméstico */}
              {!repair.appliances?.some(
                (a) => a.customerNote && a.customerNote.trim().length > 0
              ) &&
                repair.notes && (
                  <div className="mb-6">
                    <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">
                      <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
                        Observações do Cliente
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-wrap">
                        {repair.notes}
                      </div>
                    </div>
                  </div>
                )}

              {/* Observações Técnicas (se houver serviceDescription) */}
              {repair.serviceDescription && (
                <div className="mb-6">
                  <div className="bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
                      Observações Técnicas
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-wrap">
                      {repair.serviceDescription}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetails;
