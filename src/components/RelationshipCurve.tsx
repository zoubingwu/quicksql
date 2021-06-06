import React, { useMemo } from "react";
import {
  getHeightBetween2Position,
  getWidthBetween2Position,
  minus,
  Position,
  toPoint,
} from "../core/Position";
import { Relation } from "../core/Relation";
import { useAppSelector } from "../store";
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
    const width = getWidthBetween2Position(start, realtimeEnd);
    const height = getHeightBetween2Position(start, realtimeEnd);
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
  return <div></div>;
};
