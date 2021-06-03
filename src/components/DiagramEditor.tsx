import React, { useCallback } from "react";
import clsx from "clsx";
import { ContextMenu, Menu, MenuItem } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector, actions } from "../store";
import { TableCard } from "./TableCard";
import { PropertyEditor } from "./PropertyEditor";

export const DiagramEditor: React.FC = () => {
  const tables = useAppSelector((state) => state.diagram.tables);
  const showCode = useAppSelector((state) => state.globalOptions.showCode);
  const dispatch = useAppDispatch();

  const handleAddTable = useCallback(() => {
    dispatch(actions.addTable());
  }, []);

  const handleClickEmptyArea = useCallback(() => {
    dispatch(actions.setSelected(null));
  }, []);

  return (
    <div
      className={clsx(
        "diagram-editor flex-shrink-0 flex-grow-0 overflow-hidden relative transition-all",
        showCode ? "w-2/3" : "w-full"
      )}
      onClick={handleClickEmptyArea}
    >
      <ContextMenu
        className="w-full h-full"
        content={
          <Menu>
            <MenuItem
              text="Add Table"
              onClick={handleAddTable}
              icon="duplicate"
            />
          </Menu>
        }
      >
        {Object.values(tables).map((t) => (
          <TableCard data={t} key={t.id} />
        ))}
        <PropertyEditor />
      </ContextMenu>
    </div>
  );
};
