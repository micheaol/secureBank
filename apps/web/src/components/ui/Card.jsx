import { cx } from "./cx";

export function Card({ className, ...divProps }) {
  return <div className={cx("rounded-lg bg-surface p-6", className)} {...divProps} />;
}
