import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileDown } from "lucide-react";
import SideBar from "../shared/SideBar";
import Loading from "../shared/Loading";
import Button from "../shared/Button";
import RepairService from "../../services/RepairService";

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
  const navigate = useNavigate();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRepairDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      <div className="flex min-h-screen bg-gray-50">
        <SideBar active="repairs" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
      case "EM_ANDAMENTO":
        return "text-yellow-400 border-yellow-400";
      case "FINALIZADO":
        return "text-green-400 border-green-400";
      case "NAO_INICIADO":
        return "text-red-400 border-red-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getStatusLabel = () => {
    switch (repair.status) {
      case "EM_ANDAMENTO":
        return "Em Andamento";
      case "FINALIZADO":
        return "Finalizado";
      case "NAO_INICIADO":
        return "Não Iniciado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="repairs" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen p-8 pl-18 pt-4">
        <div className="max-w-6xl mx-auto py-3">
          {/* Header com botões */}
          <div className="flex items-center justify-between mb-6 pb-5">
            <Button onClick={handleBack} size="md" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="md"
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Exportar para PDF
            </Button>
          </div>

          {/* Card principal */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-[#041A2D] text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold">
                    Ordem de Serviço: #{`A${repair.id}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Status:</span>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-transparent border ${getStatusColor()}`}
                    >
                      {getStatusLabel()}
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  Atualizado em: {formatUpdatedAt(repair.updatedAt) || "-"}
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 bg-gray-400 ">
              {/* Seção: Eletrodomésticos + caixas de informações ao lado */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 pl-1">
                  Eletrodomésticos
                </h3>
                {repair.appliances && repair.appliances.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                    {/* Tabela de eletrodomésticos (esquerda) */}
                    <div className="pr-10 pb-5">
                      <div className="overflow-x-auto rounded-lg border border-black ">
                        <table className="w-full">
                          <thead className="bg-[#041A2D] text-white text-sm font-semibold ">
                            <tr>
                              <th className="text-left p-3">Eletrodoméstico</th>
                              <th className="text-left p-3">Marca / Modelo</th>
                              <th className="text-left p-3">Voltagem</th>
                              <th className="text-left p-3">Número de Série</th>
                              <th className="text-left p-3">Mão de Obra</th>
                            </tr>
                          </thead>
                          <tbody>
                            {repair.appliances.map((appliance, idx) => (
                              <tr
                                key={idx}
                                className="bg-white border-b border-gray-300 text-sm"
                              >
                                <td className="p-3 text-gray-900">
                                  {appliance.type || "-"}
                                </td>
                                <td className="p-3 text-gray-900">
                                  {appliance.brand && appliance.model
                                    ? `${appliance.brand} ${appliance.model}`
                                    : "-"}
                                </td>
                                <td className="p-3 text-gray-900">
                                  {appliance.voltage || "-"}
                                </td>
                                <td className="p-3 text-gray-900">
                                  {appliance.serial || "-"}
                                </td>
                                <td className="p-3 text-gray-900">
                                  {idx === 0
                                    ? formatCurrency(repair.laborValue)
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-blue-800 text-white font-bold text-sm ">
                              <td className="p-3" colSpan={4}>
                                Total
                              </td>
                              <td className="p-3">
                                {formatCurrency(repair.laborValue)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Caixas (direita) */}
                    <div className="space-y-4 ">
                      {/* Linha de cima: 3 caixas */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs font-bold text-gray-900  pb-1 text-center ">
                            Data Recebimento
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 text-gray-900 text-center">
                            {repair.receivedAt || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 mb-1 pb-1 text-center">
                            Data Retirada
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 text-gray-900 text-center">
                            {repair.status === "FINALIZADO"
                              ? repair.deadline || "-"
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900  pb-1 text-center">
                            Garantia
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 text-gray-900 text-center">
                            {repair.warranty || "-"}
                          </div>
                        </div>
                      </div>
                      {/* Linha de baixo: 2 caixas */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-bold text-gray-900 mb-1 pb-1 text-center pt-3">
                            Desconto
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 text-gray-900 text-center">
                            {repair.discount && repair.discount > 0
                              ? formatCurrency(repair.discount)
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 mb-1  pb-1 pt-3 text-center">
                            Valor Total
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 text-gray-900 text-base font-bold text-center">
                            {formatCurrency(repair.totalValue)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm">
                    Nenhum eletrodoméstico cadastrado
                  </p>
                )}
              </div>

              {/* Seção: Peças + Observações do Cliente ao lado */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-3 pl-1 pb-2">
                  Peças
                </h3>
                {repair.parts && repair.parts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-14">
                    {/* Tabela de peças (esquerda) */}
                    <div className="overflow-x-auto rounded-lg border border-black">
                      <table className="w-full">
                        <thead className="bg-[#041A2D] text-white text-sm font-semibold">
                          <tr>
                            <th className="text-left p-3">Peças</th>
                            <th className="text-left p-3">Quantidade</th>
                            <th className="text-left p-3">Valor Unitário</th>
                            <th className="text-left p-3">Valor Somado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {repair.parts.map((part, idx) => (
                            <tr
                              key={idx}
                              className="bg-white border-b border-gray-300 text-sm"
                            >
                              <td className="p-3 text-gray-900">
                                {part.name || "-"}
                              </td>
                              <td className="p-3 text-gray-900">
                                {part.quantity || 0}
                              </td>
                              <td className="p-3 text-gray-900">
                                {formatCurrency(part.unitValue)}
                              </td>
                              <td className="p-3 text-gray-900">
                                {formatCurrency(part.totalValue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-blue-800  text-white font-bold text-sm">
                            <td className="p-3">Total</td>
                            <td className="p-3">
                              {repair.parts.reduce(
                                (sum, p) => sum + (p.quantity || 0),
                                0
                              )}
                            </td>
                            <td className="p-3">-</td>
                            <td className="p-3">
                              {formatCurrency(repair.partsTotal)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {/* Observações do Cliente (direita) */}
                    <div className="space-y-3">
                      <div className="text-base font-bold text-gray-900 pl-1 ">
                        Observações do Cliente
                      </div>
                      {repair.appliances && repair.appliances.length > 0 ? (
                        repair.appliances.map((ap, idx) => (
                          <div className="pt-2">
                            <div key={idx} className="bg-white rounded-lg p-4 ">
                              <div className="text-sm font-bold text-gray-900 mb-1">
                                {`Item ${idx + 1} - ${ap.type || "Aparelho"}`}
                              </div>
                              <div className="text-gray-900 text-sm whitespace-pre-wrap">
                                {ap.customerNote &&
                                ap.customerNote.trim().length > 0
                                  ? ap.customerNote
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white rounded-lg p-4 text-sm text-gray-700">
                          Nenhuma observação cadastrada
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm">
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
                    <div className="bg-white rounded-lg p-10  ">
                      <div className="text-sm font-bold text-gray-900 mb-2">
                        Observações do Cliente:
                      </div>
                      <div className="text-gray-900 text-sm whitespace-pre-wrap ">
                        {repair.notes}
                      </div>
                    </div>
                  </div>
                )}

              {/* Observações Técnicas (se houver serviceDescription) */}
              {repair.serviceDescription && (
                <div className="mt-6 pt-5 pr-101 ">
                  <div className="bg-white rounded-lg p-4 ">
                    <div className="text-sm font-bold text-gray-900 mb-2">
                      Observações Técnicas:
                    </div>
                    <div className="text-gray-900 text-sm whitespace-pre-wrap">
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
