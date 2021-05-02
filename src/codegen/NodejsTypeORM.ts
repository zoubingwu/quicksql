import { TargetLanguage } from "./TargetLanguage";

export class NodejsTypeORM implements TargetLanguage {
  language = "javascript" as const;
  name = "Nodejs/TypeORM" as const;

  hljsImport = () => import("highlight.js/lib/languages/javascript");

  emit() {
    return `import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;

}
    `;
  }
}
