import React, { useCallback } from "react";
import clsx from "clsx";
import {
  Classes,
  Popover,
  HTMLSelect,
  Checkbox,
  Label,
  Icon,
  EditableText,
  Button,
  Switch,
} from "@blueprintjs/core";
import { useAppSelector, actions, useAppDispatch } from "../store";
import { Column, Constraint } from "../core/Column";
import { DataType, dataTypes } from "../core/DataType";
import { all } from "../codegen";
import { useClipboard } from "../hooks/useClipboard";

const editorHeaderClassName = "p-2 border-b-1 border-cool-gray-700";
const editorRowTitleClassName = clsx("mb-2 ", Classes.TEXT_MUTED);
const editorRowInputClassName = clsx("w-full", Classes.INPUT);

const DiagramProperyEditor: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  onClick,
}) => {
  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.diagram.generatedCode);
  const targetOptions = useAppSelector(
    (state) => state.globalOptions.targetOptions
  );
  const { prefixTable, prefixColumn, diagramName } = targetOptions;
  const { hasCopied, onCopy } = useClipboard(code);
  const handleTargetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(actions.setCodeTarget(e.target.value));
    },
    []
  );
  const handlePrefixTableChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      dispatch(actions.setPrefixTable(e.currentTarget.checked));
    },
    []
  );
  const handlePrefixColumnChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      dispatch(actions.setPrefixColumn(e.currentTarget.checked));
    },
    []
  );
  const handleDiagramNameChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      dispatch(actions.setDiagramName(e.currentTarget.value));
    },
    []
  );

  return (
    <div
      className={clsx("quicksql-diagram-property-editor", className)}
      onClick={onClick}
    >
      <header className={editorHeaderClassName}>Diagram Properties</header>

      <div className="p-2">
        <div className={editorRowTitleClassName}>Target</div>
        <HTMLSelect onChange={handleTargetChange} className="w-full">
          {all.map((i) => (
            <option value={i.name} key={i.name}>
              {i.name}
            </option>
          ))}
        </HTMLSelect>
      </div>

      <div className="p-2">
        <div className={editorRowTitleClassName}>Diagram</div>
        <input
          className={clsx(editorRowInputClassName, "mb-2")}
          type="text"
          placeholder="diagram name..."
          value={diagramName}
          onChange={handleDiagramNameChange}
        />

        <Switch
          checked={prefixTable}
          label="Prefix table name with diagram name"
          onChange={handlePrefixTableChange}
        />
        <Switch
          checked={prefixColumn}
          label="Prefix column name with table name"
          onChange={handlePrefixColumnChange}
        />
      </div>

      <div className="p-2">
        <div className={editorRowTitleClassName}>Description</div>
        <textarea
          className={editorRowInputClassName}
          placeholder="comment..."
        />
      </div>

      <div className="p-2">
        <Button className="w-full" onClick={onCopy}>
          {hasCopied ? "Copied!" : "Copy Code"}
        </Button>
      </div>
    </div>
  );
};

const ColumnPopover: React.FC<{
  column: Column;
  tableId: string;
}> = ({ column, tableId }) => {
  const { name, id: columnId, type, PK, UN, NN, AI, comment } = column;
  const dispatch = useAppDispatch();

  const handleColumnNameChange = useCallback(
    (value) => {
      dispatch(
        actions.updateColumnName({
          tableId,
          columnId: column.id,
          columnName: value,
        })
      );
    },
    [tableId, columnId]
  );

  const handleColumnTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        actions.updateColumnDataType({
          tableId,
          columnId,
          columnType: e.currentTarget.value as DataType,
        })
      );
    },
    [tableId, columnId]
  );

  const handleColumnConstrainChange = (
    e: React.FormEvent<HTMLInputElement>,
    key: keyof Constraint
  ) => {
    dispatch(
      actions.updateColumnConstrain({
        tableId,
        columnId,
        constraint: key,
        value: e.currentTarget.checked,
      })
    );
  };

  return (
    <div className="quicksql-column-editor p-4 rounded w-300px">
      <Label>
        <div className={Classes.TEXT_MUTED}>Column Name</div>
        <EditableText defaultValue={name} onConfirm={handleColumnNameChange} />
      </Label>

      <Label>
        <div className={Classes.TEXT_MUTED}>Data Type</div>
        <HTMLSelect
          className="w-full"
          value={type}
          onChange={handleColumnTypeChange}
        >
          {dataTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </HTMLSelect>
      </Label>

      <Checkbox
        label="Primary Key"
        checked={PK}
        onChange={(e) => handleColumnConstrainChange(e, "PK")}
      />
      <Checkbox
        label="Not Null"
        checked={NN}
        onChange={(e) => handleColumnConstrainChange(e, "NN")}
      />
      <Checkbox
        label="Unique"
        checked={UN}
        onChange={(e) => handleColumnConstrainChange(e, "UN")}
      />
      <Checkbox
        label="Auto Increment"
        checked={AI}
        onChange={(e) => handleColumnConstrainChange(e, "PK")}
      />

      <Label>
        <div className={Classes.TEXT_MUTED}>Comment</div>
        <textarea
          className={editorRowInputClassName}
          defaultValue={comment}
          placeholder="comment..."
        />
      </Label>
    </div>
  );
};

const TableProperyEditor: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  onClick,
}) => {
  const dispatch = useAppDispatch();
  const selectedTable = useAppSelector((state) => {
    const id = state.diagram.selectedTable!;
    return state.diagram.tables[id];
  });
  const { columns, name, id } = selectedTable;
  const handleAddNewColumn = useCallback(() => {
    dispatch(actions.addNewColumn(id));
  }, [id]);
  const handleTableNameChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value;
      if (val === name) return;
      dispatch(actions.updateTableName({ id, name: val }));
    },
    [id, name]
  );
  const handleSavingPopoverStatus = useCallback((value: boolean) => {
    dispatch(actions.savePropertyEditorPopoverStatus(value));
  }, []);

  return (
    <div
      className={clsx("quicksql-table-property-editor", className)}
      onClick={onClick}
    >
      <header className={editorHeaderClassName}>Table Properties</header>
      <div className="p-2">
        <div className={editorRowTitleClassName}>Table</div>
        <input
          className={editorRowInputClassName}
          type="text"
          value={name}
          placeholder="table name..."
          onChange={handleTableNameChange}
        />
      </div>
      <div className="p-2">
        <div className={editorRowTitleClassName}>Columns</div>
        {columns.map((column) => {
          return (
            <Popover
              onOpened={(e) => handleSavingPopoverStatus(true)}
              onClosed={(e) => handleSavingPopoverStatus(false)}
              key={column.id}
              content={
                <ColumnPopover column={column} tableId={selectedTable.id} />
              }
              inheritDarkTheme={false}
              placement="left"
            >
              <div className="flex justify-between cursor-pointer mb-1">
                <span>{column.name}</span>
                <span>{column.type.toUpperCase()}</span>
              </div>
            </Popover>
          );
        })}
        <div
          onClick={handleAddNewColumn}
          className="cursor-pointer flex justify-center rounded border border-cool-gray-700 py-1"
        >
          <Icon icon="plus" className={clsx(Classes.TEXT_MUTED)} />
        </div>
      </div>
      <div className="p-2">
        <div className={editorRowTitleClassName}>Description</div>
        <textarea
          className={editorRowInputClassName}
          placeholder="comment..."
        />
      </div>
    </div>
  );
};

export const PropertyEditor: React.FC = () => {
  const selectedTable = useAppSelector((state) => state.diagram.selectedTable);
  const className = clsx(
    "quicksql-property-editor absolute right-0 w-360px bg-dark-200 text-light-900 h-full border-r-1 border-cool-gray-700",
    Classes.DARK
  );
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // e.preventDefault();
    e.stopPropagation();
  }, []);

  return selectedTable ? (
    <TableProperyEditor className={className} onClick={handleClick} />
  ) : (
    <DiagramProperyEditor className={className} onClick={handleClick} />
  );
};
