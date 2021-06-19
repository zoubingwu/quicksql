import { nanoid } from "nanoid";
import { cloneColumn, Column, Constraint, createColumn } from "./Column";
import { Relation } from "./Relation";

export type ColumnMap = Record<string, Column>;

export interface Table {
  id: string;
  name: string;
  relations: Relation[];
  columns: Column[];

  /**
   * for UI z-index
   */
  layer: number;
}

export function createTable(name: string = "table_name"): Table {
  const id = nanoid();
  const columns = [
    createColumn("id", "INT", id, { AI: true, PK: true, NN: true }),
    createColumn("created_at", "DATETIME", id),
    createColumn("updated_at", "DATETIME", id),
  ];
  const table = {
    id,
    name,
    columns,
    layer: 0,
    relations: [],
  };

  return table;
}

export function cloneTable(table: Table): Table {
  const id = nanoid();
  const clonedColumns = table.columns.map((c) => {
    const column = cloneColumn(c);
    column.parentId = id;
    return column;
  });

  return {
    ...table,
    id,
    columns: clonedColumns,
  };
}

export function findColumn(table: Table, cid: string): Column {
  return table.columns.find((i) => i.id === cid)!;
}
