import { SQLTarget } from "./SQL";
import { NodejsTypeORM } from "./NodejsTypeORM";
import { TargetLanguage } from "./TargetLanguage";

export const all = [new SQLTarget(), new NodejsTypeORM()];

type AllTargetMap = Record<string, TargetLanguage>;

export const allTargets: AllTargetMap = all.reduce((acc, next) => {
  acc[next.name] = next;
  return acc;
}, {} as AllTargetMap);
