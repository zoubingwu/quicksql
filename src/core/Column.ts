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

  /**
   * FOREIGH KEY
   */
  FK?: boolean;
}

export class Column implements Constraint {
  private [immerable] = true;

  public NN: boolean = false;
  public PK: boolean = false;
  public UN: boolean = false;
  public AI: boolean = false;
  public FK: boolean = false;

  public id: string;
  public length?: number;
  public comment: string = "";
  public hasRelation: boolean = false;

  constructor(
    public name: string,
    public type: DataType,
    public parentId: string,
    constraint?: Constraint
  ) {
    Object.assign(this, constraint);
    this.id = nanoid();
  }

  clone(parentId: string) {
    return produce(this, (draft) => {
      draft.id = nanoid();
      draft.parentId = parentId;
    });
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

  setHasRelation(val: boolean) {
    return produce(this, (draft) => {
      draft.hasRelation = val;
    });
  }
}
