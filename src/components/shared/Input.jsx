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
    border rounded-lg bg-white text-gray-900 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-offset-1
    transition-all duration-200 text-base
    ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : success
        ? "border-green-300 focus:border-green-500 focus:ring-green-200"
        : "border-gray-300 focus:border-slate-500 focus:ring-slate-200"
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
