export interface TargetLanguage {
  language: string;
  name: string;

  hlImports(): Promise<any>;

  emitLine?(line: string): void;
  emitComment?(c: string): void;
  emit(): string;
}
