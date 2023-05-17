import moment from "moment";

import { ColDef, ColGroupDef } from "ag-grid-community";
import { responseType } from "./types";
import { USERS_DATE_FORMAT } from "../../modules/constants";

export const defaultColDefs: ColDef<responseType> = {
  sortable: true,
  resizable: true,
  filter: true,
  filterParams: {
    filterOptions: ["contains"],
    suppressAndOrCondition: true,
  },
};

export const columnDefs: (ColDef<responseType> | ColGroupDef<responseType>)[] =
  [
    {
      field: "ConsumedQuantity",
      headerName: "Consumed Quantity",
      width: 165,
    },
    {
      field: "Cost",
      headerName: "Cost",
      width: 165,
    },
    {
      field: "Date",
      headerName: "Date",
      width: 100,
      valueGetter: (params) => {
        if (params.data && params.data.Date) {
          const reformattedDate = params.data.Date.split("/")
            .reverse()
            .join("/");
          return moment(reformattedDate).format(USERS_DATE_FORMAT);
        }
        return null;
      },
    },
    {
      field: "MeterCategory",
      headerName: "Meter Category",
      width: 165,
    },
    {
      field: "ResourceGroup",
      headerName: "Resource Group",
      width: 200,
    },
    {
      field: "ResourceLocation",
      headerName: "Resource Location",
      width: 150,
    },
    {
      field: "UnitOfMeasure",
      headerName: "Unit Of Measure",
      width: 140,
    },
    {
      field: "Location",
      headerName: "Location",
      width: 100,
    },
    {
      field: "ServiceName",
      headerName: "Service Name",
      width: 150,
    },
    {
      field: "InstanceId",
      headerName: "Instance Id",
      width: 200,
    },
    {
      headerName: "Tags",
      children: [
        {
          field: "app-name",
          headerName: "App Name",
          width: 200,
          valueGetter: (params) => {
            return params.data?.Tags["app-name"];
          },
        },
        {
          field: "environment",
          headerName: "Environment",
          width: 135,
          valueGetter: (params) => {
            return params.data?.Tags["environment"];
          },
        },
        {
          field: "business-unit",
          headerName: "Business Unit",
          width: 135,
          valueGetter: (params) => {
            return params.data?.Tags["business-unit"];
          },
        },
      ],
    },
  ];
