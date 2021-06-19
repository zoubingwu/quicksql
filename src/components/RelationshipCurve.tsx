import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getHeightBetweenPositions,
  getWidthBetweenPositions,
  Position,
  toPosition,
  Point,
  moveLeftBy,
  moveUpBy,
  moveRightBy,
} from "../core/Position";
import { Relation } from "../core/Relation";
import { actions, useAppSelector } from "../store";
import {
  findCurvePoints,
  getColumnPositionData,
} from "../store/diagram.helpers";
import { BasisCurve } from "./Curve";
import type { TableCardPostMessageData } from "./TableCard";

export const TempRelationshipCurve: React.FC<{
  mousePosition: Position | null;
}> = ({ mousePosition }) => {
  const start = useAppSelector(
    (state) => state.diagram.tempRelationCurveStartPosition
  )!;
  const end = useAppSelector(
    (state) => state.diagram.tempRelationCurveEndPosition
  )!;
  const zIndex = useAppSelector((state) => state.diagram.layers);
  const realtimeEnd = mousePosition || end;

  const svgStyle = useMemo(() => {
    // give extra space so mouse can hover on another element
    const left = start.x - realtimeEnd.x > 0 ? realtimeEnd.x + 2 : start.x;
    const top = start.y - realtimeEnd.y > 0 ? realtimeEnd.y + 2 : start.y;
    const width = getWidthBetweenPositions(start, realtimeEnd);
    const height = getHeightBetweenPositions(start, realtimeEnd);
    const styles = { left, top, width, height, zIndex };

    return styles;
  }, [start, end, mousePosition, zIndex]);

  const data: [number, number][] = useMemo(() => {
    if (start.x <= realtimeEnd.x && start.y <= realtimeEnd.y) {
      // 4
      return [
        [0, 0],
        [svgStyle.width, svgStyle.height],
      ];
    } else if (start.x >= realtimeEnd.x && start.y >= realtimeEnd.y) {
      // 2
      return [
        [svgStyle.width, svgStyle.height],
        [0, 0],
      ];
    } else if (start.x <= realtimeEnd.x && start.y >= realtimeEnd.y) {
      // 1
      return [
        [0, svgStyle.height],
        [svgStyle.width, 0],
      ];
    } else {
      // 3
      return [
        [svgStyle.width, 0],
        [0, svgStyle.height],
      ];
    }
  }, [start, end, mousePosition]);

  if (!start || !end) {
    return null;
  }

  return (
    <svg className="absolute" style={svgStyle}>
      <BasisCurve
        data={data}
        stroke="#106BA3"
        strokeWidth={2}
        showPoints={false}
        strokeDasharray={2}
      />
    </svg>
  );
};

export const RelationshipCurve: React.FC<{
  data: Relation;
}> = ({ data }) => {
  const { curvePoints, id, from, to } = data;
  const { id: fromColumnId, parentId: fromTableId } = from;
  const { id: toColumnId, parentId: toTableId } = to;
  const [curve, setCurve] = useState<Point[]>(curvePoints);
  const parentTable = useAppSelector(
    (state) => state.diagram.tables[fromTableId]
  );
  const childTable = useAppSelector((state) => state.diagram.tables[toTableId]);
  const positions = useAppSelector((state) => state.diagram.positions);
  const dispatch = useDispatch();

  const svgStyle = useMemo(() => {
    // add 10px more height, move svg squre 1px up
    // move starting point 1px down and ending point 1px up
    // so the curve won't be cut by edge
    const top = Math.min(...curve.map((p) => p[1])) - 5;
    const left = Math.min(...curve.map((p) => p[0]));
    const ps = curve.map((p) => toPosition(p));
    const width = getWidthBetweenPositions(...ps);
    const height = getHeightBetweenPositions(...ps) + 10;
    const styles = { left, top, width, height };

    // if (import.meta.env.DEV) {
    //   Object.assign(styles, { border: '1px solid red' })
    // }
    return styles;
  }, [curve]);

  const handleRecalculatePoints = useCallback(
    (e: MessageEvent<TableCardPostMessageData>) => {
      if (!e.data.type?.startsWith("quicksql") || id !== e.data.rid) {
        return;
      }

      const ps = Object.assign({}, positions, {
        [e.data.tid]: e.data.position,
      } as Record<string, Position>);

      const a = getColumnPositionData(
        parentTable.columnMap.get(fromColumnId)!,
        parentTable.columns,
        ps
      );
      const b = getColumnPositionData(
        childTable.columnMap.get(toColumnId)!,
        childTable.columns,
        ps
      );
      const points = findCurvePoints(a, b);

      setCurve(points);

      if (e.data.type === "quicksql/drop") {
        dispatch(actions.setRelationCurve({ id: e.data.rid, points }));
      }
    },
    [
      parentTable,
      childTable,
      fromTableId,
      toTableId,
      fromColumnId,
      toColumnId,
      positions,
    ]
  );

  const points: Point[] = useMemo(() => {
    const corrected = curve.map((p, i) => {
      // the original point was relative to the diagram editor
      // we must make it relative to the svg position to render
      return moveUpBy(moveLeftBy(p, svgStyle.left), svgStyle.top);
    });

    // give extra space to arrow head!
    const secondLast = corrected[corrected.length - 2];
    const last = corrected[corrected.length - 1];
    corrected[corrected.length - 1] =
      secondLast[0] > last[0] ? moveRightBy(last, 10) : moveLeftBy(last, 10);

    return corrected;
  }, [curve, svgStyle]);

  useEffect(() => {
    window.addEventListener("message", handleRecalculatePoints);

    return () => {
      window.removeEventListener("message", handleRecalculatePoints);
    };
  }, [handleRecalculatePoints]);

  return (
    <svg className="absolute" style={svgStyle}>
      <BasisCurve
        data={points}
        stroke="#106BA3"
        strokeWidth={2}
        showPoints={false}
      />
    </svg>
  );
};
