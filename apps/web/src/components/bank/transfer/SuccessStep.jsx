import { Button } from "../../ui/Button";
import { formatNairaAmount } from "@/lib/formatting/formatNairaAmount";

export function SuccessStep({ transfer, recipientLabel, onDone, onSendAnother }) {
  return (
    <div>
      <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Transfer successful</p>
      <p className="mt-2 text-[48px] font-semibold tabular-nums">{formatNairaAmount(transfer.amount)}</p>
      <p className="mt-1 text-[18px]">Sent to {recipientLabel}</p>

      <div className="mt-6 font-mono text-[13px] leading-[1.9] text-neutral-700">
        <p>Reference {transfer.reference}</p>
        <p>{new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>
        <p>Value date immediate</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={onDone}>Done</Button>
        <Button variant="ghost" onClick={onSendAnother}>
          Send another
        </Button>
      </div>
    </div>
  );
}
