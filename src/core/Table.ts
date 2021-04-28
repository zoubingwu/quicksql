import { Column } from "./Column";

export class Table {
  name: string;
  columns: Column[];
  columnsMap: Record<string, Column>;
}

type A = "asd";

type B = Capitalize<A>;
