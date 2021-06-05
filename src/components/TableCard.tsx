import React, { useCallback } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import {
  Icon,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Position,
  EditableText,
} from "@blueprintjs/core";
import { Table } from "../core/Table";
import { useAppDispatch, useAppSelector, actions } from "../store";
import { defaultPosition } from "../store/diagram";
import { ColumnCell } from "./ColumnCell";
import { useHover } from "../hooks/useHover";
import clsx from "clsx";

const MenuPopover: React.FC = () => {
  return (
    <Menu>
      <MenuItem text="Add Column" icon="plus" />
      <MenuItem text="Add Relation" icon="new-link" />
      <MenuDivider />
      <MenuItem text="Clone Table" icon="duplicate" />
      <MenuDivider />
      <MenuItem text="Delete Table" icon="trash" />
    </Menu>
  );
};

export const TableCard: React.FC<{
  data: Table;
}> = ({ data }) => {
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

  const handleFieldNameChange = useCallback(
    (tableId: string, columnId: string, columnName: string) => {
      dispatch(actions.updateColumnName({ tableId, columnId, columnName }));
    },
    []
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
      e.preventDefault();
      e.stopPropagation();
      if (id === selectedTable) return;
      dispatch(actions.setSelected(id));
    },
    [id, selectedTable]
  );

  return (
    <Draggable
      handle=".table-card-handle"
      onStart={handleMoveToTopLayer}
      onStop={handleDrop}
      defaultPosition={defaultPosition}
      position={position}
    >
      <div
        className="table-card absolute w-320px cursor-pointer"
        style={{ zIndex: layer }}
        ref={targetRef}
        onClick={handleClickOnTable}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="table-card-handle font-bold px-2 py-1 flex justify-between cursor-move">
          <EditableText defaultValue={name} onConfirm={handleTableNameChange} />

          <Popover content={<MenuPopover />} position={Position.RIGHT_BOTTOM}>
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
            "w-xs relative shadow-lg border rounded-md bg-white",
            isSelected && "border-blue-400"
          )}
        >
          {columns.map((c) => (
            <ColumnCell
              key={c.name}
              data={c}
              tableId={id}
              onNameChange={handleFieldNameChange}
            />
          ))}
        </div>
      </div>
    </Draggable>
  );
};
