import { immerable, produce } from "immer";
import { nanoid } from "nanoid";
import { Point } from "./Position";

export class Relation {
  private [immerable] = true;

  public id: string;
  public name: string;
  public curvePoints: Point[];

  constructor(
    public fromTable: string,
    public toTable: string,
    public fromColumn: string,
    public toColumn: string
  ) {
    this.id = nanoid();
  }

  public setCurvePoints(p: Point[]) {
    return produce(this, (draft) => {
      draft.curvePoints = p;
    });
  }
}
