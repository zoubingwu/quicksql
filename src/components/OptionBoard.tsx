import React from "react";

export const OptionBoard: React.FC = ({ children }) => {
  return (
    <div className="absolute right-4 top-4 bg-white p-4 shadow-xl rounded-md">
      {children}
    </div>
  );
};
