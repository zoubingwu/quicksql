import React from "react";
import clsx from "clsx";

export const Button: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ children, className, onClick }) => {
  return (
    <button
      className={clsx(
        className,
        "border border-gray-300 rounded flex flex-row items-center justify-center align-middle min-h-8"
      )}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
};
