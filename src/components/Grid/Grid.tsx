import { AgGridReact } from "ag-grid-react";

import { columnDefs, defaultColDefs } from "./columnDefs";
import { responseType } from "./types";
import { GridReadyEvent } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

type TablePropTypes = {
  rowData: responseType[];
  onGridReady: (e: GridReadyEvent<responseType, any>) => void;
};

export const Grid = ({ rowData, onGridReady }: TablePropTypes) => {
  return (
    <div className="ag-theme-balham" style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        onGridReady={onGridReady}
        defaultColDef={defaultColDefs}
        columnDefs={columnDefs}
        rowData={rowData}
        pagination
        paginationPageSize={100}
      />
    </div>
  );
};
