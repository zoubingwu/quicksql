export const dataTypes = ["INT", "VARCHAR", "DATETIME"] as const;

export type DataType = typeof dataTypes[number];
