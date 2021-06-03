import React, { useCallback } from "react";
import clsx from "clsx";
import {
  Classes,
  Popover,
  HTMLSelect,
  Checkbox,
  Label,
} from "@blueprintjs/core";
import { useAppSelector } from "../store";

const editorHeaderClassName = "p-2 border-b-1 border-cool-gray-700";
const editorRowTitleClassName = clsx("mb-2 ", Classes.TEXT_MUTED);
const editorRowInputClassName = clsx("w-full", Classes.INPUT);

const DiagramProperyEditor: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  onClick,
}) => {
  return (
    <div
      className={clsx("diagram-property-editor", className)}
      onClick={onClick}
    >
      <header className={editorHeaderClassName}>Diagram Properties</header>
      <div className="p-2">
        <div className={editorRowTitleClassName}>Diagram</div>
        <input
          className={editorRowInputClassName}
          type="text"
          placeholder="diagram name..."
        />
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

const ColumnPopover: React.FC<{
  name?: string;
}> = ({ name }) => {
  return (
    <div className="p-4 rounded">
      <Label>
        Name
        <div>{name}</div>
      </Label>

      <Label>
        Data Type
        <HTMLSelect className="w-full">
          <option>INT</option>
        </HTMLSelect>
      </Label>

      <Checkbox label="Primary Key" />
      <Checkbox label="Not Null" />
      <Checkbox label="Unique" />
      <Checkbox label="Auto Increment" />

      <Label>
        Comment
        <textarea
          className={editorRowInputClassName}
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
  const selectedTable = useAppSelector((state) => {
    const id = state.diagram.selectedTable!;
    return state.diagram.tables[id];
  });

  const { columns, name } = selectedTable;

  return (
    <div className={clsx("table-property-editor", className)} onClick={onClick}>
      <header className={editorHeaderClassName}>Table Properties</header>
      <div className="p-2">
        <div className={editorRowTitleClassName}>Table</div>
        <input
          className={editorRowInputClassName}
          type="text"
          value={name}
          placeholder="table name..."
        />
      </div>
      <div className="p-2">
        <div className={editorRowTitleClassName}>Columns</div>
        {columns.map((column) => {
          return (
            <Popover
              key={column.id}
              content={<ColumnPopover name={column.name} />}
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
    "property-editor absolute right-0 w-360px bg-dark-200 text-light-900 h-full border-r-1 border-cool-gray-700",
    Classes.DARK
  );
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return selectedTable ? (
    <TableProperyEditor className={className} onClick={handleClick} />
  ) : (
    <DiagramProperyEditor className={className} onClick={handleClick} />
  );
};
