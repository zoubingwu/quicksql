import React from "react";
import clsx from "clsx";

export const OptionBoard: React.FC<{
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        className,
        "absolute right-4 top-4 bg-white p-4 shadow border rounded-md min-w-48"
      )}
    >
      {children}
    </div>
  );
};
