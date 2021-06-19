import React, { useCallback, useRef } from "react";
import { EditableText } from "@blueprintjs/core";
import { Column } from "../core/Column";
import { actions, useAppDispatch, useAppSelector } from "../store";
import clsx from "clsx";
import { COLUMN_CELL_HEIGHT } from "../store/diagram.helpers";
import { getObjectContainerRect } from "../core/Position";

export const ColumnCell: React.FC<{
  data: Column;
}> = ({ data }) => {
  const { id, name, parentId, hasRelation } = data;
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const creatingCurve = useAppSelector(
    (state) => state.diagram.creatingRelationCurve
  );
  const start = useAppSelector(
    (state) => state.diagram.tempRelationCurveStartColumn
  );
  const canvasPosition = useAppSelector(
    (state) => state.diagram.canvasPosition
  );
  const handleNameChange = useCallback(
    (value: string) => {
      if (value === name) return;
      dispatch(
        actions.updateColumnName({
          tableId: parentId,
          columnId: id,
          columnName: value,
        })
      );
    },
    [name, parentId, id]
  );

  const handleCreateOrFinishCurve = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget !== e.target) return;

    const navbarHeight =
      document.querySelector(".quicksql-nav-bar")!.clientHeight;
    const mousePositionRelativeToDiagramEditor = {
      x: e.clientX - canvasPosition.x,
      y: e.clientY - canvasPosition.y - navbarHeight,
    };
    if (!creatingCurve) {
      dispatch(
        actions.startCreatingRelationCurve({
          column: data,
          mousePosition: mousePositionRelativeToDiagramEditor,
        })
      );
    } else {
      dispatch(
        actions.stopCreatingRelationCurve({
          column: data,
          mousePosition: mousePositionRelativeToDiagramEditor,
        })
      );
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleCreateOrFinishCurve}
      data-id={id}
      style={{ height: COLUMN_CELL_HEIGHT }}
      className={clsx(
        "quicksql-column-cell",
        "px-2 py-1 flex flex-row items-center justify-between hover:bg-gray-100 rounded border border-transparent",
        creatingCurve &&
          start?.id === id &&
          "bg-gray-100 border-dashed !border-light-blue-600",
        creatingCurve && "!hover:border-dashed !hover:border-light-blue-600",
        hasRelation && "border-dashed !border-light-blue-600"
      )}
    >
      <EditableText value={name} onChange={handleNameChange} />
    </div>
  );
};
