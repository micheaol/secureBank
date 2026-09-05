import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { FormField } from "../../ui/FormField";

export function AmountStep({
  recipientLabel,
  accounts,
  sourceAccountId,
  onChangeSourceAccountId,
  amount,
  onChangeAmount,
  description,
  onChangeDescription,
  onContinue,
  onBack,
}) {
  const canContinue = Number(amount) > 0 && Boolean(sourceAccountId);

  return (
    <div>
      <p className="text-[15px] text-neutral-700">Sending to</p>
      <p className="text-[19px]">{recipientLabel}</p>

      <div className="mt-6 flex flex-col gap-4">
        <FormField label="From">
          <select
            value={sourceAccountId}
            onChange={(event) => onChangeSourceAccountId(event.target.value)}
            className="w-full rounded-md border border-text/25 bg-bg px-3 py-2 text-[15px]"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountType === "CURRENT" ? "Current" : "Savings"} · {account.accountNumber}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Amount">
          <Input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(event) => onChangeAmount(event.target.value)}
            className="text-[24px] tabular-nums"
          />
        </FormField>

        <FormField label="Description">
          <Input
            value={description}
            onChange={(event) => onChangeDescription(event.target.value)}
            placeholder="What's this for?"
          />
        </FormField>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={onContinue} disabled={!canContinue}>
          Continue
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
