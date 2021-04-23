import React, { useState, useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";

import "highlight.js/styles/github-gist.css";

const code = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "sqlite"
  url      = env("DB_URL")
}

generator client {
  provider = "prisma-client-js"
}

// next-auth BEGIN

model Account {
  id                 Int       @id @default(autoincrement())
  compoundId         String    @unique @map(name: "compound_id")
  userId             String    @map(name: "user_id")
  providerType       String    @map(name: "provider_type")
  providerId         String    @map(name: "provider_id")
  providerAccountId  String    @map(name: "provider_account_id")
  refreshToken       String?   @map(name: "refresh_token")
  accessToken        String?   @map(name: "access_token")
  accessTokenExpires DateTime? @map(name: "access_token_expires")
  createdAt          DateTime  @default(now()) @map(name: "created_at")
  updatedAt          DateTime  @default(now()) @map(name: "updated_at")
  @@index([providerAccountId], name: "providerAccountId")
  @@index([providerId], name: "providerId")
  @@index([userId], name: "userId")
  @@map(name: "accounts")
}
`;

const supportedImportsMap = {
  go: () => import("highlight.js/lib/languages/go"),
  sql: () => import("highlight.js/lib/languages/sql"),
  javascript: () => import("highlight.js/lib/languages/javascript"),
  prisma: () => import("../language/prisma"),
};

type SupportedLanguage = keyof typeof supportedImportsMap;

const Highlight: React.FC<{
  code: string;
  language: SupportedLanguage;
}> = ({ code, language }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      (async function () {
        if (!hljs.getLanguage(language)) {
          const lang = await supportedImportsMap[language]();
          hljs.registerLanguage(language, lang.default);
        }
        hljs.highlightBlock(ref.current as HTMLElement);
      })();
    }
  }, [language]);

  return (
    <pre>
      <code ref={ref} className={`language-${language}`}>
        {code.trim()}
      </code>
    </pre>
  );
};

const ormToLangMap = {
  SQL: "sql",
  "Nodejs/TypeORM": "javascript",
  "Nodejs/Prisma": "javascript",
  "Go/gorm": "go",
  "Go/xorm": "go",
};

export function CodeArea() {
  const [lang, setLang] = useState<SupportedLanguage>("sql");

  return (
    <div className="flex-1">
      <select
        name=""
        id=""
        onChange={(e) => setLang(e.target.value as SupportedLanguage)}
      >
        {Object.entries(ormToLangMap).map(([k, v]) => {
          return (
            <option key={k} value={v}>
              {k}
            </option>
          );
        })}
      </select>
      <Highlight code={code} language={lang} />
    </div>
  );
}
