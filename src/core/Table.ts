import { immerable, produce } from "immer";
import shortId from "short-uuid";
import { Column } from "./Column";

export class Position {
  x: number;
  y: number;
}

export type ColumnMap = Record<string, Column>;

export class Table {
  private [immerable] = true;

  public columnMap: Record<string, Column>;
  public id: string;

  /**
   * for UI z-index
   */
  public layer: number;

  constructor(
    public name: string,
    public columns: Column[],
    public position: Position
  ) {
    this.createColumnMap();
    this.id = shortId.generate();
  }

  public createColumnMap() {
    this.columnMap = this.columns.reduce((acc, next) => {
      acc[next.name] = next;
      return acc;
    }, {} as ColumnMap);

    return this.columnMap;
  }

  public setName(name: string) {
    return produce(this, (draft) => {
      draft.name = name;
    });
  }

  public setPosition(p: Position) {
    return produce(this, (draft) => {
      draft.position = p;
    });
  }

  public setLayer(n: number) {
    return produce(this, (draft) => {
      draft.layer = n;
    });
  }

  public changeColumnName(columnId: string, name: string) {
    return produce(this, (draft) => {
      const i = draft.columns.findIndex((c) => c.id === columnId);
      if (i > -1) {
        draft.columns.splice(i, 1, draft.columns[i].setName(name));
      }
    });
  }
}
