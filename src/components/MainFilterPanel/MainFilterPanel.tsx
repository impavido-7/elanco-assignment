import { memo, useCallback, useEffect, useRef, useState } from "react";
import Select, { SingleValue } from "react-select";

import { snackbar } from "../common/SnackBar";
import { axiosInstance } from "../../AxiosInstance";
import { API_END_POINTS } from "../../modules/constants";
import { OPTIONS } from "./constants";

import { MainFilterPanelProps, values } from "./types";
import { OptionProps } from "../PageContainer/constants";

import styles from "./mainfilterpanel.module.css";

export const MainFilterPanel = memo(
  ({ selectedOption, onChange, onResourceSelect }: MainFilterPanelProps) => {
    // This state will contain the list of applications we will get through the API
    const [applications, setApplications] = useState<OptionProps[]>([]);

    // This state will contain the list of resources we will get through the API
    const [resources, setResources] = useState<OptionProps[]>([]);
    const selectedCategoryRef = useRef<string | undefined>(undefined);

    // To make an API call to get the applications
    const getApplications = useCallback(async () => {
      try {
        const res = await axiosInstance.get(API_END_POINTS.applications);
        setApplications(
          res.data.map((op: string) => ({ value: op, label: op }))
        );
      } catch (err) {
        setApplications([]);
      }
    }, []);

    // To make an API call to get the list of resources
    const getResources = useCallback(async () => {
      try {
        const res = await axiosInstance.get(API_END_POINTS.resources);
        setResources(res.data.map((op: string) => ({ value: op, label: op })));
      } catch (err) {
        setResources([]);
      }
    }, []);

    // This function will get executed when we select any option
    const onSelect = useCallback(
      (selectedValue: SingleValue<OptionProps>, selectedCategory: values) => {
        if (!selectedValue) {
          onChange({} as OptionProps);
        } else {
          if (
            selectedCategoryRef.current &&
            selectedCategoryRef.current !== selectedCategory
          ) {
            snackbar.show({
              title: `${selectedCategoryRef.current} filter which was applied earlier will be removed as the combination filters aren't supported`,
              content: "",
            });
          }
          onChange({ ...selectedValue });
          selectedCategoryRef.current = selectedCategory;
        }
        onResourceSelect(
          selectedValue ? selectedValue.value : "",
          selectedCategory
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    useEffect(() => {
      getApplications();
      getResources();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!selectedOption.value) {
        selectedCategoryRef.current = undefined;
      }
    }, [selectedOption.value]);

    return (
      <>
        <div className={styles.child__container}>
          {/* <h4> Resource Group </h4> */}
          <Select
            placeholder="Select Resource Group"
            value={
              selectedCategoryRef.current === OPTIONS.application &&
              selectedOption.value
                ? selectedOption
                : null
            }
            isSearchable
            isClearable
            options={applications}
            onChange={(e) => onSelect(e, OPTIONS.application)}
          />
        </div>
        <div className={styles.child__container}>
          {/* <h4> Meter Category </h4> */}
          <Select
            placeholder="Select Meter Category"
            value={
              selectedCategoryRef.current === OPTIONS.resource &&
              selectedOption.value
                ? selectedOption
                : null
            }
            isSearchable
            isClearable
            options={resources}
            onChange={(e) => onSelect(e, OPTIONS.resource)}
          />
        </div>
      </>
    );
  }
);
