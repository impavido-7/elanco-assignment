import { useCallback, useEffect, useRef, useState } from "react";
import Select, { SingleValue } from "react-select";

import Loader from "../common/Loader";
import Grid from "../Grid";
import SideFiltersPanel from "../SidePanel";
import DateRangePicker from "../DateRangePicker";
import TextInput from "../common/TextInput";

import { OPTIONS_FOR_DROPDOWN, OptionProps } from "./constants";
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
  const [sortBy, setSortBy] = useState<OptionProps>({} as OptionProps);

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

  const applySelectedSortBy = useCallback((valueSelected: string) => {
    switch (valueSelected) {
      case "highestCostFirst":
        sort("Cost", "desc");
        break;
      case "lowestCostFirst":
        sort("Cost", "asc");
        break;
      case "mostRecent":
        sort("Date", "desc");
        break;
      case "lessRecent":
        sort("Date", "asc");
        break;
      default:
        console.log("No case selected");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectSortBy = useCallback(
    (selectedValue: SingleValue<OptionProps>) => {
      if (!selectedValue) {
        clearSort();
        setSortBy({} as OptionProps);
      } else {
        applySelectedSortBy(selectedValue.value);
        setSortBy({ ...selectedValue });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.parent__container}>
      <div className={`${styles.container} ${styles.alignItems}`}>
        <div className={styles.search__container}>
          <div className={styles.input__sub__container}>
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
          </div>
        </div>
        <DateRangePicker onDateRangeUpdate={onDateRangeUpdate} />
        <SideFiltersPanel onResourceSelect={onResourceSelect} />
        <Select
          placeholder="Sort by"
          value={sortBy.value ? sortBy : null}
          isClearable
          options={OPTIONS_FOR_DROPDOWN}
          onChange={onSelectSortBy}
          className={styles.select}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.child__container}>
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
