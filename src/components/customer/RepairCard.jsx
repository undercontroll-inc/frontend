import { FileText, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo, useCallback, useMemo } from "react";
import Button from "../shared/Button";

const statusStyles = {
  PENDING: {
    bg: "bg-transparent",
    text: "text-yellow-400",
    border: "border border-yellow-400",
    label: "Pendente",
    icon: <Clock className="h-4 w-4" />,
  },
  IN_ANALYSIS: {
    bg: "bg-transparent",
    text: "text-blue-400",
    border: "border border-blue-400",
    label: "Em Análise",
    icon: <Clock className="h-4 w-4" />,
  },
  COMPLETED: {
    bg: "bg-transparent",
    text: "text-green-400",
    border: "border border-green-400",
    label: "Concluído",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  DELIVERED: {
    bg: "bg-transparent",
    text: "text-green-600",
    border: "border border-green-600",
    label: "Entregue",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

const formatCurrency = (v) => {
  if (v == null) return "-";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatUpdatedAt = (s) => {
  if (!s) return null;
  if (typeof s !== "string") return String(s);
  return s.includes("T") ? s.replace("T", " ") : s;
};

const RepairCard = memo(({ repair }) => {
  const navigate = useNavigate();
  const status = useMemo(
    () => statusStyles[repair.status] || statusStyles["PENDING"],
    [repair.status]
  );

  const handleViewDetails = useCallback(() => {
    navigate(`/repairs/${repair.id}`);
  }, [navigate, repair.id]);

  const formattedUpdatedAt = useMemo(
    () => formatUpdatedAt(repair.updatedAt || repair.updated) || "-",
    [repair.updatedAt, repair.updated]
  );

  const formattedValue = useMemo(
    () => formatCurrency(repair.totalValue),
    [repair.totalValue]
  );

  const appliancesText = useMemo(
    () =>
      repair.appliances?.length > 0
        ? repair.appliances
            .map((a, idx) => `${idx + 1}. ${a.type || "-"}`)
            .join("\n")
        : "-",
    [repair.appliances]
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm dark:shadow-zinc-900/50 overflow-hidden hover:shadow-md dark:hover:shadow-zinc-900/70 transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-[#041A2D] dark:bg-zinc-800 text-white">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">OS:</span>
          <span className="font-semibold">#{`A${repair.id}`}</span>
          <div className="flex items-center gap-2 ml-8">
            <span className="text-sm font-medium">Status:</span>
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} ${status.border} flex items-center gap-1`}
            >
              {status.icon}
              {status.label}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-100 dark:text-gray-300">
          Atualizado: {formattedUpdatedAt}
        </div>
      </div>

      <div className="p-4">
        <div
          className={`grid ${
            repair.status === "COMPLETED" || repair.status === "DELIVERED"
              ? "grid-cols-4"
              : "grid-cols-3"
          } gap-4 text-sm mb-4`}
        >
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">
              Eletrodomésticos
            </div>
            <div className="text-gray-900 dark:text-gray-100 text-sm whitespace-pre-line">
              {appliancesText}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">
              Valor Total
            </div>
            <div className="text-gray-900 dark:text-gray-100 text-sm font-medium">
              {formattedValue}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">
              Recebimento
            </div>
            <div className="text-gray-900 dark:text-gray-100 text-sm">
              {repair.receivedAt || "-"}
            </div>
          </div>
          {(repair.status === "COMPLETED" || repair.status === "DELIVERED") && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">
                Retirada
              </div>
              <div className="text-gray-900 dark:text-gray-100 text-sm">
                {repair.deadline || "-"}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-zinc-700">
          <button
            className="rounded-md p-2 text-white bg-[#0037a7] dark:bg-blue-600 hover:bg-[#002d8a] dark:hover:bg-blue-700 hover:cursor-pointer transition-colors duration-200"
            onClick={handleViewDetails}
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
});

RepairCard.displayName = "RepairCard";

export default RepairCard;
