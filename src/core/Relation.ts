import { immerable, produce } from "immer";
import { nanoid } from "nanoid";
import { Column } from "./Column";
import { Point } from "./Position";

export interface Relation {
  id: string;
  name: string;
  curvePoints: Point[];
  from: Column;
  to: Column;
}

export function createRelation(fromColumn: Column, toColumn: Column): Relation {
  return {
    id: nanoid(),
    name: "",
    curvePoints: [],
    from: fromColumn,
    to: toColumn,
  };
}
