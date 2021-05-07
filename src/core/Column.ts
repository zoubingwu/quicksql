export type DataType = "int" | "varchar" | "datetime";

export interface Constraint {
  /**
   * NOT NULL
   */
  nn?: boolean;

  /**
   * PRIMARY KEY
   */
  pk?: boolean;

  /**
   * UNIQUE
   */
  un?: boolean;

  /**
   * AUTO INCREMENT
   */
  ai?: boolean;
}

export class Column implements Constraint {
  nn: boolean = false;
  pk: boolean = false;
  un: boolean = false;
  ai: boolean = false;

  length?: number;

  constructor(
    public name: string,
    public type: DataType,
    constraint?: Constraint
  ) {
    Object.assign(this, constraint);
  }
}
