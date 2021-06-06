export type Point = [number, number];

export interface Position {
  x: number;
  y: number;
}

export const toPoint = (p: Position): Point => [p.x, p.y];
export const toPosition = (p: Point): Position => ({ x: p[0], y: p[1] });

export const getWidthBetween2Position = (a: Position, b: Position) =>
  Math.abs(a.x - b.x);
export const getHeightBetween2Position = (a: Position, b: Position) =>
  Math.abs(a.y - b.y);

export const minus = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
