import { useState } from "react";
import { Copy, ExternalLink, MessageCircle } from "lucide-react";
import Button from "../shared/Button";
import RepairService from "../../services/RepairService";
import { useToast } from "../../contexts/ToastContext";
import { getStatusInfo, normalizeStatus, whatsappUrl } from "../../utils/orderStatus";

const ACTIONS = {
  RECEIVED: [
    { key: "sendBudget", label: "Enviar orçamento", variant: "primary" },
    { key: "transition", to: "READY_FOR_PICKUP", outcome: "NOT_REPAIRED", label: "Devolver sem conserto", variant: "outline", confirm: "Devolver o aparelho sem conserto?" },
  ],
  AWAITING_APPROVAL: [
    { key: "decide", decision: "APPROVED", label: "Cliente aprovou", variant: "primary" },
    { key: "decide", decision: "DECLINED", label: "Cliente recusou", variant: "outline", confirm: "Registrar que o cliente recusou o conserto?" },
    { key: "transition", to: "RECEIVED", label: "Refazer orçamento", variant: "outline" },
    { key: "link", label: "Reenviar link", variant: "outline" },
  ],
  IN_REPAIR: [
    { key: "transition", to: "READY_FOR_PICKUP", outcome: "REPAIRED", label: "Conserto concluído", variant: "primary" },
    { key: "transition", to: "READY_FOR_PICKUP", outcome: "NOT_REPAIRED", label: "Não foi possível consertar", variant: "outline", confirm: "Marcar que não foi possível consertar?" },
  ],
  READY_FOR_PICKUP: [
    { key: "transition", to: "DELIVERED", label: "Marcar como entregue", variant: "primary" },
    { key: "link", label: "Avisar cliente", variant: "outline" },
  ],
  DELIVERED: [],
};

const formatMoney = (value) =>
  value == null ? "-" : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (value) => (value ? new Date(value).toLocaleString("pt-BR") : "-");

export const OrderStatusActions = ({ repair, phone, disabled, onChanged }) => {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const status = normalizeStatus(repair.status);
  const info = getStatusInfo(repair.status, repair.outcome);

  const run = async (action) => {
    if (action.confirm && !window.confirm(action.confirm)) {
      return;
    }
    setBusy(true);
    try {
      if (action.key === "sendBudget") {
        const result = await RepairService.sendBudget(repair.id);
        setMessage(result);
        toast.success("Orçamento pronto para enviar ao cliente");
        await onChanged?.(result.order);
      } else if (action.key === "decide") {
        const order = await RepairService.decideBudget(repair.id, action.decision);
        toast.success(action.decision === "APPROVED" ? "Aprovação registrada" : "Recusa registrada");
        await onChanged?.(order);
      } else if (action.key === "transition") {
        const order = await RepairService.transitionOrder(repair.id, { to: action.to, outcome: action.outcome ?? null });
        toast.success(`Status alterado para ${getStatusInfo(order.status, order.outcome).label}`);
        await onChanged?.(order);
      } else if (action.key === "link") {
        setMessage(await RepairService.trackingLink(repair.id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Não foi possível atualizar a ordem");
      if (error?.response?.data?.code === "ORDER_CONCURRENT_UPDATE") {
        await onChanged?.();
      }
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const whatsapp = message ? whatsappUrl(phone, message.whatsappText) : null;

  return (
    <div className="space-y-3">
      <span className={`inline-flex items-center px-3 py-2 rounded-lg font-medium ${info.color}`}>{info.label}</span>

      {repair.budgetTotal != null && (
        <p className="text-sm text-gray-700 dark:text-zinc-300">
          Orçamento: <strong>{formatMoney(repair.budgetTotal)}</strong>
          {repair.approvalDecision && repair.approvalDecision !== "PENDING" && (
            <>
              {" · "}
              {repair.approvalDecision === "APPROVED" ? "aprovado" : "recusado"}
              {repair.decidedVia === "CUSTOMER_LINK" ? " pelo cliente no link" : " pela loja"} em {formatDate(repair.decidedAt)}
            </>
          )}
        </p>
      )}

      {!disabled && (ACTIONS[status] || []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ACTIONS[status].map((action) => (
            <Button key={action.label} variant={action.variant} disabled={busy} onClick={() => run(action)}>
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-gray-200 dark:border-zinc-800 p-3 space-y-2">
          <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-zinc-200">{message.whatsappText}</p>
          <div className="flex flex-wrap gap-2">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
              >
                <MessageCircle className="h-4 w-4" /> Enviar no WhatsApp
              </a>
            )}
            <Button variant="outline" onClick={() => copy(message.whatsappText)}>
              <Copy className="h-4 w-4 mr-1" /> Copiar mensagem
            </Button>
            <a
              href={message.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border text-sm"
            >
              <ExternalLink className="h-4 w-4" /> Abrir página do cliente
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusActions;
