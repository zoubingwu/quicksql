import React, { useEffect, useRef, useMemo } from "react";
import hljs from "highlight.js/lib/core";
import {
  useClipboard,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";

import { useAppSelector } from "../store";
import { TargetLanguage } from "../codegen/TargetLanguage";

import "highlight.js/styles/github-gist.css";

const Highlight: React.FC<{
  content: string;
  target: TargetLanguage;
}> = ({ content, target }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      (async function () {
        if (!hljs.getLanguage(target.language)) {
          const lang = await target.hljsImport();
          hljs.registerLanguage(target.language, lang.default);
        }
        hljs.highlightBlock(ref.current as HTMLElement);
      })();
    }
  }, [target]);

  return (
    <pre>
      <code ref={ref} className={`language-${target.language}`}>
        {content.trim()}
      </code>
    </pre>
  );
};

export const CodeAreaDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  btnRef: React.MutableRefObject<HTMLButtonElement | null>;
}> = ({ onClose, isOpen, btnRef }) => {
  const currentTarget = useAppSelector((state) => state.target.current);
  const content = useMemo(() => currentTarget.emit(), [currentTarget, isOpen]);

  const { hasCopied, onCopy } = useClipboard(content);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
      size="xl"
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody>
            <Highlight content={content} target={currentTarget} />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onCopy}>
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
