import { Range, RangeKeyDict } from "react-date-range";

export type DateRangePickerProps = {
  range: Range[];
  dateSelectionKey: string;
  onDateRangeChange: (dateRange: RangeKeyDict) => void;
  onDateRangeSet: (dateRange: Range[]) => void;
};
