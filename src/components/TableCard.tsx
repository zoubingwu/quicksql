import React, { useCallback } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import clsx from "clsx";
import {
  Icon,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Position as BlueprintPosition,
  EditableText,
} from "@blueprintjs/core";
import { Table } from "../core/Table";
import { Position } from "../core/Position";
import { useAppDispatch, useAppSelector, actions } from "../store";
import { ColumnCell } from "./ColumnCell";
import { useHover } from "../hooks/useHover";
import {
  TABLE_CARD_HANDLE_HEIGHT,
  TABLE_CARD_WIDTH,
} from "../store/diagram.helpers";

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

export interface TableCardPostMessageData {
  type: "quicksql/dragging" | "quicksql/drop";

  /**
   * id of the relation being affected
   */
  rid: string;

  /**
   * id of the table being dragged
   */
  tid: string;

  /**
   * table card position when dragging
   */
  position: Position;
}

const TableCard: React.FC<{
  data: Table;
}> = ({ data }) => {
  const { id, name, columns, layer } = data;
  const position = useAppSelector((state) => state.diagram.positions[id]);
  const [targetRef, isHovering] = useHover<HTMLDivElement>();
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(
    (state) => state.diagram.selectedTable === id
  );
  const creatingCurve = useAppSelector(
    (state) => state.diagram.creatingRelationCurve
  );
  const relations = useAppSelector((state) =>
    Object.values(state.diagram.relations).filter((r) =>
      columns.some((c) => c.id === r.fromColumnId || c.id === r.toColumnId)
    )
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

      relations.forEach((r) => {
        window.postMessage(
          {
            type: "quicksql/drop",
            tid: id,
            rid: r.id,
            position: {
              x: data.x,
              y: data.y,
            },
          } as TableCardPostMessageData,
          window.location.origin
        );
      });
    },
    [id, position, relations]
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
      if (id === selectedTable || creatingCurve) return;
      dispatch(actions.setSelected(id));
    },
    [id, selectedTable, creatingCurve]
  );

  const handleRelationCurveRecalc = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      relations.forEach((r) => {
        window.postMessage(
          {
            type: "quicksql/dragging",
            rid: r.id,
            tid: id,
            position: {
              x: data.x,
              y: data.y,
            },
          } as TableCardPostMessageData,
          window.location.origin
        );
      });
    },
    [relations, id]
  );

  return (
    <Draggable
      handle=".quicksql-table-card-handle"
      onStart={handleMoveToTopLayer}
      onDrag={handleRelationCurveRecalc}
      onStop={handleDrop}
      position={position}
    >
      <div
        className="quicksql-table-card absolute cursor-pointer"
        data-id={id}
        style={{ zIndex: layer, width: TABLE_CARD_WIDTH }}
        ref={targetRef}
        onClick={handleClickOnTable}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div
          style={{ height: TABLE_CARD_HANDLE_HEIGHT }}
          className="font-bold px-2 py-1 flex justify-between "
        >
          <div className="w-full flex">
            <EditableText
              value={name}
              placeholder="edit table name"
              onChange={handleTableNameChange}
            />
            <div className="quicksql-table-card-handle cursor-move flex-1"></div>
          </div>

          <Popover
            content={<MenuPopover tableId={id} />}
            position={BlueprintPosition.RIGHT_BOTTOM}
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
            "relative shadow-lg border rounded-md bg-white",
            isSelected && "border-light-blue-600"
          )}
        >
          {columns.map((c) => (
            <ColumnCell key={c.id} data={c} />
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export const MemoizedTableCard = React.memo(TableCard);
