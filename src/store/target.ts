import { createSlice } from "@reduxjs/toolkit";
import { allTargets } from "../codegen";
import { SQLTarget } from "../codegen/SQL";
import { TargetLanguage } from "../codegen/TargetLanguage";

interface TargetState {
  current: TargetLanguage;
}

const initialState: TargetState = {
  current: new SQLTarget(),
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
  },
});

export const { pickTarget } = targetSlice.actions;
