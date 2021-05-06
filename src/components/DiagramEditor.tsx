import React from "react";
import { useAppSelector } from "../store";
import { OptionBoard } from "./OptionBoard";
import { TableCard } from "./TableCard";

export const DiagramEditor: React.FC = () => {
  const tables = useAppSelector((state) => state.diagram.tables);

  return (
    <div className="flex-auto relative w-1/2">
      <OptionBoard>
        <button>Add Table</button>
      </OptionBoard>
      {tables.map((t) => (
        <TableCard data={t} />
      ))}
    </div>
  );
};
