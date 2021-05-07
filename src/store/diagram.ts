import { createSlice } from "@reduxjs/toolkit";
import { Column } from "../core/Column";
import { Table } from "../core/Table";

interface DiagramState {
  tables: Table[];
}

const initialState: DiagramState = {
  tables: [],
};

const defaultPosition = { x: 50, y: 50 };
const defaultTable = new Table(
  "users",
  [
    new Column("id", "int", { ai: true, pk: true, nn: true }),
    new Column("created_at", "datetime"),
    new Column("updated_at", "datetime"),
  ],
  defaultPosition
);

export const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addTable(state) {
      state.tables.push(defaultTable);
    },
  },
});

export const { addTable } = diagramSlice.actions;
