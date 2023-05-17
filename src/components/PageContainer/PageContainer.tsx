import { useCallback, useEffect, useRef, useState } from "react";
import Select, { SingleValue } from "react-select";

import Loader from "../common/Loader";
import Grid from "../Grid";
import SideFiltersPanel from "../MainFilterPanel";
import DateRangePicker from "../DateRangePicker";
import TextInput from "../common/TextInput";

import {
  DATE_RANGE_SELECTOR_KEY,
  OPTIONS_FOR_DROPDOWN,
  OptionProps,
} from "./constants";
import { OPTIONS } from "../MainFilterPanel/constants";
import { axiosInstance } from "../../AxiosInstance";
import { API_END_POINTS } from "../../modules/constants";
import { filterDataFromList, filterDataByDateRange } from "../../modules/utils";

import { values } from "../MainFilterPanel/types";
import { responseType } from "../Grid/types";
import { GridReadyEvent } from "ag-grid-community";
import { Range, RangeKeyDict } from "react-date-range";

import styles from "./pagecontainer.module.css";

export const PageContainer = () => {
  const [loading, setLoading] = useState(true);
  const [filteredRowData, setFilteredRowData] = useState<responseType[]>([]);
  const [sortBy, setSortBy] = useState<OptionProps>({} as OptionProps);
  const [range, setRange] = useState<Range[]>([
    { key: DATE_RANGE_SELECTOR_KEY },
  ]);
  const [searchText, setSearchText] = useState("");
  const [selectedMainFilter, setSelectedMainFilter] = useState<OptionProps>(
    {} as OptionProps
  );

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

  // To reset all the subFilters
  const resetSubFilters = useCallback(() => {
    setSearchText("");
    setRange([{ key: DATE_RANGE_SELECTOR_KEY }]);
    setSearchText("");
  }, []);

  // Apply sub-filters
  const applyFilters = useCallback(
    ({ text = searchText, dateRange = range }) => {
      let filteredData = [...rowData.current];
      if (text.trim().length) {
        filteredData = filterDataFromList(text.trim(), filteredData);
      }
      if (
        dateRange.length === 1 &&
        dateRange[0].startDate &&
        dateRange[0].endDate
      ) {
        filteredData = filterDataByDateRange(
          filteredData,
          new Date(dateRange[0].startDate!),
          new Date(dateRange[0].endDate!)
        );
      }
      setFilteredRowData([...filteredData]);
    },
    [range, searchText]
  );

  // This will clear the sortBy value
  const clearSort = useCallback(() => {
    gridRef.current?.columnApi.applyColumnState({
      defaultState: { sort: null },
    });
  }, []);

  // Triggered when we select date range
  const onDateRangeChange = useCallback((dateRange: RangeKeyDict) => {
    setRange([dateRange[DATE_RANGE_SELECTOR_KEY]]);
  }, []);

  // Trigerred when we set both the start & the end dates in the date picker
  const onDateRangeSet = useCallback(
    (dateRange: Range[]) => {
      applyFilters({ dateRange });
    },
    [applyFilters]
  );

  // Triggered when we apply the main filters -> Resource, Meter
  const onResourceSelect = useCallback(
    (selectedResource: string, selectedCategory: values) => {
      resetSubFilters();
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

  // This will clear all the applied filters
  const clearAllFilters = useCallback(() => {
    setSelectedMainFilter({} as OptionProps);
    resetSubFilters();
    // Setting the complete raw response as we cleared all the filters
    setFilteredRowData([...completeData.current]);

    // Setting this value, for filtering
    rowData.current = completeData.current;
  }, [resetSubFilters]);

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
      <fieldset className={styles.fieldset}>
        <legend> Main Filters </legend>
        <div className={`${styles.container} ${styles.alignItems}`}>
          <SideFiltersPanel
            selectedOption={selectedMainFilter}
            onChange={setSelectedMainFilter}
            onResourceSelect={onResourceSelect}
          />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend> Sub Filters </legend>
        <div className={`${styles.container} ${styles.alignItems}`}>
          <div className={styles.input__sub__container}>
            <TextInput
              value={searchText}
              onChange={setSearchText}
              placeholder="Search"
              onPressEnter={(text) => {
                applyFilters({ text });
              }}
            />
          </div>
          <DateRangePicker
            range={range}
            dateSelectionKey={DATE_RANGE_SELECTOR_KEY}
            onDateRangeChange={onDateRangeChange}
            onDateRangeSet={onDateRangeSet}
          />
          <Select
            placeholder="Sort by"
            value={sortBy.value ? sortBy : null}
            isClearable
            options={OPTIONS_FOR_DROPDOWN}
            onChange={onSelectSortBy}
            className={styles.select}
          />
        </div>
      </fieldset>

      <div>
        <button onClick={clearAllFilters} className={styles.button}>
          X Clear All Filters
        </button>
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
