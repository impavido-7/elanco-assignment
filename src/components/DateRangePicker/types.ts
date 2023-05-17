import { Range } from "react-date-range";

export type DateRangePickerProps = {
  onDateRangeUpdate: (dateRange: Range[]) => void;
};
