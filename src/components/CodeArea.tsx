import React, { useCallback, useEffect, useState } from "react";
import Prism from "prismjs";

import { useAppDispatch, useAppSelector } from "../store";
import { all } from "../codegen";
import { OptionBoard } from "./OptionBoard";
import { Button } from "./UIKit";
import { pickTarget } from "../store/target";

import "prismjs/themes/prism-tomorrow.css";

export const CodeArea: React.FC = () => {
  const [content, setContent] = useState("");
  const currentTarget = useAppSelector((state) => state.target.current);
  const dispatch = useAppDispatch();

  const handleTargetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(pickTarget(e.target.value));
    },
    []
  );

  const handleCodeGenerate = useCallback(async () => {
    const c = currentTarget.emit();
    if (!(currentTarget.language in Prism.languages)) {
      await currentTarget.hlImports();
    }
    setContent(c);
  }, [currentTarget]);

  useEffect(() => {
    handleCodeGenerate();
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className="flex-shrink-0 flex-grow-0 w-1/2 relative">
      <pre className="h-full !m-0">
        <code className={`language-${currentTarget.language}`}>{content}</code>
      </pre>

      <OptionBoard>
        <div className="mb-2">
          <span>Target: </span>
          <select onChange={handleTargetChange}>
            {all.map((i) => (
              <option value={i.name} key={i.name}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button className="w-full" onClick={handleCodeGenerate}>
            Generate Code
          </Button>
        </div>
      </OptionBoard>
    </div>
  );
};
