import React from "react";

const AuthLayout = ({ children, maxWidth = "md" }) => {
  const widthClass = maxWidth === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className={`w-full ${widthClass} flex items-center justify-center`}>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl gap-3 p-8 shadow-lg dark:shadow-gray-900/50 h-full flex flex-col justify-center w-full transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
