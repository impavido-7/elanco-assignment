import { useCallback, useEffect, useRef, useState } from "react";
import { DateRangePicker as ReactDateRangePicker } from "react-date-range";

import format from "date-fns/format";

import { Range } from "react-date-range";
import { DateRangePickerProps } from "./types";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./daterangepicker.module.css";

export const DateRangePicker = ({
  onDateRangeUpdate,
}: DateRangePickerProps) => {
  const [range, setRange] = useState<Range[]>([{ key: "selection" }]);
  const [open, setOpen] = useState(false);

  const dateRangeRef = useRef<HTMLDivElement>(null!);
  const isOpened = useRef(false);

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
    setRange([{ key: "selection" }]);
    onDateRangeUpdate([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);

    return () => {
      document.removeEventListener("keydown", hideOnEscape, true);
      document.removeEventListener("click", hideOnClickOutside, true);
    };
  });

  const checkIfValueIsAvailable = () => {
    return range.length === 1 && range[0].startDate && range[0].endDate;
  };

  useEffect(() => {
    if (!open) {
      if (isOpened.current && checkIfValueIsAvailable()) {
        onDateRangeUpdate(range);
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
  }, [open]);

  return (
    <div className={styles.calendar__wrap}>
      <div className={styles.input__container}>
        <input
          readOnly
          placeholder="Date Range"
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
            onChange={(e) => {
              setRange([e["selection"]]);
            }}
            editableDateInputs
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
            className={styles.calendar__element}
          />
        ) : null}
      </div>
    </div>
  );
};
