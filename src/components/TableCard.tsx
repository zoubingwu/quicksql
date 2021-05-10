import React, { useCallback } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Icon, Popover, Position } from "@blueprintjs/core";
import { Table } from "../core/Table";
import { useAppDispatch } from "../store";
import {
  defaultPosition,
  updateFiledName,
  updatePosition,
  updateTableName,
  setTopLayer,
} from "../store/diagram";
import { EditableText } from "./EditableText";
import { ColumnCell } from "./ColumnCell";

export const TableCard: React.FC<{
  data: Table;
}> = ({ data }) => {
  const { id, name, position, columns, layer } = data;
  const dispatch = useAppDispatch();

  const handleDrop = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      const payload = {
        id,
        position: {
          x: data.x,
          y: data.y,
        },
      };
      dispatch(updatePosition(payload));
    },
    [id]
  );

  const handleTableNameChange = useCallback(
    (name: string) => {
      dispatch(updateTableName({ id, name }));
    },
    [id]
  );

  const handleFieldNameChange = useCallback(
    (tableId: string, columnId: string, columnName: string) => {
      dispatch(updateFiledName({ tableId, columnId, columnName }));
    },
    []
  );

  const handleMoveToTopLayer = useCallback(() => {
    dispatch(setTopLayer(id));
  }, [id]);

  return (
    <Draggable
      handle=".handle"
      onStart={handleMoveToTopLayer}
      onStop={handleDrop}
      defaultPosition={defaultPosition}
      position={position}
    >
      <div className="absolute w-320px" style={{ zIndex: layer }}>
        <div className="handle font-bold px-2 py-1 flex justify-between cursor-move">
          <EditableText
            value={name}
            className="cursor-text"
            onChange={handleTableNameChange}
          />

          <Popover content={"TODO"} position={Position.BOTTOM_LEFT}>
            <Icon icon="more" className="cursor-default" />
          </Popover>
        </div>

        <div className="w-xs relative shadow-lg border rounded-lg bg-white">
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
