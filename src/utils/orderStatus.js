export const ORDER_STATUSES = [
  "RECEIVED",
  "AWAITING_APPROVAL",
  "IN_REPAIR",
  "READY_FOR_PICKUP",
  "DELIVERED",
];

const LEGACY = {
  PENDING: "RECEIVED",
  IN_ANALYSIS: "RECEIVED",
  COMPLETED: "READY_FOR_PICKUP",
};

const STATUS_INFO = {
  RECEIVED: {
    label: "Em avaliação",
    color: "bg-yellow-100 text-yellow-800",
    chart: "#f59e0b",
  },
  AWAITING_APPROVAL: {
    label: "Aguardando aprovação",
    color: "bg-orange-100 text-orange-800",
    chart: "#ef7f19",
  },
  IN_REPAIR: {
    label: "Em conserto",
    color: "bg-blue-100 text-blue-800",
    chart: "#3b82f6",
  },
  READY_FOR_PICKUP: {
    label: "Pronto para retirada",
    color: "bg-green-100 text-green-800",
    chart: "#10b981",
  },
  DELIVERED: {
    label: "Entregue",
    color: "bg-purple-100 text-purple-800",
    chart: "#7c3aed",
  },
};

export const normalizeStatus = (status) => LEGACY[status] || status;

export const getStatusInfo = (status, outcome) => {
  const normalized = normalizeStatus(status);
  const info = STATUS_INFO[normalized];
  if (!info) {
    return { label: status || "-", color: "bg-gray-100 text-gray-800", chart: "#9ca3af" };
  }
  if (normalized === "READY_FOR_PICKUP" && outcome === "NOT_REPAIRED") {
    return { ...info, label: "Retirada sem conserto", color: "bg-gray-100 text-gray-800" };
  }
  return info;
};

export const getStatusLabel = (status, outcome) => getStatusInfo(status, outcome).label;

export const isFinished = (status) => {
  const normalized = normalizeStatus(status);
  return normalized === "READY_FOR_PICKUP" || normalized === "DELIVERED";
};

export const isOngoing = (status) => {
  const normalized = normalizeStatus(status);
  return normalized === "RECEIVED" || normalized === "AWAITING_APPROVAL" || normalized === "IN_REPAIR";
};

export const STATUS_FILTER_OPTIONS = ORDER_STATUSES.map((status) => ({
  value: status,
  label: STATUS_INFO[status].label,
}));

export const whatsappUrl = (phone, text) => {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  const withCountry = digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(text)}`;
};
