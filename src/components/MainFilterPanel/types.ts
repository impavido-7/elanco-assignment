import { OptionProps } from "../PageContainer/constants";
import { OPTIONS } from "./constants";

type keys = keyof typeof OPTIONS;
export type values = (typeof OPTIONS)[keys];

export type MainFilterPanelProps = {
  selectedOption: OptionProps;
  onChange: React.Dispatch<React.SetStateAction<OptionProps>>;
  onResourceSelect: (a: string, b: values) => void;
};
