import { createSlice } from "@reduxjs/toolkit";
import { Table } from "../core/Table";

interface DiagramState {
  tables: Table[];
}

const initialState: DiagramState = {
  tables: [],
};

export const diagramSlice = createSlice({
  name: "target",
  initialState,
  reducers: {},
});

export const {} = diagramSlice.actions;
