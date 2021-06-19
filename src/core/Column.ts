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

export interface Column extends Constraint {
  id: string;
  name: string;
  type: DataType;
  parentId: string;
  length?: number;
  comment?: string;
  hasRelation: boolean;
}

export function createColumn(
  name: string,
  type: DataType,
  parentId: string,
  constraint: Constraint = {}
): Column {
  const id = nanoid();
  return {
    id,
    name,
    type,
    parentId,
    hasRelation: false,
    ...constraint,
  };
}

export function cloneColumn(c: Column): Column {
  const id = nanoid();
  return {
    ...c,
    id,
    hasRelation: false,
  };
}
