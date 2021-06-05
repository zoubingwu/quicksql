import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allTargets } from "../codegen";
import { SQLTarget } from "../codegen/SQL";
import { TargetLanguage, TargetOptions } from "../codegen/TargetLanguage";

interface GlobalState {
  currentTarget: TargetLanguage;
  showCode: boolean;
  propertyEditroPopoverOpened: boolean;
  targetOptions: TargetOptions;
}

const initialState: GlobalState = {
  currentTarget: new SQLTarget(),
  showCode: true,
  propertyEditroPopoverOpened: false,
  targetOptions: {
    prefixTable: false,
    prefixColumn: false,
    diagramName: "",
  },
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

    setPrefixTable(state, action: PayloadAction<boolean>) {
      state.targetOptions.prefixTable = action.payload;
    },

    setPrefixColumn(state, action: PayloadAction<boolean>) {
      state.targetOptions.prefixColumn = action.payload;
    },

    setDiagramName(state, action: PayloadAction<string>) {
      state.targetOptions.diagramName = action.payload;
    },
  },
});
