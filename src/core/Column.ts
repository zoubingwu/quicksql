export type DataType = "int" | "varchar";

export class Column {
  name: string;
  type: DataType;

  /**
   * NOT NULL
   */
  nn: boolean;

  /**
   * PRIMARY KEY
   */
  pk: boolean;

  /**
   * UNIQUE
   */
  un: boolean;

  /**
   * AUTO INCREMENT
   */
  ai: boolean;
}
