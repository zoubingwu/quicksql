import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Column } from "../core/Column";
import { DataType } from "../core/DataType";
import { Position, Table } from "../core/Table";

interface DiagramState {
  tables: Record<string, Table>;
  layers: number;
}

export const defaultPosition = { x: 50, y: 50 };
const createTable = () =>
  new Table(
    "users",
    [
      new Column("id", DataType.INT, { AI: true, PK: true, NN: true }),
      new Column("created_at", DataType.DATETIME),
      new Column("updated_at", DataType.DATETIME),
    ],
    defaultPosition
  );

const defaultTable = createTable();

const initialState: DiagramState = {
  tables: {
    [defaultTable.id]: defaultTable,
  },
  layers: 1,
};

export const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addTable(state) {
      const defaultTable = createTable().setLayer(state.layers + 1);
      state.tables[defaultTable.id] = defaultTable;
      state.layers = defaultTable.layer;
    },

    updatePosition(
      state,
      action: PayloadAction<{ id: string; position: Position }>
    ) {
      const { id, position } = action.payload;
      if (id in state.tables) {
        state.tables[id] = state.tables[id].setPosition(position);
      }
    },

    updateTableName(
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) {
      const { id, name } = action.payload;
      if (id in state.tables) {
        state.tables[id] = state.tables[id].setName(name);
      }
    },

    updateFiledName(
      state,
      action: PayloadAction<{
        tableId: string;
        columnId: string;
        columnName: string;
      }>
    ) {
      const { tableId, columnId, columnName } = action.payload;
      if (tableId in state.tables) {
        state.tables[tableId] = state.tables[tableId].changeColumnName(
          columnId,
          columnName
        );
      }
    },

    setTopLayer(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id in state.tables) {
        const layer = state.layers + 1;
        state.tables[id] = state.tables[id].setLayer(layer);
        state.layers = layer;
      }
    },
  },
});

export const {
  addTable,
  updatePosition,
  updateTableName,
  updateFiledName,
  setTopLayer,
} = diagramSlice.actions;
