export type Point = [number, number];

export interface Position {
  x: number;
  y: number;
}

export interface RectPosition extends Position {
  width: number;
  height: number;
}

export const toPoint = (p: Position): Point => [p.x, p.y];
export const toPosition = (p: Point): Position => ({ x: p[0], y: p[1] });

export const getWidthBetweenPositions = (...p: Position[]) => {
  const mostLeft = Math.min(...p.map((p) => p.x));
  const mostRight = Math.max(...p.map((p) => p.x));
  return mostRight - mostLeft;
};
export const getHeightBetweenPositions = (...p: Position[]) => {
  const mostTop = Math.min(...p.map((p) => p.y));
  const mostBottom = Math.max(...p.map((p) => p.y));
  return mostBottom - mostTop;
};

export const moveLeftBy = (p: Point, range: number): Point => [
  p[0] - range,
  p[1],
];

export const moveRightBy = (p: Point, range: number): Point => [
  p[0] + range,
  p[1],
];

export const moveUpBy = (p: Point, range: number): Point => [
  p[0],
  p[1] - range,
];

export const moveDownBy = (p: Point, range: number): Point => [
  p[0],
  p[1] + range,
];

export const moveXTo = (p: Point, x: number): Point => [x, p[1]];

export const moveYTo = (p: Point, y: number): Point => [p[0], y];
