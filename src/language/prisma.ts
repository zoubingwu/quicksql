//@ts-ignore
export default function prisma(hljs) {
  const PRISMA_KEYWORDS = {
    keyword:
      "datasource module generator id default map index unique autoincrement now",
  };

  return {
    name: "prisma",
    keywords: PRISMA_KEYWORDS,
    illegal: "</",
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: "datasource",
        beginKeywords: "datasource",
      },
      {
        className: "model",
        beginKeywords: "model",
      },
    ],
  };
}
