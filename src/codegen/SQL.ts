import { Table } from "../core/Table";
import { TargetLanguage } from "./TargetLanguage";

export class SQLTarget extends TargetLanguage {
  language = "sql";
  name = "SQL";

  hlImports = () => import("prismjs/components/prism-sql");

  emit(tableRecords: Record<string, Table>) {
    this.content = "";

    const tables = Object.values(tableRecords);

    tables.forEach((table) => {
      this.emitCodeLine(`CREATE TABLE ${table.name} (`);

      const maxColumnNameLength = Math.max(
        ...table.columns.map((c) => c.name.length)
      );

      table.columns.forEach((column) => {
        this.emitWhiteSpace(4);
        this.emitCode(`${column.name}`.padEnd(maxColumnNameLength + 2, " "));
        this.emitCode(column.type.toLowerCase().padEnd(10));

        if (column.NN) {
          this.emitCodeWithWhiteSpaceAppended("NOT NULL");
        } else {
          this.emitCodeWithWhiteSpaceAppended("NULL");
        }

        if (column.UN) {
          this.emitCodeWithWhiteSpaceAppended("UNIQUE");
        }

        if (column.AI) {
          this.emitCodeWithWhiteSpaceAppended("AUTO_INCREMENT");
        }

        if (column.PK) {
          this.emitCodeWithWhiteSpaceAppended("PRIMARY KEY");
        }

        this.emitComma();
        this.emitNewLine();
      });

      this.emitCode(");");
      this.emitNewLine(2);
    });

    return this.content;
  }
}
