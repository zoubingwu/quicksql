import { SQLTarget } from "./SQL";
import { NodejsTypeORM } from "./NodejsTypeORM";
import { TargetLanguage } from "./TargetLanguage";
import { NodejsPrisma } from "./NodejsPrisma";

export const all = [new SQLTarget(), new NodejsTypeORM(), new NodejsPrisma()];

type AllTargetMap = Record<string, TargetLanguage>;

export const allTargets: AllTargetMap = all.reduce((acc, next) => {
  acc[next.name] = next;
  return acc;
}, {} as AllTargetMap);
