import React, { useCallback, useEffect } from "react";
import Prism from "prismjs";
import clsx from "clsx";
import { useAppDispatch, useAppSelector, actions } from "../store";

import "prismjs/themes/prism-tomorrow.css";

export const CodeArea: React.FC = () => {
  const currentTarget = useAppSelector(
    (state) => state.globalOptions.currentTarget
  );
  const content = useAppSelector((state) => state.diagram.generatedCode);
  const tables = useAppSelector((state) => state.diagram.tables);
  const showCode = useAppSelector((state) => state.globalOptions.showCode);
  const dispatch = useAppDispatch();

  const handleCodeGenerate = useCallback(async () => {
    const c = currentTarget.emit(tables);
    if (!(currentTarget.language in Prism.languages)) {
      await currentTarget.hlImports();
    }
    dispatch(actions.setGeneratedCode(c));
  }, [currentTarget, tables]);

  useEffect(() => {
    handleCodeGenerate();
  }, [tables, currentTarget]);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div
      className={clsx(
        "code-area flex-shrink-0 flex-grow-0 relative transition-all overflow-hidden",
        showCode ? "w-1/3" : "w-0"
      )}
    >
      <pre className="h-full !m-0 !bg-dark-200">
        <code className={`language-${currentTarget.language}`}>{content}</code>
      </pre>
    </div>
  );
};
