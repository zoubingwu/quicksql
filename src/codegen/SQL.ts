import { TargetLanguage } from "./TargetLanguage";

export class SQLTarget implements TargetLanguage {
  language = "sql";
  name = "SQL";

  hlImports = () => import("prismjs/components/prism-sql");

  emit() {
    return `CREATE TABLE Persons (
  PersonID int,
  LastName varchar(255),
  FirstName varchar(255),
  Address varchar(255),
  City varchar(255)
);
    `;
  }
}
