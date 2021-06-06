import React, { useCallback } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import clsx from "clsx";
import {
  Icon,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Position,
  EditableText,
} from "@blueprintjs/core";
import { DEFAULT_TABLE_POSITION, Table } from "../core/Table";
import { useAppDispatch, useAppSelector, actions } from "../store";
import { ColumnCell } from "./ColumnCell";
import { useHover } from "../hooks/useHover";

const MenuPopover: React.FC<{
  tableId: string;
}> = ({ tableId }) => {
  const dispatch = useAppDispatch();
  const handleAddNewColumn = useCallback(() => {
    dispatch(actions.addNewColumn(tableId));
  }, [tableId]);
  const handleDeleteTable = useCallback(() => {
    dispatch(actions.deleteTable(tableId));
  }, [tableId]);
  const handleDuplicateTable = useCallback(() => {
    dispatch(actions.duplicateTable(tableId));
  }, [tableId]);

  return (
    <Menu>
      <MenuItem text="Add Column" icon="plus" onClick={handleAddNewColumn} />
      <MenuDivider />
      <MenuItem
        text="Duplicate Table"
        icon="duplicate"
        onClick={handleDuplicateTable}
      />
      <MenuDivider />
      <MenuItem
        text="Delete Table"
        icon="trash"
        onClick={handleDeleteTable}
        intent="danger"
      />
    </Menu>
  );
};

export const TableCard: React.FC<{
  data: Table;
}> = React.memo(({ data }) => {
  const { id, name, position, columns, layer } = data;
  const [targetRef, isHovering] = useHover<HTMLDivElement>();
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(
    (state) => state.diagram.selectedTable === id
  );
  const maxLayer = useAppSelector((state) => state.diagram.layers);
  const selectedTable = useAppSelector((state) => state.diagram.selectedTable);
  const handleDrop = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      if (data.x === position.x && data.y === position.y) return;
      const payload = {
        id,
        position: {
          x: data.x,
          y: data.y,
        },
      };
      dispatch(actions.updatePosition(payload));
    },
    [id, position]
  );

  const handleTableNameChange = useCallback(
    (value: string) => {
      if (value === name) return;
      dispatch(actions.updateTableName({ id, name: value }));
    },
    [id, name]
  );

  const handleMoveToTopLayer = useCallback(() => {
    if (layer === maxLayer) return;
    dispatch(actions.setTopLayer(id));
  }, [id, layer, maxLayer]);

  const handleClickOnTable = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (id === selectedTable) return;
      dispatch(actions.setSelected(id));
    },
    [id, selectedTable]
  );

  return (
    <Draggable
      handle=".quicksql-table-card-handle"
      onStart={handleMoveToTopLayer}
      onStop={handleDrop}
      defaultPosition={DEFAULT_TABLE_POSITION}
      position={position}
    >
      <div
        className="quicksql-table-card absolute w-320px cursor-pointer"
        style={{ zIndex: layer }}
        ref={targetRef}
        onClick={handleClickOnTable}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="quicksql-table-card-handle font-bold px-2 py-1 flex justify-between cursor-move">
          <EditableText
            value={name}
            placeholder="edit table name"
            onChange={handleTableNameChange}
          />

          <Popover
            content={<MenuPopover tableId={id} />}
            position={Position.RIGHT_BOTTOM}
          >
            <Icon
              icon="menu"
              className={clsx(
                "cursor-pointer",
                !isHovering && !isSelected && "!hidden"
              )}
            />
          </Popover>
        </div>

        <div
          className={clsx(
            "quicksql-table-column",
            "w-xs relative shadow-lg border rounded-md bg-white",
            isSelected && "border-light-blue-600"
          )}
        >
          {columns.map((c) => (
            <ColumnCell key={c.name} data={c} />
          ))}
        </div>
      </div>
    </Draggable>
  );
});
