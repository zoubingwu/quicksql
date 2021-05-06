import { Column } from "./Column";

interface Position {
  x: number;
  y: number;
}

export class Table {
  name: string;
  columns: Column[];
  columnsMap: Record<string, Column>;
  position: Position;
}
