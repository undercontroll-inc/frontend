import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

/**
 * @param {string} to - Rota de destino (opcional)
 * @param {function} onClick - Handler de clique customizado (opcional)
 * @param {string} className - Classes CSS adicionais (opcional)
 * @param {string} ariaLabel - Label de acessibilidade (padrão: "Voltar")
 * @param {string} variant - Variante do botão (padrão: "outline")
 *   - "outline": Estilo padrão com borda
 *   - "primary": Fundo escuro para fundos claros
 *   - "light": Fundo claro para fundos escuros (recomendado para bg escuros)
 */
export default function ComeBack({ to, onClick, className = "", ariaLabel = "Voltar", variant = "outline" }) {
  const navigate = useNavigate?.();

  // Define os estilos base e variantes
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[#041A2D] hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 cursor-pointer",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 cursor-pointer",
    danger: "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 cursor-pointer",
    outline: "border-2 border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white cursor-pointer",
    light: "bg-white hover:bg-gray-50 text-[#041A2D] border-2 border-white cursor-pointer"
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.outline} ${className}`;

  if (to && !onClick) {
    return (
      <Link to={to} aria-label={ariaLabel} className="inline-block">
        <button className={buttonClasses}>
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </button>
      </Link>
    );
  }

  // Otherwise render a button that calls onClick or falls back to navigate(-1)
  const handleClick = (e) => {
    if (onClick) return onClick(e);
    if (navigate) return navigate(-1);
    // If no navigate available, try history.back as final fallback
    if (typeof window !== "undefined" && window.history && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={buttonClasses}
      aria-label={ariaLabel}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Voltar</span>
    </button>
  );
}
