import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Column } from "../core/Column";
import { DataType } from "../core/DataType";
import { Position, Table } from "../core/Table";

interface DiagramState {
  tables: Record<string, Table>;
  layers: number;
  selectedTable: string | null;
  generatedCode: string;
}

export const defaultPosition = { x: 50, y: 50 };

const createTable = () =>
  new Table(
    "users",
    [
      new Column("id", "INT", { AI: true, PK: true, NN: true }),
      new Column("created_at", "DATETIME"),
      new Column("updated_at", "DATETIME"),
    ],
    defaultPosition
  );

const defaultTable = createTable();

const initialState: DiagramState = {
  tables: {
    [defaultTable.id]: defaultTable,
  },
  layers: 1,
  selectedTable: null,
  generatedCode: "",
};

function isCloseEnough(a: Position, b: Position): boolean {
  return Math.abs(a.x - b.x) <= 10 && Math.abs(a.y - b.y) <= 10;
}

export const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addNewTable(state) {
      let newTable = createTable().setLayer(state.layers + 1);
      const currentTables = Object.values(state.tables);

      while (
        currentTables.some((t) => isCloseEnough(t.position, newTable.position))
      ) {
        newTable = newTable.setPosition({
          x: newTable.position.x + 50,
          y: newTable.position.y + 50,
        });
      }

      state.tables[newTable.id] = newTable;
      state.layers = newTable.layer;
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

    updateColumnName(
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

    updateColumnDataType(
      state,
      action: PayloadAction<{
        tableId: string;
        columnId: string;
        columnType: DataType;
      }>
    ) {
      const { tableId, columnId, columnType } = action.payload;
      if (tableId in state.tables) {
        state.tables[tableId] = state.tables[tableId].changeColumnDataType(
          columnId,
          columnType
        );
      }
    },

    addNewColumn(state, action: PayloadAction<string>) {
      const tableId = action.payload;
      if (tableId in state.tables) {
        state.tables[tableId] = state.tables[tableId].addNewColumn();
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

    setSelected(state, action: PayloadAction<string | null>) {
      state.selectedTable = action.payload;
    },

    setGeneratedCode(state, action: PayloadAction<string>) {
      state.generatedCode = action.payload;
    },
  },
});
