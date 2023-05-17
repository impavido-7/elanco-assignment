import { memo, useRef } from "react";

import { TextInputProps } from "./types";

import styles from "./textinput.module.css";

export const TextInput = memo(
  ({ placeholder, value, onChange, onPressEnter }: TextInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null!);

    return (
      <form className={`${styles.form} ${styles.form__add__border}`}>
        <button>
          <svg
            width="17"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
            onClick={(e) => {
              e.preventDefault();
              onPressEnter(inputRef.current.value);
            }}
            className={styles.cursor__pointer}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onPressEnter(inputRef.current.value);
              }
            }}
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.333"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onPressEnter(inputRef.current.value);
            }
          }}
          className={styles.input}
          placeholder={placeholder}
          type="text"
        />
        <button className={styles.reset} type="reset">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // className={styles.h-6 w-6
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            onClick={() => {
              if (onChange) {
                onChange("");
              } else {
                inputRef.current.innerText = "";
              }
              onPressEnter("");
            }}
            tabIndex={0}
            className={styles.cursor__pointer}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </form>
    );
  }
);
