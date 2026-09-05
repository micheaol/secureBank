import { Card } from "../ui/Card";
import { formatNairaAmount } from "@/lib/formatting/formatNairaAmount";

const ACCOUNT_TYPE_LABELS = {
  CURRENT: "Current",
  SAVINGS: "Savings",
};

export function AccountCard({ account }) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-center justify-between font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">
        <span>{ACCOUNT_TYPE_LABELS[account.accountType] ?? account.accountType}</span>
        <span>{account.status}</span>
      </div>
      <p className="font-mono text-[13px] text-neutral-700">{account.accountNumber}</p>
      <p className="text-[28px] font-semibold tabular-nums">{formatNairaAmount(account.balance)}</p>
      <p className="text-[13px] text-neutral-700">
        Available {formatNairaAmount(account.availableBalance)}
      </p>
    </Card>
  );
}
