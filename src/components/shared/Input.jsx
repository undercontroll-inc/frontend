import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      success,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const inputClasses = `
    w-full px-5 py-4 h-10
    border rounded-lg 
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100 
    placeholder-gray-500 dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-offset-1
    dark:focus:ring-offset-gray-900
    transition-all duration-200 text-base
    ${
      error
        ? "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900"
        : success
        ? "border-green-300 dark:border-green-800 focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-900"
        : "border-gray-300 dark:border-gray-600 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-slate-200 dark:focus:ring-slate-800"
    }
    ${isPassword ? "pr-14" : "pr-5"}
    ${className}
  `;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
