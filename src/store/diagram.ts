import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { Column, Constraint } from "../core/Column";
import { DataType } from "../core/DataType";
import { Relation } from "../core/Relation";
import { Table } from "../core/Table";
import { Point, Position } from "../core/Position";
import {
  findCurvePoints,
  findPositionWhenInsertNewTable,
  getColumnPositionData,
  resetTempCurve,
  DEFAULT_TABLE_POSITION,
} from "./diagram.helpers";

enableMapSet();

export interface DiagramState {
  tables: Record<string, Table>;
  positions: Record<string, Position>;
  relations: Record<string, Relation>;
  layers: number;
  selectedTable: string | null;
  generatedCode: string;
  creatingRelationCurve: boolean;
  tempRelationCurveStartColumn: Column | null;
  tempRelationCurveStartPosition: Position | null;
  tempRelationCurveEndPosition: Position | null;
}

const defaultTable = Table.create();
const initialState: DiagramState = {
  tables: {
    [defaultTable.id]: defaultTable,
  },
  positions: {
    [defaultTable.id]: DEFAULT_TABLE_POSITION,
  },
  relations: {},
  layers: 1,
  selectedTable: null,
  generatedCode: "",
  creatingRelationCurve: false,
  tempRelationCurveStartColumn: null,
  tempRelationCurveStartPosition: null,
  tempRelationCurveEndPosition: null,
};

type ColumnCellPosition = Pick<DOMRect, "x" | "y" | "width" | "height">;

export const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addNewTable(state) {
      const newTable = Table.create().setLayer(state.layers + 1);
      const newPosition = findPositionWhenInsertNewTable(state.positions);
      state.tables[newTable.id] = newTable;
      state.positions[newTable.id] = newPosition;
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
        const newTable = state.tables[id].clone().setLayer(state.layers + 1);
        const newPosition = findPositionWhenInsertNewTable(state.positions);
        state.tables[newTable.id] = newTable;
        state.positions[newTable.id] = newPosition;
        state.layers = newTable.layer;
      }
    },

    updatePosition(
      state,
      action: PayloadAction<{ id: string; position: Position }>
    ) {
      const { id, position } = action.payload;
      if (id in state.tables) {
        state.positions[id] = position;
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
    },

    setGeneratedCode(state, action: PayloadAction<string>) {
      state.generatedCode = action.payload;
    },

    startCreatingRelationCurve(
      state,
      action: PayloadAction<{
        column: Column;
        columnPosition: ColumnCellPosition;
        mousePosition: Position;
      }>
    ) {
      const { column, columnPosition, mousePosition } = action.payload;
      state.creatingRelationCurve = true;
      state.tempRelationCurveStartColumn = column;
      state.tempRelationCurveStartPosition = {
        x: columnPosition.x + columnPosition.width,
        y: columnPosition.y + columnPosition.height / 2,
      };
      state.tempRelationCurveEndPosition = mousePosition;
    },

    stopCreatingRelationCurve(
      state,
      action: PayloadAction<{
        column: Column;
        columnPosition: ColumnCellPosition;
        mousePosition: Position;
      }>
    ) {
      const fromColumn = state.tempRelationCurveStartColumn!;
      const { column: toColumn } = action.payload;
      const relations = Object.values(state.relations);
      if (
        toColumn.parentId === fromColumn!.parentId ||
        relations.some(
          (r) =>
            (r.fromColumnId === fromColumn.id &&
              r.toColumnId === toColumn.id) ||
            (r.fromColumnId === toColumn.id && r.toColumnId === toColumn.id)
        )
      ) {
        resetTempCurve(state as DiagramState);
        return;
      }

      const fromTableId = fromColumn.parentId;
      const toTableId = toColumn.parentId;
      let relation = new Relation(
        fromTableId,
        toTableId,
        fromColumn.id,
        toColumn.id
      );

      const a = getColumnPositionData(
        fromColumn as Column,
        state.tables[fromColumn.parentId].columns as Column[],
        state.positions
      );
      const b = getColumnPositionData(
        toColumn as Column,
        state.tables[toColumn.parentId].columns as Column[],
        state.positions
      );

      const curvePoints = findCurvePoints(a, b);

      relation = relation.setCurvePoints(curvePoints);
      state.relations[relation.id] = relation;
      const editedTableA = state.tables[fromTableId].changeColumnRelationStatus(
        fromColumn.id,
        true
      );
      const editedTableB = state.tables[toTableId].changeColumnRelationStatus(
        toColumn.id,
        true
      );

      state.tables[fromTableId] = editedTableA;
      state.tables[toTableId] = editedTableB;
      resetTempCurve(state as DiagramState);
    },

    cancelCreatingRelationCurve(state) {
      resetTempCurve(state as DiagramState);
    },

    setRelationCurve(
      state,
      action: PayloadAction<{
        id: string;
        points: Point[];
      }>
    ) {
      const { id, points } = action.payload;
      state.relations[id] = state.relations[id].setCurvePoints(points);
    },
  },
});
