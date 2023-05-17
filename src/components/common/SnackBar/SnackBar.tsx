import { useEffect } from "react";
import { SnackBarProps } from "./type";

import styles from "./snackbar.module.css";

export const SnackBar = (props: SnackBarProps) => {
  const { title, duration = 5000, content, destroy } = props;

  // Here we are setting the timer to destroy the snackbar after the duration specified
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      destroy();
    }, duration);

    return () => clearTimeout(timer);
  }, [destroy, duration]);

  return (
    <div>
      <div className={styles.snackbar__header}>
        <div className={styles.snackbar__title}>{title}</div>
        <button className={styles.snackbar__button} onClick={destroy}>
          X
        </button>
      </div>
      <div className={styles.snackbar__content}>{content}</div>
    </div>
  );
};
