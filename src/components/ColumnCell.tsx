import React, { useCallback, useRef } from "react";
import { EditableText } from "@blueprintjs/core";
import { Column } from "../core/Column";
import { actions, useAppDispatch, useAppSelector } from "../store";
import clsx from "clsx";

export const ColumnCell: React.FC<{
  data: Column;
}> = ({ data }) => {
  const { id, name, parentId } = data;
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const creatingCurve = useAppSelector(
    (state) => state.diagram.creatingRelationCurve
  );
  const start = useAppSelector(
    (state) => state.diagram.tempRelationCurveStartColumn
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
    const parent = document
      .querySelector(".quicksql-diagram-editor")!
      .getBoundingClientRect();

    if (!creatingCurve) {
      const self = ref.current?.getBoundingClientRect()!;
      const x = self.x - parent.x;
      const y = self.y - parent.y;

      dispatch(
        actions.startCreatingRelationCurve({
          column: data,
          start: { x: x + self.width, y: y + self.height / 2 },
          end: { x: e.clientX, y: e.clientY - parent.y },
        })
      );
    } else {
      dispatch(
        actions.stopCreatingRelationCurve({
          column: data,
          end: { x: e.clientX, y: e.clientY - parent.y },
        })
      );
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleCreateOrFinishCurve}
      className={clsx(
        "quicksql-column-cell",
        "px-2 py-1 flex flex-row items-center justify-between hover:bg-gray-100 rounded border border-transparent",
        creatingCurve &&
          start?.id === id &&
          "bg-gray-100 border-dashed !border-light-blue-600",
        creatingCurve && "!hover:border-dashed !hover:border-light-blue-600"
      )}
    >
      <EditableText value={name} onChange={handleNameChange} />
    </div>
  );
};
