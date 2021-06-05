import { immerable, produce } from "immer";
import { nanoid } from "nanoid";
import { Column } from "./Column";

export class Relation {
  private [immerable] = true;

  public id: string;

  constructor(public name: string, public from: Column, public to: Column) {
    this.id = nanoid();
  }
}
