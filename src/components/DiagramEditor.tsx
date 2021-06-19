import React, { useCallback, useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import Draggable from "react-draggable";
import { Button, ButtonGroup, useHotkeys } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector, actions } from "../store";
import { MemoizedTableCard } from "./TableCard";
import { PropertyEditor } from "./PropertyEditor";
import { RelationshipCurve, TempRelationshipCurve } from "./RelationshipCurve";
import {
  getObjectContainerRect,
  ObjectContainerClass,
  Position,
} from "../core/Position";
import { useDebounce } from "../hooks/useDebounce";

export const DiagramEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const tables = useAppSelector((state) => state.diagram.tables);
  const relations = useAppSelector((state) => state.diagram.relations);
  const selectedTable = useAppSelector((state) => state.diagram.selectedTable);
  const zoom = useAppSelector((state) => state.diagram.zoom);
  const creatingCurve = useAppSelector(
    (state) => state.diagram.creatingRelationCurve
  );
  const showCode = useAppSelector((state) => state.globalOptions.showCode);
  const popoverOpened = useAppSelector(
    (state) => state.globalOptions.propertyEditroPopoverOpened
  );
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const debouncedCanvasPosition = useDebounce(canvasPosition, 300);

  const hotkeys = useMemo(
    () => [
      {
        combo: "Esc",
        global: true,
        label: "Cancel Creating Relation",
        onKeyDown: () => {
          dispatch(actions.cancelCreatingRelationCurve());
        },
      },
    ],
    []
  );
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

  const handleClickEmptyArea = useCallback(() => {
    if (popoverOpened) return;

    if (creatingCurve) {
      dispatch(actions.cancelCreatingRelationCurve());
    } else {
      if (selectedTable) {
        dispatch(actions.setSelected(null));
      }
    }
  }, [popoverOpened, creatingCurve, selectedTable]);

  const handleCurveEndCompute = (e: React.MouseEvent<HTMLDivElement>) => {
    if (creatingCurve) {
      const parent = getObjectContainerRect();
      setMousePosition({
        x: e.clientX - parent.x,
        y: e.clientY - parent.y,
      });
    }
  };

  useEffect(() => {
    setMousePosition(null);
  }, [creatingCurve]);

  useEffect(() => {
    dispatch(actions.setCanvasPosition(debouncedCanvasPosition));
  }, [debouncedCanvasPosition]);

  return (
    <div
      className={clsx(
        "quicksql-diagram-editor",
        "flex-shrink-0 flex-grow-0 transition-all flex",
        showCode ? "w-3/4" : "w-full",
        creatingCurve && "cursor-pointer"
      )}
      onClick={handleClickEmptyArea}
      onMouseMove={handleCurveEndCompute}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div className="w-full h-full relative overflow-hidden">
        <Draggable
          handle=".quicksql-diagram-canvas"
          onDrag={(e, data) => {
            e.stopPropagation();
            const { deltaX, deltaY } = data;
            setCanvasPosition({
              x: canvasPosition.x + deltaX,
              y: canvasPosition.y + deltaY,
            });
          }}
        >
          <div
            onWheel={(e) => {
              setCanvasPosition({
                x: canvasPosition.x - e.deltaX,
                y: canvasPosition.y - e.deltaY,
              });
            }}
            className="quicksql-diagram-canvas relative w-full h-full"
          >
            <div
              className={clsx("relative", ObjectContainerClass)}
              style={{
                left: canvasPosition.x,
                top: canvasPosition.y,
                transform: `scale(${zoom / 100})`,
              }}
            >
              {Object.values(tables).map((t) => (
                <MemoizedTableCard data={t} key={t.id} />
              ))}

              {Object.values(relations).map((r) => (
                <RelationshipCurve data={r} key={r.id} />
              ))}

              {creatingCurve && (
                <TempRelationshipCurve mousePosition={mousePosition} />
              )}
            </div>
          </div>
        </Draggable>

        <div className="fixed bottom-4 left-2 fle">
          {/* <div className="flex items-center text-sm">{zoom}%</div> */}
          <ButtonGroup>
            {/* <Button
              icon="zoom-in"
              onClick={() => dispatch(actions.zoomIn())}
            />
            <Button
              icon="zoom-out"
              onClick={() => dispatch(actions.zoomOut())}
            />
            <Button icon="zoom-to-fit" onClick={() => dispatch(actions.zoomToFit())} /> */}
            {(canvasPosition.x !== 0 || canvasPosition.y !== 0) && (
              <Button
                text="Center to content"
                onClick={() => setCanvasPosition({ x: 0, y: 0 })}
              />
            )}
          </ButtonGroup>
        </div>
      </div>

      <PropertyEditor />
    </div>
  );
};
