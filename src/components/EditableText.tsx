import React, { useState, useCallback, useRef } from "react";
import clsx from "clsx";
import { Classes } from "@blueprintjs/core";

export const EditableText: React.FC<{
  onChange?: (value: string) => void;
  value: string;
  className?: string;
}> = ({ value, onChange, className }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);
    },
    []
  );

  const handleStartEditing = useCallback(() => {
    setEditing(true);
    setTimeout(() => ref.current && ref.current.focus());
  }, [ref.current]);

  const handleFinishEditing = useCallback(() => {
    setEditing(false);
    onChange && onChange(val);
  }, [val]);

  return editing ? (
    <input
      type="text"
      ref={ref}
      className={clsx(className, Classes.INPUT, Classes.SMALL)}
      value={val}
      onBlur={handleFinishEditing}
      onChange={handleInputChange}
    />
  ) : (
    <div onClick={handleStartEditing} className={clsx(className, "h-6")}>
      {val}
    </div>
  );
};
