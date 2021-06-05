import React, { useCallback } from "react";
import { EditableText } from "@blueprintjs/core";
import { Column } from "../core/Column";

export const ColumnCell: React.FC<{
  data: Column;
  tableId: string;
  onNameChange: (tableId: string, columnId: string, columnName: string) => void;
}> = ({ data, onNameChange, tableId }) => {
  const { id, name } = data;

  const handleNameChange = useCallback(
    (value: string) => {
      if (value === name) return;
      onNameChange(tableId, id, name);
    },
    [tableId, id]
  );

  return (
    <div className="quicksql-column-cell px-2 py-1 flex flex-row items-center justify-between">
      <EditableText defaultValue={name} onConfirm={handleNameChange} />
    </div>
  );
};
