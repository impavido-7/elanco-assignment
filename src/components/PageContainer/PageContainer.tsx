import { useCallback, useEffect, useRef, useState } from "react";

import Loader from "../common/Loader";
import Grid from "../Grid";
import Select from "../common/Select";
import SideFiltersPanel from "../SidePanel";
import DateRangePicker from "../DateRangePicker";
import TextInput from "../common/TextInput";

import { OPTIONS_FOR_DROPDOWN } from "./constants";
import { OPTIONS, values } from "../SidePanel/SidePanel";
import { axiosInstance } from "../../AxiosInstance";
import { API_END_POINTS } from "../../modules/constants";
import { responseType } from "../Grid/types";
import { GridReadyEvent } from "ag-grid-community";
import { filterDataFromList, filterDateByDateRange } from "../../modules/utils";

import styles from "./pagecontainer.module.css";
import { Range } from "react-date-range";

export const PageContainer = () => {
  const [loading, setLoading] = useState(true);
  const [filteredRowData, setFilteredRowData] = useState<responseType[]>([]);
  const [sortBy, setSortBy] = useState("null");

  const rowData = useRef<responseType[]>([]);
  const completeData = useRef<responseType[]>([]);
  const gridRef = useRef<GridReadyEvent<responseType, any>>(null!);

  const getData = useCallback(async (endPoint: string = API_END_POINTS.raw) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(endPoint);
      if (endPoint === API_END_POINTS.raw) {
        completeData.current = res.data;
      }
      rowData.current = res.data;
      setFilteredRowData(res.data as responseType[]);
    } catch (err) {
      if (endPoint === API_END_POINTS.raw) {
        completeData.current = [];
      }
      rowData.current = [];
      setFilteredRowData([] as responseType[]);
    } finally {
      setLoading(false);
    }
  }, []);

  const sort = useCallback(
    (sortField: "Cost" | "Date", sortType: "asc" | "desc") => {
      gridRef.current.columnApi.applyColumnState({
        state: [{ colId: sortField, sort: sortType }],
        defaultState: { sort: null },
      });
    },
    []
  );

  const clearSort = useCallback(() => {
    gridRef.current?.columnApi.applyColumnState({
      defaultState: { sort: null },
    });
  }, []);

  const onDateRangeUpdate = useCallback((dateRange: Range[]) => {
    if (dateRange.length === 0) {
      setFilteredRowData([...rowData.current]);
      return;
    }
    const tempFilteredData = filterDateByDateRange(
      rowData.current,
      new Date(dateRange[0].startDate!),
      new Date(dateRange[0].endDate!)
    );
    setFilteredRowData([...tempFilteredData]);
  }, []);

  const onResourceSelect = useCallback(
    (selectedResource: string, selectedCategory: values) => {
      if (!selectedResource) {
        setFilteredRowData([...completeData.current]);
        return;
      }
      let endPoint: string;
      if (selectedCategory === OPTIONS.application) {
        endPoint = API_END_POINTS.applicationByName(selectedResource);
      } else {
        endPoint = API_END_POINTS.getResourceByName(selectedResource);
      }
      getData(endPoint);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sortBy === "null") {
      clearSort();
    } else if (sortBy === "highestCostFirst") {
      sort("Cost", "desc");
    } else if (sortBy === "lowestCostFirst") {
      sort("Cost", "asc");
    } else if (sortBy === "mostRecent") {
      sort("Date", "desc");
    } else if (sortBy === "lessRecent") {
      sort("Date", "asc");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return (
    <div className={styles.parent__container}>
      <div className={`${styles.container} ${styles.alignItems}`}>
        <div className={styles.flex__grow} />
        <TextInput
          placeholder="Search"
          onPressEnter={(searchText) => {
            if (!searchText!.trim()) {
              setFilteredRowData([...rowData.current]);
            } else {
              const fiteredList = filterDataFromList(
                searchText!.trim(),
                rowData.current
              );
              setFilteredRowData([...fiteredList]);
            }
          }}
        />
        <DateRangePicker onDateRangeUpdate={onDateRangeUpdate} />
        <h4> Sort By: </h4>
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={OPTIONS_FOR_DROPDOWN}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.sidepanel__container}>
          <SideFiltersPanel onResourceSelect={onResourceSelect} />
        </div>
        <div className={styles.flex__grow}>
          {loading ? (
            <div className={styles.loader__container}>
              <Loader />
            </div>
          ) : (
            <Grid
              onGridReady={(e) => (gridRef.current = e)}
              rowData={filteredRowData}
            />
          )}
        </div>
      </div>
    </div>
  );
};