export type TextInputProps = {
  placeholder: string;
  value?: string;
  onChange?: (e: string) => void;
  onPressEnter: (e?: string) => void;
};
