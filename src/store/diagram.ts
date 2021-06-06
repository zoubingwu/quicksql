import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { Column, Constraint } from "../core/Column";
import { DataType } from "../core/DataType";
import { Relation } from "../core/Relation";
import { Table } from "../core/Table";
import { Position } from "../core/Position";

enableMapSet();

interface DiagramState {
  tables: Record<string, Table>;
  relations: Record<string, Relation>;
  layers: number;
  selectedTable: string | null;
  generatedCode: string;
  creatingRelationCurve: boolean;
  tempRelationCurveStartColumn: Column | null;
  tempRelationCurveStartPosition: Position | null;
  tempRelationCurveEndColumn: Column | null;
  tempRelationCurveEndPosition: Position | null;
}

const defaultTable = Table.create();

const initialState: DiagramState = {
  tables: {
    [defaultTable.id]: defaultTable,
  },
  relations: {},
  layers: 1,
  selectedTable: null,
  generatedCode: "",
  creatingRelationCurve: false,
  tempRelationCurveStartColumn: null,
  tempRelationCurveStartPosition: null,
  tempRelationCurveEndColumn: null,
  tempRelationCurveEndPosition: null,
};

function isCloseEnough(a: Position, b: Position): boolean {
  return Math.abs(a.x - b.x) <= 10 && Math.abs(a.y - b.y) <= 10;
}

function findBetterPosition(allTables: Table[], target: Table) {
  while (allTables.some((t) => isCloseEnough(t.position, target.position))) {
    target = target.setPosition({
      x: target.position.x,
      y: target.position.y + 150,
    });
  }

  return target;
}

export const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addNewTable(state) {
      let newTable = Table.create().setLayer(state.layers + 1);
      const currentTables = Object.values(state.tables);
      newTable = findBetterPosition(currentTables as Table[], newTable);
      state.tables[newTable.id] = newTable;
      state.layers = newTable.layer;
    },

    deleteTable(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedTable === id) {
        state.selectedTable = null;
      }
      delete state.tables[id];
    },

    duplicateTable(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id in state.tables) {
        let newTable = state.tables[id].clone();
        const currentTables = Object.values(state.tables);
        newTable = findBetterPosition(currentTables as Table[], newTable);
        newTable = newTable.setLayer(state.layers + 1);
        state.tables[newTable.id] = newTable;
        state.layers = newTable.layer;
      }
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

    updateColumnConstrain(
      state,
      action: PayloadAction<{
        tableId: string;
        columnId: string;
        constraint: keyof Constraint;
        value: boolean;
      }>
    ) {
      const { tableId, columnId, constraint, value } = action.payload;
      if (tableId in state.tables) {
        state.tables[tableId] = state.tables[tableId].changeColumnConstrain(
          columnId,
          constraint,
          value
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
      if (!action.payload && state.creatingRelationCurve) {
        state.creatingRelationCurve = false;
        state.tempRelationCurveStartColumn = null;
        state.tempRelationCurveStartPosition = null;
        state.tempRelationCurveEndColumn = null;
        state.tempRelationCurveEndPosition = null;
      }
    },

    setGeneratedCode(state, action: PayloadAction<string>) {
      state.generatedCode = action.payload;
    },

    startCreatingRelationCurve(
      state,
      action: PayloadAction<{
        column: Column;
        start: Position;
        end: Position;
      }>
    ) {
      const { column, start, end } = action.payload;
      state.creatingRelationCurve = true;
      state.tempRelationCurveStartColumn = column;
      state.tempRelationCurveStartPosition = start;
      state.tempRelationCurveEndPosition = end;
    },

    stopCreatingRelationCurve(
      state,
      action: PayloadAction<{
        column: Column;
        end: Position;
      }>
    ) {
      const { column, end } = action.payload;
      state.creatingRelationCurve = false;
      state.tempRelationCurveEndColumn = column;
      state.tempRelationCurveEndPosition = end;
    },

    cancelCreatingRelationCurve(state) {
      state.creatingRelationCurve = false;
      state.tempRelationCurveStartColumn = null;
      state.tempRelationCurveStartPosition = null;
      state.tempRelationCurveEndColumn = null;
      state.tempRelationCurveEndPosition = null;
    },
  },
});
