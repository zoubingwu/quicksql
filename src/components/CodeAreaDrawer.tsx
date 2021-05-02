import React, { useEffect, useRef, useMemo } from "react";
import hljs from "highlight.js/lib/core";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useAppSelector } from "../store";

import "highlight.js/styles/github-gist.css";

const Highlight: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const currentTarget = useAppSelector((state) => state.target.current);
  const content = useMemo(() => currentTarget.emit(), [currentTarget]);

  useEffect(() => {
    if (ref.current) {
      (async function () {
        if (!hljs.getLanguage(currentTarget.language)) {
          const lang = await currentTarget.hljsImport();
          hljs.registerLanguage(currentTarget.language, lang.default);
        }
        hljs.highlightBlock(ref.current as HTMLElement);
      })();
    }
  }, [currentTarget]);

  return (
    <pre>
      <code ref={ref} className={`language-${currentTarget.language}`}>
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
            <header>123</header>
            <Highlight />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
