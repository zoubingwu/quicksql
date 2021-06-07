import { Table } from "../core/Table";
import {
  Position,
  Point,
  RectPosition,
  moveYTo,
  moveRightBy,
  moveXTo,
} from "../core/Position";
import { DiagramState } from "./diagram";

export function isCloseEnough(a: Position, b: Position): boolean {
  return Math.abs(a.x - b.x) <= 10 && Math.abs(a.y - b.y) <= 10;
}

export function findPositionWhenInsertNewTable(
  allTables: Table[],
  target: Table
) {
  while (allTables.some((t) => isCloseEnough(t.position, target.position))) {
    target = target.setPosition({
      x: target.position.x,
      y: target.position.y + 150,
    });
  }

  return target;
}

export function resetTempCurve(state: DiagramState) {
  state.creatingRelationCurve = false;
  state.tempRelationCurveStartColumn = null;
  state.tempRelationCurveStartPosition = null;
  state.tempRelationCurveEndPosition = null;
}

export function findColumnPosition(
  table: Table,
  columnId: string
): RectPosition {
  const position = table.position;
  const index = table.columns.findIndex((c) => c.id === columnId);
  return {
    x: position.x,
    y: position.y + 26 + 28 * index,
    width: 320,
    height: 28,
  };
}

function findPointsConnectRects(a: RectPosition, b: RectPosition): Point[] {
  const startLeftPoint = [a.x, a.y + a.height / 2] as Point;
  const startRightPoint = [a.x + a.width, a.y + a.height / 2] as Point;
  const endLeftPoint = [b.x, b.y + b.height / 2] as Point;
  const endRightPoint = [b.x + b.width, b.y + b.height / 2] as Point;

  if (b.x > a.x + a.width) {
    const p2 = moveRightBy(
      startRightPoint,
      (endLeftPoint[0] - startRightPoint[0]) / 2
    );
    return [startRightPoint, p2, moveYTo(p2, endLeftPoint[1]), endLeftPoint];
  } else if (b.x <= a.x + a.width && b.x > a.x + a.width / 2) {
    const p2 = moveXTo(
      startRightPoint,
      Math.max(startRightPoint[0], endRightPoint[0]) + 100
    );
    return [startRightPoint, p2, moveYTo(p2, endRightPoint[1]), endRightPoint];
  } else if (b.x <= a.x + a.width / 2 && b.x > a.x - b.width) {
    const notMuchSpaceAtLeft =
      Math.min(startLeftPoint[0], endLeftPoint[0]) - 100 < 0;
    if (notMuchSpaceAtLeft) {
      const p2 = moveXTo(
        startRightPoint,
        Math.max(startRightPoint[0], endRightPoint[0]) + 100
      );
      return [
        startRightPoint,
        p2,
        moveYTo(p2, endRightPoint[1]),
        endRightPoint,
      ];
    }

    const p2 = moveXTo(
      startLeftPoint,
      Math.min(startLeftPoint[0], endLeftPoint[0]) - 100
    );
    return [startLeftPoint, p2, moveYTo(p2, endLeftPoint[1]), endLeftPoint];
  } else {
    const p2 = moveRightBy(
      startLeftPoint,
      (endRightPoint[0] - startLeftPoint[0]) / 2
    );
    return [startLeftPoint, p2, moveYTo(p2, endRightPoint[1]), endRightPoint];
  }
}

export function findCurvePoints(
  fromTable: Table,
  toTable: Table,
  fromColumnId: string,
  toColumnId: string
): Point[] {
  const fromColumnRect = findColumnPosition(fromTable, fromColumnId);
  const toColumnRect = findColumnPosition(toTable, toColumnId);

  const points = findPointsConnectRects(fromColumnRect, toColumnRect);

  return points;
}
