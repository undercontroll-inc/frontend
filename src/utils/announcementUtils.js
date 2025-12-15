/**
 * Announcement Types - Backend Enum Values
 */
export const ANNOUNCEMENT_TYPES = {
  PROMOTIONS: 'PROMOTIONS',
  HOLIDAY: 'HOLIDAY',
  WARNINGS: 'WARNINGS',
  RECOMMENDATIONS: 'RECOMMENDATIONS',
  UPDATES: 'UPDATES',
};

/**
 * Mapeamento de tipos do backend para português
 */
export const ANNOUNCEMENT_TYPE_LABELS = {
  [ANNOUNCEMENT_TYPES.PROMOTIONS]: 'Promoções',
  [ANNOUNCEMENT_TYPES.HOLIDAY]: 'Feriados',
  [ANNOUNCEMENT_TYPES.WARNINGS]: 'Avisos',
  [ANNOUNCEMENT_TYPES.RECOMMENDATIONS]: 'Recomendações',
  [ANNOUNCEMENT_TYPES.UPDATES]: 'Atualizações',
};

/**
 * Configurações de cores por tipo de anúncio
 */
const ANNOUNCEMENT_COLORS = {
  [ANNOUNCEMENT_TYPES.PROMOTIONS]: 'orange',
  [ANNOUNCEMENT_TYPES.HOLIDAY]: 'purple',
  [ANNOUNCEMENT_TYPES.WARNINGS]: 'blue',
  [ANNOUNCEMENT_TYPES.RECOMMENDATIONS]: 'green',
  [ANNOUNCEMENT_TYPES.UPDATES]: 'cyan',
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
  return ANNOUNCEMENT_COLORS[type] || 'orange';
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
      bg: 'from-[#ba5c00] to-[#d45012]',
      border: 'border-[#ba5c00]',
      badge: 'bg-white text-[#ba5c00]',
    },
    blue: {
      bg: 'from-[#041A2D] to-[#052540]',
      border: 'border-[#0B4BCC]',
      badge: 'bg-[#0B4BCC] text-white',
    },
    green: {
      bg: 'from-[#047857] to-[#065f46]',
      border: 'border-[#10b981]',
      badge: 'bg-[#10b981] text-white',
    },
    purple: {
      bg: 'from-[#6B21A8] to-[#7C3AED]',
      border: 'border-[#9333EA]',
      badge: 'bg-[#9333EA] text-white',
    },
    cyan: {
      bg: 'from-[#0E7490] to-[#0891B2]',
      border: 'border-[#06B6D4]',
      badge: 'bg-[#06B6D4] text-white',
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
    'Promoções': ANNOUNCEMENT_TYPES.PROMOTIONS,
    'Feriados': ANNOUNCEMENT_TYPES.HOLIDAY,
    'Avisos': ANNOUNCEMENT_TYPES.WARNINGS,
    'Recomendações': ANNOUNCEMENT_TYPES.RECOMMENDATIONS,
    'Atualizações': ANNOUNCEMENT_TYPES.UPDATES,
  };

  return migrationMap[oldCategory] || ANNOUNCEMENT_TYPES.UPDATES;
};
