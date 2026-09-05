import { cx } from "../ui/cx";
import { formatNairaAmount } from "@/lib/formatting/formatNairaAmount";
import { formatShortDate } from "@/lib/formatting/formatShortDate";

export function TransactionsTable({ transactions, onSelectTransaction, showTypeColumn = false }) {
  return (
    <table className="w-full text-[14px]">
      <thead>
        <tr className="border-b border-divider text-left font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-600">
          <th className="py-2 font-normal">Detail</th>
          <th className="py-2 font-normal">Reference</th>
          {showTypeColumn ? <th className="py-2 font-normal">Type</th> : null}
          <th className="py-2 font-normal">Date</th>
          <th className="py-2 text-right font-normal">Amount</th>
          <th className="py-2 text-right font-normal">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-divider">
        {transactions.map((transaction) => (
          <tr
            key={transaction.id}
            onClick={() => onSelectTransaction(transaction)}
            className="cursor-pointer hover:bg-neutral-200"
          >
            <td className="py-3">{transaction.description}</td>
            <td className="py-3 font-mono text-[12px] text-neutral-700">{transaction.reference}</td>
            {showTypeColumn ? <td className="py-3">{transaction.category ?? "-"}</td> : null}
            <td className="py-3 text-neutral-700">{formatShortDate(transaction.occurredAt)}</td>
            <td
              className={cx(
                "py-3 text-right tabular-nums",
                transaction.type === "CREDIT" && "text-accent-700"
              )}
            >
              {transaction.type === "CREDIT" ? "+" : "-"}
              {formatNairaAmount(transaction.amount)}
            </td>
            <td
              className={cx(
                "py-3 text-right font-mono text-[12px] uppercase tracking-[0.08em]",
                transaction.status !== "SUCCESSFUL" && "text-accent-2-700"
              )}
            >
              {transaction.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
