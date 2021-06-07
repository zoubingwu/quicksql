import {
  Position,
  Point,
  RectPosition,
  moveYTo,
  moveRightBy,
  moveXTo,
  moveLeftBy,
} from "../core/Position";
import { DiagramState } from "./diagram";
import { Column } from "../core/Column";

export function isCloseEnough(a: Position, b: Position): boolean {
  return Math.abs(a.x - b.x) <= 10 && Math.abs(a.y - b.y) <= 10;
}

export const DEFAULT_TABLE_POSITION: Position = { x: 50, y: 50 };

export function findPositionWhenInsertNewTable(
  allPositions: Record<string, Position>
): Position {
  const ps = Object.values(allPositions);

  // copy to prevent mutate
  const newPosition = { ...DEFAULT_TABLE_POSITION };

  while (ps.some((p) => isCloseEnough(p, newPosition))) {
    newPosition.y = newPosition.y + 150;
  }

  return newPosition;
}

export function resetTempCurve(state: DiagramState) {
  state.creatingRelationCurve = false;
  state.tempRelationCurveStartColumn = null;
  state.tempRelationCurveStartPosition = null;
  state.tempRelationCurveEndPosition = null;
}

export const TABLE_CARD_WIDTH = 280;
export const TABLE_CARD_HANDLE_HEIGHT = 26;
export const COLUMN_CELL_HEIGHT = 28;
const EXPAND_RANGE = 100;

/**
 * find four points to draw curve from rectangle a to rectangle b to connect them
 */
function findRectanglePoints(
  a: RectPosition,
  b: RectPosition
): [Point, Point, Point, Point] {
  // sp => starting point
  // ep => ending point
  // we only draw lines from/to the left/right side of rectangle.
  // use the middle point of left/right side as sp/ep
  const spLeft = [a.x, a.y + a.height / 2] as Point;
  const spRight = [a.x + a.width, a.y + a.height / 2] as Point;
  const epLeft = [b.x, b.y + b.height / 2] as Point;
  const epRight = [b.x + b.width, b.y + b.height / 2] as Point;

  /**
   * [1]
   * ▇▇▇▇▇▇▇ a
   *               ▇▇▇▇▇▇▇ b
   *
   * 1. start from right side of a
   * 2. move right to the middle of right side of a and left side of b
   * 3. move down to the same level of ending point in b (middle point of left side of b)
   * 4. move to ending point
   */
  if (b.x > a.x + a.width) {
    const p2 = moveRightBy(spRight, (epLeft[0] - spRight[0]) / 2);
    return [spRight, p2, moveYTo(p2, epLeft[1]), epLeft];

    /**
     * [2]
     * ▇▇▇▇▇▇▇ a
     *     ▇▇▇▇▇▇▇ b
     *
     * 1. start from right side of a
     * 2. move right to align with right side of b, keep moving right by an extra EXPAND_RANGE
     * 3. move down to the same level of ending point in b
     * 4. move to ending point
     */
  } else if (b.x <= a.x + a.width && b.x > a.x + a.width / 2) {
    const p2 = moveXTo(
      spRight,
      Math.max(spRight[0], epRight[0]) + EXPAND_RANGE
    );
    return [spRight, p2, moveYTo(p2, epRight[1]), epRight];

    /**
     * [3]
     *          ▇▇▇▇▇▇▇ a
     *    ▇▇▇▇▇▇▇ b
     *
     * 1. start from left side of a
     * 2. move left to align with left side of b, keep moving left by an extra EXPAND_RANGE (do a check, if there is not enough space, go to [2])
     * 3. move down to the same level of ending point in b
     * 4. move to ending point
     */
  } else if (b.x <= a.x + a.width / 2 && b.x > a.x - b.width) {
    const notMuchSpaceAtLeft =
      Math.min(spLeft[0], epLeft[0]) - EXPAND_RANGE < 0;

    if (notMuchSpaceAtLeft) {
      const p2 = moveXTo(
        spRight,
        Math.max(spRight[0], epRight[0]) + EXPAND_RANGE
      );
      return [spRight, p2, moveYTo(p2, epRight[1]), epRight];
    }

    const p2 = moveXTo(spLeft, Math.min(spLeft[0], epLeft[0]) - EXPAND_RANGE);

    return [spLeft, p2, moveYTo(p2, epLeft[1]), epLeft];
  } else {
    /**[4]
     *                ▇▇▇▇▇▇▇ a
     * ▇▇▇▇▇▇▇ b
     *
     * 1. start from left side of a
     * 2. move left to the middle of left side of a and right side of b
     * 3. move down to the same level of ending point in b
     * 4. move to ending point
     */
    const p2 = moveLeftBy(spLeft, (spLeft[0] - epRight[0]) / 2);
    return [spLeft, p2, moveYTo(p2, epRight[1]), epRight];
  }
}

interface ColumnPositionData {
  tablePosition: Position;
  columnIndex: number;
}

export function getColumnPositionData(
  targetColumn: Column,
  columns: Column[],
  tablePositions: Record<string, Position>
) {
  const columnIndex = columns.findIndex((c) => c.id === targetColumn.id);
  const tableId = targetColumn.parentId;
  const tablePosition = tablePositions[tableId];

  return {
    tablePosition,
    columnIndex,
  };
}

export function findColumnPosition(data: ColumnPositionData): RectPosition {
  const { tablePosition, columnIndex } = data;
  return {
    x: tablePosition.x,
    y:
      tablePosition.y +
      TABLE_CARD_HANDLE_HEIGHT +
      COLUMN_CELL_HEIGHT * columnIndex,
    width: TABLE_CARD_WIDTH,
    height: COLUMN_CELL_HEIGHT,
  };
}

export function findCurvePoints(
  a: ColumnPositionData,
  b: ColumnPositionData
): Point[] {
  const fromColumnRect = findColumnPosition(a);
  const toColumnRect = findColumnPosition(b);
  const points = findRectanglePoints(fromColumnRect, toColumnRect);

  return points;
}
