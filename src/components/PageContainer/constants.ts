export type OptionProps = {
  value: string;
  label: string;
};

export const OPTIONS_FOR_DROPDOWN = [
  {
    value: "mostRecent",
    label: "Recent Transactions First",
  },
  {
    value: "lessRecent",
    label: "Recent Transactions Last",
  },
  {
    value: "highestCostFirst",
    label: "Highest Cost First",
  },
  {
    value: "lowestCostFirst",
    label: "Lowest Cost First",
  },
] as OptionProps[];
