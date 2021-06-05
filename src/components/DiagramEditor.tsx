import React, { useCallback } from "react";
import clsx from "clsx";
import { ContextMenu, Menu, MenuItem } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector, actions } from "../store";
import { TableCard } from "./TableCard";
import { PropertyEditor } from "./PropertyEditor";

export const DiagramEditor: React.FC = () => {
  const tables = useAppSelector((state) => state.diagram.tables);
  const showCode = useAppSelector((state) => state.globalOptions.showCode);
  const popoverOpened = useAppSelector(
    (state) => state.globalOptions.propertyEditroPopoverOpened
  );
  const dispatch = useAppDispatch();

  const handleAddTable = useCallback(() => {
    dispatch(actions.addNewTable());
  }, []);

  const handleClickEmptyArea = useCallback(() => {
    if (popoverOpened) return;
    dispatch(actions.setSelected(null));
  }, [popoverOpened]);

  return (
    <div
      className={clsx(
        "quicksql-diagram-editor flex-shrink-0 flex-grow-0 overflow-hidden relative transition-all",
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
