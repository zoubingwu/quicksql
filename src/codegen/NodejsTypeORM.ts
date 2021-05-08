import { TargetLanguage } from "./TargetLanguage";

export class NodejsTypeORM extends TargetLanguage {
  language = "javascript";
  name = "Nodejs/TypeORM";

  hlImports = () => import("prismjs/components/prism-javascript");

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
