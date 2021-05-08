import { createSlice } from "@reduxjs/toolkit";
import { Column } from "../core/Column";
import { DataType } from "../core/DataType";
import { Table } from "../core/Table";

interface DiagramState {
  tables: Table[];
}

const defaultPosition = { x: 50, y: 50 };
const defaultTable = new Table(
  "users",
  [
    new Column("id", DataType.INT, { AI: true, PK: true, NN: true }),
    new Column("created_at", DataType.DATETIME),
    new Column("updated_at", DataType.DATETIME),
  ],
  defaultPosition
);

const initialState: DiagramState = {
  tables: [defaultTable],
};

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
