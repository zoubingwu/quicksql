export interface TargetLanguage {
  language: string;
  name: string;

  emitLine?(line: string): void;
  emitComment?(c: string): void;
  emit(): string;

  hljsImport(): Promise<typeof import("highlight.js/lib/languages/*")>;
}
