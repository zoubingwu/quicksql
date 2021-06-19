import { nanoid } from "nanoid";
import { cloneColumn, Column, Constraint, createColumn } from "./Column";
import { Relation } from "./Relation";

export type ColumnMap = Record<string, Column>;

export interface Table {
  id: string;
  name: string;
  relations: Relation[];
  columns: Column[];
  columnMap: Map<string, Column>;

  /**
   * for UI z-index
   */
  layer: number;
}

function buildColumnMap(columns: Column[]): Map<string, Column> {
  return columns.reduce((acc, next) => {
    acc.set(next.id, next);
    return acc;
  }, new Map<string, Column>());
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
    columnMap: buildColumnMap(columns),
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
    columnMap: buildColumnMap(clonedColumns),
  };
}
