import { immerable, produce } from "immer";
import { nanoid } from "nanoid";
import { Point } from "./Position";

export class Relation {
  private [immerable] = true;

  public id: string;
  public name: string;
  public curvePoints: Point[];

  constructor(
    public fromTableId: string,
    public toTableId: string,
    public fromColumnId: string,
    public toColumnId: string
  ) {
    this.id = nanoid();
  }

  public setCurvePoints(p: Point[]) {
    return produce(this, (draft) => {
      draft.curvePoints = p;
    });
  }
}
