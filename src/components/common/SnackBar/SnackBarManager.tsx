import ReactDOM from "react-dom/client";

import { SnackBar } from "./SnackBar";
import { SnackBarProps, SnackBarOptions } from "./type";

import styles from "./snackbar.module.css";

class SnackBarManager {
  private containerRoot: ReactDOM.Root;
  private snackbars: SnackBarProps[] = [];

  constructor() {
    const body = document.querySelector("body")!;
    const snackBarContainer = document.createElement("div");

    snackBarContainer.classList.add(styles.snackbar__container);
    body.insertAdjacentElement("beforeend", snackBarContainer);

    this.containerRoot = ReactDOM.createRoot(snackBarContainer);
  }

  public destroy(id: string | number): void {
    this.snackbars = this.snackbars.filter(
      (snackbar: SnackBarProps) => snackbar.id !== id
    );
    this.render();
  }

  private render(): void {
    const snackbarList = this.snackbars.map((toastProps: SnackBarProps) => (
      <SnackBar key={toastProps.id} {...toastProps} />
    ));
    this.containerRoot.render(snackbarList);
  }

  public show(options: SnackBarOptions): void {
    const id = options.id || new Date().getTime();
    const snackbar: SnackBarProps = {
      ...options,
      id,
      destroy: () => this.destroy(id),
    };

    this.snackbars = [snackbar, ...this.snackbars];
    this.render();
  }
}

export const snackbar = new SnackBarManager();
