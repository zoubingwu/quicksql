import { CodeGen } from "./CodeGen";

export class SQLGen implements CodeGen {
  name = "SQL";
  language = "sql";
  hljsImport = () => import("highlight.js/lib/languages/sql");
}
