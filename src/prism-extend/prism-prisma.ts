import Prism from "prismjs";

Prism.languages.prisma = Prism.languages.extend("clike", {
  keyword: /\b(?:datasource|enum|generator|model|type)\b/,
  "type-class-name": /(\b()\s+)[\w.\\]+/,
});

//@ts-ignore
Prism.languages.javascript["class-name"][0].pattern =
  /(\b(?:model|datasource|enum|generator|type)\s+)[\w.\\]+/;

Prism.languages.insertBefore("prisma", "function", {
  annotation: {
    pattern: /(^|[^.])@+\w+/,
    lookbehind: true,
    alias: "punctuation",
  },
});

Prism.languages.insertBefore("prisma", "punctuation", {
  "type-args": /\b(?:references|fields):/,
});
