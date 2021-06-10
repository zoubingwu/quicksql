export const dataTypes = [
  // int types
  "INT",
  "BIGINT",
  "DECIMAL",

  // string types
  "VARCHAR",
  "TEXT",

  // date types
  "DATETIME",
  "TIME",
  "TIMESTAMP",

  // binary types
  "BINARY",
  "BLOB",
  "VARBINARY",
] as const;

export type DataType = typeof dataTypes[number];
