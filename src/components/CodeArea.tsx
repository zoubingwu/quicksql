import React, { useState, useEffect, useRef } from "react";

const code = `// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    versions, err := UnmarshalVersions(bytes)
//    bytes, err = versions.Marshal()

package main

import "encoding/json"

func UnmarshalVersions(data []byte) (Versions, error) {
	var r Versions
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Versions) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Versions struct {
	Versions VersionsClass \`json:"versions"\`
}

type VersionsClass struct {
	Android     Android \`json:"Android"\`
	MACOS       Android \`json:"MacOS"\`
	Windows     Android \`json:"Windows"\`
	IOS         Android \`json:"iOS"\`
	IOSExtra    Android \`json:"iOS_extra"\`
	MACOSNative Android \`json:"MacOS_native"\`
}

type Android struct {
	DownloadLink  string \`json:"download_link"\`
	QrLink        string \`json:"qr_link"\`
	VersionNumber string \`json:"version_number"\`
	Weight        int64  \`json:"weight"\`
	Hash          string \`json:"hash"\`
}
`;

const supported = {
  //@ts-ignore
  go: () => import("highlight.js/lib/languages/go"),
};

const Highlight: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      (async function () {
        //@ts-ignore
        const hljs = await import("highlight.js/lib/core");
        //@ts-ignore
        const lang = await supported[language]();
        hljs.registerLanguage(language, lang.default);
        hljs.highlightBlock(ref.current as HTMLElement);
      })();
    }
  }, [language]);

  useEffect(() => {
    import("highlight.js/styles/github-gist.css");
  }, []);

  return (
    <pre className="flex-1">
      <code ref={ref} className={`language-${language}`}>
        {code.trim()}
      </code>
    </pre>
  );
};

export function CodeArea() {
  const [lang, setLang] = useState("go");

  return <Highlight code={code} language={lang} />;
}
