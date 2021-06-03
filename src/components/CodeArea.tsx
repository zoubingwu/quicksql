import React, { useCallback, useEffect, useState } from "react";
import Prism from "prismjs";
import clsx from "clsx";
import Draggable from "react-draggable";
import { Button, HTMLSelect, Tab, Tabs } from "@blueprintjs/core";

import { useAppDispatch, useAppSelector, actions } from "../store";
import { all } from "../codegen";
import { useClipboard } from "../hooks/useClipboard";

import "prismjs/themes/prism-tomorrow.css";

type TabId = "target" | "format";

export const CodeArea: React.FC = () => {
  const [content, setContent] = useState("");
  const [currentTabId, setCurrentTabId] = useState<TabId>("target");
  const currentTarget = useAppSelector(
    (state) => state.globalOptions.currentTarget
  );
  const tables = useAppSelector((state) => state.diagram.tables);
  const showCode = useAppSelector((state) => state.globalOptions.showCode);
  const { hasCopied, onCopy } = useClipboard(content);
  const dispatch = useAppDispatch();

  const handleTargetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(actions.pickTarget(e.target.value));
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

      <Draggable handle=".tab-handle">
        <div className="tab-handle bg-white p-2 shadow border rounded-md min-w-48 max-w-72 absolute right-4 top-4">
          <Tabs selectedTabId={currentTabId} onChange={handleTabChange}>
            <Tab
              id="target"
              title="Target"
              panel={
                <div>
                  <div className="mb-2">
                    <HTMLSelect
                      onChange={handleTargetChange}
                      className="w-full"
                    >
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
      </Draggable>
    </div>
  );
};
