import { forwardRef } from "react";
import { cx } from "./cx";

export const Input = forwardRef(function Input({ className, hasError = false, ...inputProps }, ref) {
  return (
    <input
      ref={ref}
      className={cx(
        "w-full rounded-md border bg-bg px-3 py-2 text-[15px] text-text placeholder:text-neutral-500",
        "focus:outline-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        hasError ? "border-accent-2-500" : "border-text/25",
        className
      )}
      {...inputProps}
    />
  );
});
