import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allTargets } from "../codegen";
import { SQLTarget } from "../codegen/SQL";
import { TargetLanguage } from "../codegen/TargetLanguage";

interface GlobalState {
  currentTarget: TargetLanguage;
  showCode: boolean;
  propertyEditroPopoverOpened: boolean;
}

const initialState: GlobalState = {
  currentTarget: new SQLTarget(),
  showCode: false,
  propertyEditroPopoverOpened: false,
};

export const globalOptionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setCodeTarget(state, action) {
      const nextTarget = allTargets[action.payload];
      if (nextTarget) {
        state.currentTarget = nextTarget;
      }
    },

    toggleCode(state) {
      state.showCode = !state.showCode;
    },

    savePropertyEditorPopoverStatus(state, action: PayloadAction<boolean>) {
      state.propertyEditroPopoverOpened = action.payload;
    },
  },
});
