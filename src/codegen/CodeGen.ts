export abstract class CodeGen {
  emitLine(line: string) {}

  emit() {
    throw new Error("should implement codeGen method");
  }
}
