import { Column } from "./Column";

export class Position {
  x: number;
  y: number;
}

export type ColumnMap = Record<string, Column>;

export class Table {
  public columnMap: Record<string, Column>;

  constructor(
    public name: string,
    public columns: Column[],
    public position?: Position
  ) {
    this.columnMap = columns.reduce((acc, next) => {
      acc[next.name] = next;
      return acc;
    }, {} as ColumnMap);
  }
}
