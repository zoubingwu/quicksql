import { CodeGen } from "./CodeGen";

export class NodejsTypeORMGen implements CodeGen {
  language = "javascript";
  name = "Nodejs/TypeORM";

  hljsImport = () => import("highlight.js/lib/languages/javascript");
}
