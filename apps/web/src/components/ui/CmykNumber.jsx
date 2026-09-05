import { cx } from "./cx";

export function CmykNumber({ value, className }) {
  return (
    <span className={cx("cmyk-num", className)}>
      <span className="paper">{value}</span>
      <span className="plate plate-c" aria-hidden="true">
        {value}
      </span>
      <span className="plate plate-m" aria-hidden="true">
        {value}
      </span>
      <span className="plate plate-y" aria-hidden="true">
        {value}
      </span>
    </span>
  );
}
