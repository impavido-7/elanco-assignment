export type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | string[];
};
