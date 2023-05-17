import { OutlinedInputProps } from "./types";
import styles from "./outlinedinput.module.css";

export const OutlinedInput = ({
  value,
  label,
  onChange,
  onPressEnter,
}: OutlinedInputProps) => {
  return (
    <div className={styles.input__group}>
      <input
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        type="text"
        autoComplete="on"
        className={styles.input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const target = e.target as HTMLInputElement;
            onPressEnter(target.value);
          }
        }}
      />
      <label className={styles.label}>{label}</label>
    </div>
  );
};
