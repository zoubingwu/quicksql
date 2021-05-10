import { Table } from "../core/Table";

export abstract class TargetLanguage {
  public language: string;

  public name: string;

  protected content: string = "";

  public abstract hlImports(): Promise<any>;

  protected emitWhiteSpace(n: number = 1) {
    this.content += " ".repeat(n);
  }

  protected emitComma() {
    this.content = this.content.trimEnd();
    this.content += ",";
  }

  protected emitNewLine() {
    this.content += "\n";
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

  protected emitCodeLine(code: string) {
    this.content += code;
    this.emitNewLine();
  }

  public abstract emit(tables: Record<string, Table>): string;
}
