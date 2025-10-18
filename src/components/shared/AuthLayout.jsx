import React from "react";

const AuthLayout = ({ children, maxWidth = "md" }) => {
  const widthClass = maxWidth === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`w-full ${widthClass} flex items-center justify-center`}>
        <div className="bg-white border border-gray-200 rounded-xl gap-3 p-8 shadow-lg h-full flex flex-col justify-center w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
