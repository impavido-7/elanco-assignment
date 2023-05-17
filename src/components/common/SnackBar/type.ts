export type SnackBarProps = {
  id: string | number;
  destroy: () => void;
  title: string;
  content: string;
  duration?: number;
};

export type SnackBarOptions = {
  id?: string | number;
  title: string;
  content: string;
  duration?: number;
};
