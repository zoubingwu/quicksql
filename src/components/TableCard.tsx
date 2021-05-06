import React from "react";
import { Table } from "../core/Table";

export const TableCard: React.FC<{
  data: Table;
}> = ({ data }) => {
  return (
    <div>
      <div>{data.name}</div>
    </div>
  );
};
