/// <reference path="../typings.d.ts"/>

import React, { useEffect, useMemo } from "react";
import Prism from "prismjs";

import { useAppSelector } from "../store";
import { TargetLanguage } from "../codegen/TargetLanguage";
import { OptionBoard } from "./OptionBoard";
import { Button } from "./UIKit";

import "prismjs/themes/prism.css";

const Highlight: React.FC<{
  content: string;
  target: TargetLanguage;
}> = ({ content, target }) => {
  useEffect(() => {
    (async function () {
      if (!(target.language in Prism.languages)) {
        await target.hlImports();
      }
      Prism.highlightAll();
    })();
  }, []);

  return (
    <pre className="h-full !m-0">
      <code className={`language-${target.language}`}>{content}</code>
    </pre>
  );
};

export const CodeArea: React.FC = () => {
  const currentTarget = useAppSelector((state) => state.target.current);
  const content = useMemo(() => currentTarget.emit(), [currentTarget]);

  return (
    <div className="flex-auto w-1/2 relative">
      <Highlight content={content} target={currentTarget} />

      <OptionBoard>
        <div>
          <span>Target: </span>
          <select name="" id="">
            <option value="sql">SQL</option>
            <option value="sql">NodejsTypeORM</option>
          </select>
        </div>
        <div>
          <Button className="w-full">Generate Code</Button>
        </div>
      </OptionBoard>
    </div>
  );
};
