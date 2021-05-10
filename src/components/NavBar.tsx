import React, { useCallback } from "react";
import { Icon } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleOptions } from "../store/target";

export function NavBar() {
  const showOptions = useAppSelector((state) => state.target.showOptions);
  const dispatch = useAppDispatch();
  const handleOptionsToggle = useCallback(() => {
    dispatch(toggleOptions());
  }, []);

  return (
    <div className="p-2 flex justify-between items-center bg-hex-106BA3 text-white">
      <div>QuickSQL</div>

      <div className="mx-2 flex">
        <div className="cursor-pointer" onClick={handleOptionsToggle}>
          <span className="mr-2">
            {showOptions ? <Icon icon="eye-open" /> : <Icon icon="eye-off" />}
          </span>
          <span>Options</span>
        </div>
      </div>
    </div>
  );
}
