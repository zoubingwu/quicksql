import React, { useCallback } from "react";
import { Button, Tooltip } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector } from "../store";
import { addTable } from "../store/diagram";
import { TableCard } from "./TableCard";

export const DiagramEditor: React.FC = () => {
  const tables = useAppSelector((state) => state.diagram.tables);
  const dispatch = useAppDispatch();

  const handleAddTableButtonClick = useCallback(() => {
    dispatch(addTable());
  }, []);

  return (
    <div className="flex-shrink-0 flex-grow-0 relative w-1/2">
      <Tooltip content="Add New Table" className="absolute right-4 top-4">
        <Button icon="cube-add" onClick={handleAddTableButtonClick} />
      </Tooltip>
      {tables.map((t) => (
        <TableCard data={t} key={t.name} />
      ))}
    </div>
  );
};
