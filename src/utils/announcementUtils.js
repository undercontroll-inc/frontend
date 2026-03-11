// removed unused import to satisfy lint rules

/**
 * Announcement Types - Backend Enum Values
 */
export const ANNOUNCEMENT_TYPES = {
  PROMOTIONS: "PROMOTIONS",
  HOLIDAY: "HOLIDAY",
  WARNINGS: "WARNINGS",
  RECOMMENDATIONS: "RECOMMENDATIONS",
  UPDATES: "UPDATES",
};

/**
 * Mapeamento de tipos do backend para português
 */
export const ANNOUNCEMENT_TYPE_LABELS = {
  [ANNOUNCEMENT_TYPES.PROMOTIONS]: "Promoções",
  [ANNOUNCEMENT_TYPES.HOLIDAY]: "Feriados",
  [ANNOUNCEMENT_TYPES.WARNINGS]: "Avisos",
  [ANNOUNCEMENT_TYPES.RECOMMENDATIONS]: "Recomendações",
  [ANNOUNCEMENT_TYPES.UPDATES]: "Atualizações",
};

/**
 * Configurações de cores por tipo de anúncio
 */
const ANNOUNCEMENT_COLORS = {
  [ANNOUNCEMENT_TYPES.PROMOTIONS]: "orange",
  [ANNOUNCEMENT_TYPES.HOLIDAY]: "purple",
  [ANNOUNCEMENT_TYPES.WARNINGS]: "blue",
  [ANNOUNCEMENT_TYPES.RECOMMENDATIONS]: "green",
  [ANNOUNCEMENT_TYPES.UPDATES]: "cyan",
};

/**
 * Obtém a label em português para um tipo de anúncio
 * @param {string} type - Tipo do anúncio (backend enum)
 * @returns {string} Label em português
 */
export const getAnnouncementLabel = (type) => {
  return ANNOUNCEMENT_TYPE_LABELS[type] || type;
};

/**
 * Obtém a cor associada a um tipo de anúncio
 * @param {string} type - Tipo do anúncio (backend enum)
 * @returns {string} Nome da cor
 */
export const getAnnouncementColor = (type) => {
  return ANNOUNCEMENT_COLORS[type] || "orange";
};

/**
 * Obtém os estilos CSS para um tipo de anúncio baseado na cor
 * @param {string} type - Tipo do anúncio (backend enum)
 * @returns {object} Objeto com classes CSS para bg, border e badge
 */
export const getAnnouncementStyles = (type) => {
  const color = getAnnouncementColor(type);

  const styleMap = {
    orange: {
      // bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10',
      bg: "gray-50 dark:from-orange-950/20 dark:to-orange-900/10",
      border: "border-l-4 border-[#ba5c00]",
      badge: "bg-[#ba5c00] text-white",
      text: "text-gray-900 dark:text-gray-100",
    },
    blue: {
      bg: "gray-50 dark:from-blue-950/20 dark:to-blue-900/10",
      border: "border-l-4 border-[#0B4BCC]",
      badge: "bg-[#0B4BCC] text-white",
      text: "text-gray-900 dark:text-gray-100",
    },
    green: {
      bg: "gray-50 dark:from-emerald-950/20 dark:to-emerald-900/10",
      border: "border-l-4 border-[#10b981]",
      badge: "bg-[#10b981] text-white",
      text: "text-gray-900 dark:text-gray-100",
    },
    purple: {
      bg: "gray-50 dark:from-purple-950/20 dark:to-purple-900/10",
      border: "border-l-4 border-[#9333EA]",
      badge: "bg-[#9333EA] text-white",
      text: "text-gray-900 dark:text-gray-100",
    },
    cyan: {
      bg: "gray-50 dark:from-cyan-950/20 dark:to-cyan-900/10",
      border: "border-l-4 border-[#06B6D4]",
      badge: "bg-[#06B6D4] text-white",
      text: "text-gray-900 dark:text-gray-100",
    },
  };

  return styleMap[color] || styleMap.orange;
};

/**
 * Lista de opções para select/dropdown de tipos de anúncios
 * @returns {Array} Array de objetos com value (backend) e label (português)
 */
export const getAnnouncementTypeOptions = () => {
  return Object.values(ANNOUNCEMENT_TYPES).map((type) => ({
    value: type,
    label: ANNOUNCEMENT_TYPE_LABELS[type],
  }));
};

/**
 * Converte tipo antigo (português) para novo tipo (backend enum)
 * Útil para migração de dados existentes
 * @param {string} oldCategory - Categoria antiga em português
 * @returns {string} Tipo do backend
 */
export const migrateOldCategory = (oldCategory) => {
  const migrationMap = {
    Promoções: ANNOUNCEMENT_TYPES.PROMOTIONS,
    Feriados: ANNOUNCEMENT_TYPES.HOLIDAY,
    Avisos: ANNOUNCEMENT_TYPES.WARNINGS,
    Recomendações: ANNOUNCEMENT_TYPES.RECOMMENDATIONS,
    Atualizações: ANNOUNCEMENT_TYPES.UPDATES,
  };

  return migrationMap[oldCategory] || ANNOUNCEMENT_TYPES.UPDATES;
};
