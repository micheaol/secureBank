import { Button } from "../../ui/Button";
import { ApiErrorBanner } from "../../ui/ApiErrorBanner";
import { formatNairaAmount } from "@/lib/formatting/formatNairaAmount";

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-[11px] text-[16px]">
      <span className="text-neutral-700">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function ReviewStep({ recipientLabel, recipientDetail, fee, amount, description, sourceAccountLabel, onAuthorize, onBack, isSubmitting, error }) {
  return (
    <div>
      <div className="divide-y divide-divider border-y border-divider">
        <ReviewRow label="Recipient" value={recipientLabel} />
        <ReviewRow label="Account" value={recipientDetail} />
        <ReviewRow label="Amount" value={formatNairaAmount(amount)} />
        <ReviewRow label="Fee" value={formatNairaAmount(fee)} />
        {description ? <ReviewRow label="Description" value={description} /> : null}
        <ReviewRow label="From" value={sourceAccountLabel} />
      </div>

      <div className="mt-6">
        <ApiErrorBanner error={error} />
      </div>

      <div className="mt-4 flex gap-3">
        <Button onClick={onAuthorize} disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Authorize transfer"}
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Edit
        </Button>
      </div>
    </div>
  );
}
