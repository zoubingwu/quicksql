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
  const targetOptions = useAppSelector(
    (state) => state.globalOptions.targetOptions
  );
  const dispatch = useAppDispatch();

  const handleCodeGenerate = async () => {
    const c = currentTarget.emit(tables, targetOptions);
    if (!(currentTarget.language in Prism.languages)) {
      await currentTarget.hlImports();
    }
    dispatch(actions.setGeneratedCode(c));
  };

  useEffect(() => {
    handleCodeGenerate();
  }, [tables, currentTarget, targetOptions]);

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
      <pre className="h-full !m-0 !bg-dark-200 !text-xs">
        <code className={`language-${currentTarget.language}`}>{content}</code>
      </pre>
    </div>
  );
};
