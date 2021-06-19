import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet, original } from "immer";
import { Column, Constraint, createColumn } from "../core/Column";
import { DataType } from "../core/DataType";
import { createRelation, Relation } from "../core/Relation";
import { cloneTable, createTable, Table } from "../core/Table";
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

const defaultTable = createTable();

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
      const newTable = createTable();
      newTable.layer = state.layers + 1;
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
        const newTable = cloneTable(original(state.tables[id]) as Table);
        newTable.layer++;
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
        state.tables[id].name = name;
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
        state.tables[tableId].columnMap.get(columnId)!.name = columnName;
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
        state.tables[tableId].columnMap.get(columnId)!.type = columnType;
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
        state.tables[tableId].columnMap.get(columnId)![constraint] = value;
      }
    },

    addNewColumn(state, action: PayloadAction<string>) {
      const tableId = action.payload;
      if (tableId in state.tables) {
        const c = createColumn("new_column", "INT", tableId);
        state.tables[tableId].columns.push(c);
        state.tables[tableId].columnMap.set(c.id, c);
      }
    },

    setTopLayer(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id in state.tables) {
        state.tables[id].layer = state.layers + 1;
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
            (r.from.id === fromColumn.id && r.to.id === toColumn.id) ||
            (r.from.id === toColumn.id && r.to.id === toColumn.id)
        )
      ) {
        resetTempCurve(state as DiagramState);
        return;
      }

      const fromTableId = fromColumn.parentId;
      const toTableId = toColumn.parentId;
      let relation = createRelation(fromColumn, toColumn);

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
      relation.curvePoints = curvePoints;
      state.relations[relation.id] = relation;
      state.tables[fromTableId].columnMap.get(fromColumn.id)!.hasRelation =
        true;
      state.tables[toTableId].columnMap.get(toColumn.id)!.hasRelation = true;
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
      state.relations[id].curvePoints = points;
    },
  },
});
