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
  NN: boolean = false;
  PK: boolean = false;
  UN: boolean = false;
  AI: boolean = false;

  length?: number;

  constructor(
    public name: string,
    public type: DataType,
    constraint?: Constraint
  ) {
    Object.assign(this, constraint);
  }
}
