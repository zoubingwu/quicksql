import React, { useCallback, useEffect, useState } from "react";
import Prism from "prismjs";
import { Button, HTMLSelect, Tab, Tabs } from "@blueprintjs/core";

import { useAppDispatch, useAppSelector } from "../store";
import { all } from "../codegen";
import { pickTarget } from "../store/target";
import { useClipboard } from "../hooks/useClipboard";

import "prismjs/themes/prism-tomorrow.css";

type TabId = "target" | "format";

export const CodeArea: React.FC = () => {
  const [content, setContent] = useState("");
  const [currentTabId, setCurrentTabId] = useState<TabId>("target");
  const currentTarget = useAppSelector((state) => state.target.current);
  const tables = useAppSelector((state) => state.diagram.tables);
  const { hasCopied, onCopy } = useClipboard(content);
  const dispatch = useAppDispatch();

  const handleTargetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(pickTarget(e.target.value));
    },
    []
  );

  const handleCodeGenerate = useCallback(async () => {
    const c = currentTarget.emit(tables);
    if (!(currentTarget.language in Prism.languages)) {
      await currentTarget.hlImports();
    }
    setContent(c);
  }, [currentTarget, tables]);

  const handleTabChange = useCallback((id: TabId) => {
    setCurrentTabId(id);
  }, []);

  useEffect(() => {
    handleCodeGenerate();
  }, [tables]);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className="flex-shrink-0 flex-grow-0 w-1/2 relative">
      <pre className="h-full !m-0">
        <code className={`language-${currentTarget.language}`}>{content}</code>
      </pre>

      <Tabs
        selectedTabId={currentTabId}
        onChange={handleTabChange}
        className="absolute right-4 top-4 bg-white p-2 shadow border rounded-md min-w-48 max-w-72"
      >
        <Tab
          id="target"
          title="Target"
          panel={
            <div>
              <div className="mb-2">
                <HTMLSelect onChange={handleTargetChange} className="w-full">
                  {all.map((i) => (
                    <option value={i.name} key={i.name}>
                      {i.name}
                    </option>
                  ))}
                </HTMLSelect>
              </div>

              <div className="mb-2">
                <Button className="w-full" onClick={onCopy}>
                  {hasCopied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </div>
          }
        />

        <Tab id="format" title="Format" panel={<div></div>} />
      </Tabs>
    </div>
  );
};
