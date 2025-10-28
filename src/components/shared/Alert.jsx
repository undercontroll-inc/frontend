import { CheckCircle, XCircle } from 'lucide-react';

const Alert = ({ type, message, onClose }) => {
  if (!message) return null;

  const alertClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  };

  const IconComponent = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`border rounded-lg p-4 mb-4 flex items-center gap-3 ${alertClasses[type]} animate-in fade-in duration-300 transition-colors`}>
      <IconComponent className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;