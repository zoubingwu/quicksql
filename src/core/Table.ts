import { immerable, produce } from "immer";
import { nanoid } from "nanoid";
import { Column, Constraint } from "./Column";
import { DataType } from "./DataType";
import { Position } from "./Position";

export type ColumnMap = Record<string, Column>;

export class Table {
  private [immerable] = true;

  public columnMap: Map<string, Column>;
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
    this.columnMap = this.columns.reduce((acc, next) => {
      acc.set(next.id, next);
      return acc;
    }, new Map<string, Column>());
    this.id = nanoid();
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
        const editedColumn = draft.columns[i].setName(name);
        draft.columns.splice(i, 1, editedColumn);
        draft.columnMap.set(editedColumn.id, editedColumn);
      }
    });
  }

  public addNewColumn(column?: Column) {
    return produce(this, (draft) => {
      const newColumn = column || new Column("new_column", "INT", this.id);
      draft.columns.push(newColumn);
      draft.columnMap.set(newColumn.id, newColumn);
    });
  }

  public changeColumnDataType(columnId: string, type: DataType) {
    return produce(this, (draft) => {
      const i = draft.columns.findIndex((c) => c.id === columnId);
      if (i > -1) {
        const editedColumn = draft.columns[i].setType(type);
        draft.columns.splice(i, 1, editedColumn);
        draft.columnMap.set(editedColumn.id, editedColumn);
      }
    });
  }

  public changeColumnConstrain(
    columnId: string,
    constrain: keyof Constraint,
    value: boolean
  ) {
    return produce(this, (draft) => {
      const i = draft.columns.findIndex((c) => c.id === columnId);
      if (i > -1) {
        const editedColumn = draft.columns[i].setConstraint(constrain, value);
        draft.columns.splice(i, 1, editedColumn);
        draft.columnMap.set(editedColumn.id, editedColumn);
      }
    });
  }
}
