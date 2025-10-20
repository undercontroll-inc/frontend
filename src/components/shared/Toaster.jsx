import { useToastContext } from '../../contexts/ToastContext';
import Toast from './Toast';

const Toaster = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div 
      className="
        fixed top-0 right-0 z-[100] 
        flex max-h-screen w-full flex-col 
        p-4 gap-3
        sm:top-auto sm:bottom-0 sm:max-w-[420px]
        pointer-events-none
      "
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

export default Toaster;
