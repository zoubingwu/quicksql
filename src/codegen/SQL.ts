import { Table } from "../core/Table";
import { TargetLanguage, TargetOptions } from "./TargetLanguage";

export class SQLTarget extends TargetLanguage {
  language = "sql";
  name = "SQL";

  hlImports = () => import("prismjs/components/prism-sql");

  emit(tableRecords: Record<string, Table>, options: TargetOptions) {
    this.content = "";

    const tables = Object.values(tableRecords);

    const prefixTableName = (name: string) => {
      return options.prefixTable && options.diagramName
        ? `${options.diagramName}_${name}`
        : name;
    };

    tables.forEach((table) => {
      let indent = 0;
      this.emitCodeLine(`CREATE TABLE ${prefixTableName(table.name)} (`);
      indent++;

      const prefixColumnName = (name: string) => {
        return options.prefixColumn ? `${table.name}_${name}` : name;
      };

      const maxColumnNameLength = Math.max(
        ...table.columns.map((c) => prefixColumnName(c.name).length)
      );

      table.columns.forEach((column) => {
        this.emitIndent(indent);
        this.emitCode(
          `${prefixColumnName(column.name)}`.padEnd(
            maxColumnNameLength + 2,
            " "
          )
        );
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

        this.emitComma();
        this.emitNewLine();
      });

      this.emitIndent(indent);
      this.emitCodeLine(
        `PRIMARY KEY (${table.columns
          .filter((c) => c.PK)
          .map((c) => c.name)
          .join(", ")})`
      );

      this.emitCodeLine(");");
      this.emitNewLine();
    });

    return this.content;
  }
}
