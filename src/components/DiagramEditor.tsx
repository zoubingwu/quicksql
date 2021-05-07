import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addTable } from "../store/diagram";
import { OptionBoard } from "./OptionBoard";
import { TableCard } from "./TableCard";
import { Button } from "./UIKit";

export const DiagramEditor: React.FC = () => {
  const tables = useAppSelector((state) => state.diagram.tables);
  const dispatch = useAppDispatch();

  const handleAddTableButtonClick = useCallback(() => {
    dispatch(addTable());
  }, []);

  return (
    <div className="flex-shrink-0 flex-grow-0 relative w-1/2">
      <OptionBoard>
        <Button className="w-full" onClick={handleAddTableButtonClick}>
          Add Table
        </Button>
      </OptionBoard>
      {tables.map((t) => (
        <TableCard data={t} key={t.name} />
      ))}
    </div>
  );
};
