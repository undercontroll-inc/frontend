import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
