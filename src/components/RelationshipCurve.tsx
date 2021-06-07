import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getHeightBetweenPositions,
  getWidthBetweenPositions,
  Position,
  toPosition,
  Point,
} from "../core/Position";
import { Relation } from "../core/Relation";
import { useAppSelector } from "../store";
import { findCurvePoints } from "../store/diagram.helpers";
import { BasisCurve } from "./Curve";

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
    const left = Math.min(start.x, realtimeEnd.x);
    const top = Math.min(start.y, realtimeEnd.y);
    const width = getWidthBetweenPositions(start, realtimeEnd);
    const height = getHeightBetweenPositions(start, realtimeEnd);
    return { zIndex, left, top, width, height };
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
  const { curvePoints, id, fromTable, fromColumn, toTable, toColumn } = data;

  const [curve, setCurve] = useState<Point[]>(curvePoints);

  const tables = useAppSelector((state) => state.diagram.tables);

  const svgStyle = useMemo(() => {
    const left = Math.min(...curve.map((p) => p[0]));
    const top = Math.min(...curve.map((p) => p[1]));
    const width = getWidthBetweenPositions(...curve.map((p) => toPosition(p)));
    const height = getHeightBetweenPositions(
      ...curve.map((p) => toPosition(p))
    );
    return { left, top, width, height };
  }, [curve]);

  const handleRecalculatePoints = useCallback(
    (e: MessageEvent) => {
      if (id !== e.data.id) {
        return;
      }
      const tableId = e.data.tableId;
      const parent =
        fromTable === tableId
          ? tables[fromTable].setPosition(e.data.position)
          : tables[fromTable];
      const child =
        toTable === tableId
          ? tables[toTable].setPosition(e.data.position)
          : tables[toTable];
      const points = findCurvePoints(parent, child, fromColumn, toColumn);
      const nextCurve = points;
      setCurve(nextCurve);
    },
    [tables, fromTable, toTable, fromColumn, toColumn]
  );

  useEffect(() => {
    window.addEventListener("message", handleRecalculatePoints);

    return () => {
      window.removeEventListener("message", handleRecalculatePoints);
    };
  }, [handleRecalculatePoints]);

  return (
    <svg className="absolute" style={svgStyle}>
      <BasisCurve
        data={curve.map(
          (p) => [p[0] - svgStyle.left, p[1] - svgStyle.top] as Point
        )}
        stroke="#106BA3"
        strokeWidth={2}
        showPoints={false}
      />
    </svg>
  );
};
