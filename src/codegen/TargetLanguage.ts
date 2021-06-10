import { Relation } from "../core/Relation";
import { Table } from "../core/Table";

export interface TargetOptions {
  diagramName: string;

  /**
   * prefix table name with diagram name
   */
  prefixTable: boolean;

  /**
   * prefix column name with table name
   */
  prefixColumn: boolean;
}

export abstract class TargetLanguage {
  public language: string;

  public name: string;

  protected content: string = "";

  public abstract hlImports(): Promise<any>;

  protected emitWhiteSpace(n = 1) {
    this.content += " ".repeat(n);
  }

  protected emitComma() {
    this.content = this.content.trimEnd();
    this.content += ",";
  }

  protected emitNewLine(n = 1) {
    this.content += "\n".repeat(n);
  }

  protected emitCode(code: string) {
    this.content += code;
  }

  protected emitCodeWithWhiteSpacePrepended(code: string) {
    this.emitWhiteSpace(1);
    this.emitCode(code);
  }

  protected emitCodeWithWhiteSpaceAppended(code: string) {
    this.emitCode(code);
    this.emitWhiteSpace(1);
  }

  protected emitCodeWithWhiteSpaceAround(code: string) {
    this.emitWhiteSpace(1);
    this.emitCode(code);
    this.emitWhiteSpace(1);
  }

  /**
   * emit code with new line appended.
   */
  protected emitCodeLine(code: string) {
    this.content += code;
    this.emitNewLine();
  }

  protected emitIndent(indent: number) {
    this.emitWhiteSpace(indent * 4);
  }

  public abstract emit(
    tables: Table[],
    relations: Relation[],
    options: TargetOptions
  ): string;
}
