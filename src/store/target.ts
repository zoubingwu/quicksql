import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allTargets } from "../codegen";
import { SQLTarget } from "../codegen/SQL";
import { TargetLanguage } from "../codegen/TargetLanguage";

interface TargetState {
  current: TargetLanguage;
  showOptions: boolean;
}

const initialState: TargetState = {
  current: new SQLTarget(),
  showOptions: true,
};

export const targetSlice = createSlice({
  name: "target",
  initialState,
  reducers: {
    pickTarget(state, action) {
      const nextTarget = allTargets[action.payload];
      if (nextTarget) {
        state.current = nextTarget;
      }
    },

    toggleOptions(state) {
      state.showOptions = !state.showOptions;
    },
  },
});

export const { pickTarget, toggleOptions } = targetSlice.actions;
