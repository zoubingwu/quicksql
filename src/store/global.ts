import { createSlice } from "@reduxjs/toolkit";
import { allTargets } from "../codegen";
import { SQLTarget } from "../codegen/SQL";
import { TargetLanguage } from "../codegen/TargetLanguage";

interface GlobalState {
  currentTarget: TargetLanguage;
  showCode: boolean;
}

const initialState: GlobalState = {
  currentTarget: new SQLTarget(),
  showCode: false,
};

export const globalOptionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    pickTarget(state, action) {
      const nextTarget = allTargets[action.payload];
      if (nextTarget) {
        state.currentTarget = nextTarget;
      }
    },

    toggleCode(state) {
      state.showCode = !state.showCode;
    },
  },
});
