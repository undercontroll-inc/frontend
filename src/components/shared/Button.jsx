import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      primary:
        "bg-[#041A2D] hover:bg-slate-700 text-white focus:ring-slate-900",
      secondary:
        "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      outline:
        "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm h-10",
      md: "px-6 py-4 text-base h-12",
      lg: "px-8 py-5 text-lg h-14",
    };

    const disabledClasses =
      disabled || loading ? "opacity-50 cursor-not-allowed" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
