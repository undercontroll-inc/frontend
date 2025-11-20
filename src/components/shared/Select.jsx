import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  (
    {
      children,
      label,
      error,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`relative ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full pl-3 pr-10 py-2 border rounded-lg 
            bg-[#041A2D] dark:bg-zinc-900 
            hover:bg-slate-700 dark:hover:bg-zinc-800 
            text-white dark:text-zinc-100
            focus:outline-none focus:ring-2 
            focus:ring-gray-100 dark:focus:ring-zinc-700
            appearance-none cursor-pointer transition-colors ${
              error
                ? "border-red-500 dark:border-red-800 focus:ring-red-500 dark:focus:ring-red-900"
                : "border-gray-600 dark:border-zinc-700 hover:border-gray-500 dark:hover:border-zinc-600"
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white dark:text-zinc-300 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
