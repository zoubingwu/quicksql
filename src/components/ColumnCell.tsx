import React, { useCallback } from "react";
import { Column } from "../core/Column";
import { EditableText } from "./EditableText";

export const ColumnCell: React.FC<{
  data: Column;
  tableId: string;
  onNameChange: (tableId: string, columnId: string, columnName: string) => void;
}> = ({ data, onNameChange, tableId }) => {
  const { id, name } = data;

  const handleNameChange = useCallback(
    (name: string) => {
      onNameChange(tableId, id, name);
    },
    [tableId, id]
  );

  return (
    <div className="px-2 py-1">
      <EditableText value={name} onChange={handleNameChange} />
    </div>
  );
};
