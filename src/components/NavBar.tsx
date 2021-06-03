import React, { useCallback } from "react";
import { Icon } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector, actions } from "../store";

export function NavBar() {
  const showCode = useAppSelector((state) => state.globalOptions.showCode);
  const dispatch = useAppDispatch();
  const handleOptionsToggle = useCallback(() => {
    dispatch(actions.toggleCode());
  }, []);

  return (
    <div className="nav-bar p-2 flex justify-between items-center bg-hex-106BA3 text-white">
      <div>QuickSQL</div>

      <div className="nav-bar-links mx-2 flex">
        <a
          href="https://github.com/zoubingwu/quicksql"
          target="_blank"
          className="text-light-200 mr-4 hover:text-light-200"
        >
          GitHub
        </a>
        <div className="cursor-pointer" onClick={handleOptionsToggle}>
          <span className="mr-2">
            {showCode ? <Icon icon="eye-open" /> : <Icon icon="eye-off" />}
          </span>
          <span>Code</span>
        </div>
      </div>
    </div>
  );
}
