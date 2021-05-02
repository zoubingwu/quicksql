import React, { useCallback, useRef } from "react";
import { Button, Select, useDisclosure } from "@chakra-ui/react";

import { allTargets } from "../codegen";
import { CodeAreaDrawer } from "./CodeAreaDrawer";
import { useAppDispatch } from "../store";
import { pickTarget } from "../store/target";

export function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(pickTarget(e.target.value));
    },
    []
  );

  return (
    <div className="p-2 flex justify-between items-center">
      <div>QuickSQL</div>

      <div className="mx-2 flex">
        <Select size="sm" onChange={handleSelect}>
          {Object.values(allTargets).map((item) => {
            return (
              <option value={item.name} key={item.name}>
                {item.name}
              </option>
            );
          })}
        </Select>
        <Button
          ref={btnRef}
          size="sm"
          className="ml-2"
          minWidth="120px"
          onClick={onOpen}
        >
          Generate Code
        </Button>
      </div>

      <CodeAreaDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </div>
  );
}
