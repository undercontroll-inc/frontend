import { CheckCircle, XCircle } from 'lucide-react';

const Alert = ({ type, message, onClose }) => {
  if (!message) return null;

  const alertClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const IconComponent = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`border rounded-lg p-4 mb-4 flex items-center gap-3 ${alertClasses[type]} animate-in fade-in duration-300`}>
      <IconComponent className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;