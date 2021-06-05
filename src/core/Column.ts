import { immerable, produce } from "immer";
import { nanoid } from "nanoid";
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
  public comment: string = "";

  constructor(
    public name: string,
    public type: DataType,
    constraint?: Constraint
  ) {
    Object.assign(this, constraint);
    this.id = nanoid();
  }

  setName(name: string) {
    return produce(this, (draft) => {
      draft.name = name;
    });
  }

  setComment(c: string) {
    return produce(this, (draft) => {
      draft.comment = c;
    });
  }

  setType(type: DataType) {
    return produce(this, (draft) => {
      draft.type = type;
    });
  }

  setConstraint(key: keyof Constraint, value: boolean) {
    return produce(this, (draft) => {
      draft[key] = value;
    });
  }
}
