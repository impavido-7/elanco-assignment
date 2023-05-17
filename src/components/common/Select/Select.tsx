import { SelectProps } from "./types";

import styles from "./select.module.css";

export const Select = ({ value, options, onChange }: SelectProps) => {
  return (
    <select
      className={styles.select__container}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option, index) => {
        return (
          <option
            key={index}
            value={typeof option === "object" ? option.value : option}
          >
            {typeof option === "object" ? option.label : option}
          </option>
        );
      })}
    </select>
  );
};
