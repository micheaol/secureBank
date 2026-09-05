import { Button } from "../../ui/Button";
import { ApiErrorBanner } from "../../ui/ApiErrorBanner";

export function AuthorizeStep({ otp, onChangeOtp, onConfirm, onBack, isConfirming, error }) {
  return (
    <div>
      <h2 className="text-[24px]">Authorize transfer</h2>
      <p className="mt-2 max-w-[52ch] text-[15px] text-neutral-700">
        We sent a code to the number ending in 8241. It expires in 4 minutes. Check the API server log for the
        code in this training environment.
      </p>

      <input
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(event) => onChangeOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
        className="mt-6 w-[220px] rounded-md border border-text/25 bg-bg px-3 py-2 font-mono text-[28px] tracking-[0.3em]"
        placeholder="000000"
      />

      <div className="mt-6">
        <ApiErrorBanner error={error} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={onConfirm} disabled={otp.length !== 6 || isConfirming}>
          {isConfirming ? "Processing..." : "Confirm transfer"}
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
      {isConfirming ? <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Contacting NIBSS</p> : null}
    </div>
  );
}
