import React from "react";
import clsx from "clsx";

export const Button: React.FC<{
  className?: string;
}> = ({ children, className }) => {
  return (
    <button
      className={clsx(
        className,
        "border border-gray-300 rounded flex flex-row items-center content-center align-middle min-h-8"
      )}
    >
      <span>{children}</span>
    </button>
  );
};
