import { TargetLanguage } from "./TargetLanguage";

export class GoGorm extends TargetLanguage {
  language = "go";
  name = "Go/Gorm";

  hlImports = () => import("prismjs/components/prism-go");

  emit() {
    return `type User struct {
  ID           uint     \`gorm:"primaryKey"\`
  Name         string
  Email        *string
  Age          uint8
  Birthday     *time.Time
  MemberNumber sql.NullString
  ActivatedAt  sql.NullTime
  CreatedAt    time.Time
  UpdatedAt    time.Time
}

type Author struct {
  Name  string
  Email string
}

type Blog struct {
  ID      int
  Author  Author \`gorm: "embedded"\`
  Upvotes int32
}

`;
  }
}
