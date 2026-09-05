import { cx } from "../ui/cx";

const STEP_LABELS = ["Recipient", "Amount", "Review", "Authorize", "Success"];

export function TransferStepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-3">
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const state = stepNumber === currentStep ? "current" : stepNumber < currentStep ? "done" : "upcoming";

        return (
          <div key={label} className="flex items-center gap-3">
            <span
              className={cx(
                "font-mono text-[11px] uppercase tracking-[0.12em]",
                state === "current" && "text-accent-700",
                state === "done" && "text-text",
                state === "upcoming" && "text-neutral-500"
              )}
            >
              {label}
            </span>
            {stepNumber < STEP_LABELS.length && <span className="h-px w-[14px] bg-divider" />}
          </div>
        );
      })}
    </div>
  );
}
