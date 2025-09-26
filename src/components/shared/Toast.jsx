import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 150);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getToastStyles = () => {
    const baseStyles = "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-green-200 bg-white text-green-950`;
      case 'error':
        return `${baseStyles} border-red-200 bg-white text-red-950`;
      case 'warning':
        return `${baseStyles} border-yellow-200 bg-white text-yellow-950`;
      case 'info':
        return `${baseStyles} border-blue-200 bg-white text-blue-950`;
      default:
        return `${baseStyles} border-gray-200 bg-white text-gray-950`;
    }
  };

  const getProgressBarStyles = () => {
    switch (toast.type) {
      case 'success':
        return "bg-green-600";
      case 'error':
        return "bg-red-600";
      case 'warning':
        return "bg-yellow-600";
      case 'info':
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`max-w-sm w-full rounded-lg bg-white pointer-events-auto shadow-xl border border-gray-200 ring-1 ring-black/5 overflow-hidden transform transition-all duration-300 ease-in-out group hover:shadow-2xl
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      tabIndex={0}
    >
      <div className={getToastStyles() + ' py-4 px-5'}>
        <div className="flex items-start space-x-4 w-full">
          <div className="pt-0.5">{getIcon()}</div>
          <div className="flex-1 items-center min-w-0">
            {toast.title && (
              <div className="text-sm font-bold leading-tight mb-0.5">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm text-gray-700 opacity-90">{toast.description}</div>
            )}
            {toast.action && (
              <div className="mt-3">{toast.action}</div>
            )}
          </div>
          <button
            onClick={handleRemove}
            aria-label="Close notification"
            className="ml-2 rounded-md p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      {toast.duration > 0 && (
        <div className="h-1 w-full bg-gray-100">
          <div
            className={`h-full ${getProgressBarStyles()} transition-all ease-linear`}
            style={{
              animationDuration: `${toast.duration}ms`,
              animationName: 'progress',
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
            }}
          />
        </div>
      )}
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
