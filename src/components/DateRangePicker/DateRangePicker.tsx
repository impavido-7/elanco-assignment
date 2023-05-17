import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Range,
  RangeKeyDict,
  DateRangePicker as ReactDateRangePicker,
} from "react-date-range";

import format from "date-fns/format";

import { DateRangePickerProps } from "./types";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./daterangepicker.module.css";

export const DateRangePicker = memo(
  ({
    range,
    onDateRangeChange,
    onDateRangeSet,
    dateSelectionKey,
  }: DateRangePickerProps) => {
    const [open, setOpen] = useState(false);

    const dateRangeRef = useRef<HTMLDivElement>(null!);
    const isOpened = useRef(false);
    const isBothStartAndEndDateSelected = useRef(true);

    // To close the date-picker when we presses Esc
    const hideOnEscape = useCallback((e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }, []);

    // To close the date-picker when we clicked outside of the date-picker
    const hideOnClickOutside = useCallback((e: MouseEvent) => {
      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }, []);

    const onClear = useCallback(() => {
      onDateRangeChange({
        [dateSelectionKey]: { key: dateSelectionKey } as Range,
      } as RangeKeyDict);
      onDateRangeSet([]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onDateRangeSet]);

    useEffect(() => {
      document.addEventListener("keydown", hideOnEscape, true);
      document.addEventListener("click", hideOnClickOutside, true);

      return () => {
        document.removeEventListener("keydown", hideOnEscape, true);
        document.removeEventListener("click", hideOnClickOutside, true);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkIfValueIsAvailable = () => {
      return range.length === 1 && range[0].startDate && range[0].endDate;
    };

    const onSelect = useCallback((e: RangeKeyDict) => {
      onDateRangeChange(e);
      if (isBothStartAndEndDateSelected.current) {
        isBothStartAndEndDateSelected.current = false;
      } else {
        isBothStartAndEndDateSelected.current = true;
        setOpen(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!open) {
        if (isOpened.current && checkIfValueIsAvailable()) {
          onDateRangeSet(range);
          isBothStartAndEndDateSelected.current = true;
        }
        isOpened.current = false;
        document.removeEventListener("keydown", hideOnEscape, true);
        document.removeEventListener("click", hideOnClickOutside, true);
      } else {
        isOpened.current = true;
        document.addEventListener("keydown", hideOnEscape, true);
        document.addEventListener("click", hideOnClickOutside, true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, onDateRangeSet]);

    return (
      <div className={styles.calendar__wrap}>
        <div className={styles.input__container}>
          <input
            readOnly
            placeholder="Select Date Range"
            value={
              checkIfValueIsAvailable()
                ? `${format(range[0].startDate!, "dd MMM, yyyy")} - ${format(
                    range[0].endDate!,
                    "dd MMM, yyyy"
                  )}`
                : ""
            }
            className={styles.input}
            onClick={() => setOpen((prev) => !prev)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`w-6 h-6 ${styles.svg__icon}`}
            onClick={onClear}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div ref={dateRangeRef}>
          {open ? (
            <ReactDateRangePicker
              onChange={onSelect}
              editableDateInputs={false}
              moveRangeOnFirstSelection={false}
              ranges={range}
              months={2}
              direction="horizontal"
              className={styles.calendar__element}
              staticRanges={[]}
              inputRanges={[]}
            />
          ) : null}
        </div>
      </div>
    );
  }
);
