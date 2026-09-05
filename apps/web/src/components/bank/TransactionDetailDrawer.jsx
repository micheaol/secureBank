"use client";

import { useEffect } from "react";
import { Button } from "../ui/Button";
import { formatNairaAmount } from "@/lib/formatting/formatNairaAmount";
import { formatShortDate } from "@/lib/formatting/formatShortDate";

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-[6px] text-[15px]">
      <span className="text-neutral-700">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function TransactionDetailDrawer({ transaction, onClose }) {
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-text/22" onClick={onClose} />
      <div className="sb-in absolute right-0 top-0 h-full w-full max-w-[440px] overflow-y-auto bg-bg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Transaction</p>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[20px] leading-none">
            ×
          </button>
        </div>

        <p className="mt-4 text-[36px] font-semibold tabular-nums">{formatNairaAmount(transaction.amount)}</p>
        <p className="text-[18px]">{transaction.description}</p>

        <div className="mt-6 divide-y divide-divider border-y border-divider">
          <DetailRow label="Reference" value={<span className="font-mono">{transaction.reference}</span>} />
          <DetailRow label="Date" value={formatShortDate(transaction.occurredAt)} />
          <DetailRow label="Type" value={transaction.type} />
          <DetailRow label="Status" value={transaction.status} />
          <DetailRow label="Channel" value={transaction.channel} />
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary">Download receipt</Button>
          <Button variant="ghost">Report a problem</Button>
        </div>
      </div>
    </div>
  );
}
