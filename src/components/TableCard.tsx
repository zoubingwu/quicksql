import React, { useCallback, useRef, useState } from "react";
import Draggable from "react-draggable";
import clsx from "clsx";
import { Icon, Classes } from "@blueprintjs/core";
import { Column } from "../core/Column";
import { Table } from "../core/Table";

export const TextInput: React.FC<{
  onChange?: (value: string) => void;
  value: string;
}> = ({ value, onChange }) => {
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
      className={clsx(Classes.INPUT, Classes.SMALL)}
      value={val}
      onBlur={handleFinishEditing}
      onChange={handleInputChange}
    />
  ) : (
    <div onClick={handleStartEditing} className="h-6">
      {val}
    </div>
  );
};

export const ColumnCell: React.FC<{
  data: Column;
}> = ({ data }) => {
  const { name } = data;

  return (
    <div className="px-2 py-1">
      <TextInput value={name} />
    </div>
  );
};

export const TableCard: React.FC<{
  data: Table;
}> = ({ data }) => {
  const { name, position, columns } = data;

  return (
    <Draggable handle=".handle">
      <div
        style={{ left: position?.x, top: position?.y }}
        className="absolute w-320px "
      >
        <div className="font-bold px-2 py-1 flex justify-between">
          <TextInput value={name} />
          <Icon
            icon="drag-handle-horizontal"
            size={100}
            className="handle cursor-drag cursor-move"
          />
        </div>

        <div className="w-xs relative shadow-lg border rounded-lg">
          {columns.map((c) => (
            <ColumnCell key={c.name} data={c} />
          ))}
        </div>
      </div>
    </Draggable>
  );
};
