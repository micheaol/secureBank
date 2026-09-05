import { cx } from "./cx";

const VARIANT_CLASS_NAMES = {
  primary: "bg-accent text-bg hover:bg-accent-700",
  secondary: "border border-text/60 text-text hover:bg-neutral-200",
  ghost: "text-accent-700 hover:bg-neutral-200",
};

const SIZE_CLASS_NAMES = {
  md: "px-4 py-2 text-[15px]",
  lg: "px-[28px] py-[14px] text-[16px]",
};

export function Button({
  variant = "primary",
  size = "md",
  destructive = false,
  className,
  type = "button",
  ...buttonProps
}) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        destructive ? "text-accent-2-700 hover:bg-accent-2-100" : VARIANT_CLASS_NAMES[variant],
        SIZE_CLASS_NAMES[size],
        className
      )}
      {...buttonProps}
    />
  );
}
