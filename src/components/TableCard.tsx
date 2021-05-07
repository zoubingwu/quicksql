import React from "react";
import Draggable from "react-draggable";
import { Table } from "../core/Table";

export const TableCard: React.FC<{
  data: Table;
}> = ({ data }) => {
  const { name, position, columns } = data;
  return (
    <Draggable>
      <div
        className="absolute shadow-sm border rounded p-2 w-72"
        style={{ left: position?.x, top: position?.y }}
      >
        <div>{name}</div>

        {columns.map((c) => (
          <div key={c.name}>{c.name}</div>
        ))}
      </div>
    </Draggable>
  );
};
