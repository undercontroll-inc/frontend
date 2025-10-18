import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 200);
  };

  const getVariantStyles = () => {
    const variants = {
      success: {
        container: 'border-green-500/50 bg-white',
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        iconBg: 'bg-green-50',
      },
      error: {
        container: 'border-red-500/50 bg-white',
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        iconBg: 'bg-red-50',
      },
      warning: {
        container: 'border-yellow-500/50 bg-white',
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        iconBg: 'bg-yellow-50',
      },
      info: {
        container: 'border-blue-500/50 bg-white',
        icon: <Info className="h-5 w-5 text-blue-600" />,
        iconBg: 'bg-blue-50',
      },
      default: {
        container: 'border-gray-200 bg-white',
        icon: <Info className="h-5 w-5 text-gray-600" />,
        iconBg: 'bg-gray-50',
      },
    };

    return variants[toast.type] || variants.default;
  };

  const variant = getVariantStyles();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg
        transition-all duration-200 ease-out
        ${variant.container}
        ${isVisible && !isRemoving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        hover:shadow-xl
      `}
    >
      <div className={`flex-shrink-0 rounded-md p-2 ${variant.iconBg}`}>
        {variant.icon}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        {toast.title && (
          <div className="text-sm font-semibold leading-none tracking-tight text-gray-900">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm leading-relaxed text-gray-600">
            {toast.description}
          </div>
        )}
        {toast.action && (
          <div className="mt-2 pt-1">
            {toast.action}
          </div>
        )}
      </div>

      <button
        onClick={handleRemove}
        aria-label="Fechar notificação"
        className="
          absolute right-1.5 top-1.5 flex-shrink-0 rounded-md p-1 
          text-gray-400 hover:text-gray-600
          opacity-0 transition-all group-hover:opacity-100
          focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
        "
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
