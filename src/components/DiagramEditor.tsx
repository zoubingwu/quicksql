import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import clsx from "clsx";
import { ContextMenu, Menu, MenuItem, useHotkeys } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector, actions } from "../store";
import { TableCard } from "./TableCard";
import { PropertyEditor } from "./PropertyEditor";
import { RelationshipCurve, TempRelationshipCurve } from "./RelationshipCurve";
import { Position } from "../core/Position";

export const DiagramEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const tables = useAppSelector((state) => state.diagram.tables);
  const relations = useAppSelector((state) => state.diagram.relations);
  const creatingCurve = useAppSelector(
    (state) => state.diagram.creatingRelationCurve
  );
  const showCode = useAppSelector((state) => state.globalOptions.showCode);
  const popoverOpened = useAppSelector(
    (state) => state.globalOptions.propertyEditroPopoverOpened
  );
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const containerRect = useRef<{ rect: DOMRect | null }>({ rect: null });
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

  const handleAddTable = useCallback(() => {
    dispatch(actions.addNewTable());
  }, []);

  const handleClickEmptyArea = useCallback(() => {
    if (popoverOpened) return;

    if (creatingCurve) {
      dispatch(actions.cancelCreatingRelationCurve());
    } else {
      dispatch(actions.setSelected(null));
    }
  }, [popoverOpened, creatingCurve]);

  const handleCurveEndCompute = (e: React.MouseEvent<HTMLDivElement>) => {
    if (creatingCurve) {
      setMousePosition({
        x: e.clientX,
        y: e.clientY - (containerRect.current.rect?.y ?? 0),
      });
    }
  };

  useEffect(() => {
    setMousePosition(null);
  }, [creatingCurve]);

  useEffect(() => {
    containerRect.current.rect = ref.current?.getBoundingClientRect()!;
  }, []);

  return (
    <div
      className={clsx(
        "quicksql-diagram-editor",
        "flex-shrink-0 flex-grow-0 overflow-hidden relative transition-all",
        showCode ? "w-2/3" : "w-full",
        creatingCurve && "cursor-pointer"
      )}
      ref={ref}
      onClick={handleClickEmptyArea}
      onMouseMove={handleCurveEndCompute}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
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

        {Object.values(relations).map((r) => (
          <RelationshipCurve data={r} key={r.id} />
        ))}

        {creatingCurve && (
          <TempRelationshipCurve mousePosition={mousePosition} />
        )}
        <PropertyEditor />
      </ContextMenu>
    </div>
  );
};
