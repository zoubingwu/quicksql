import { immerable, produce } from "immer";
import shortId from "short-uuid";
import { DataType } from "./DataType";

export interface Constraint {
  /**
   * NOT NULL
   */
  NN?: boolean;

  /**
   * PRIMARY KEY
   */
  PK?: boolean;

  /**
   * UNIQUE
   */
  UN?: boolean;

  /**
   * AUTO INCREMENT
   */
  AI?: boolean;
}

export class Column implements Constraint {
  private [immerable] = true;

  public NN: boolean = false;
  public PK: boolean = false;
  public UN: boolean = false;
  public AI: boolean = false;
  public id: string;
  public length?: number;

  constructor(
    public name: string,
    public type: DataType,
    constraint?: Constraint
  ) {
    Object.assign(this, constraint);
    this.id = shortId.generate();
  }

  setName(name: string) {
    return produce(this, (draft) => {
      draft.name = name;
    });
  }
}
