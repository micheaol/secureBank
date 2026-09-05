"use client";

import { useState } from "react";
import { useGetMyTransactionsQuery } from "@/lib/redux/transactionsApi";
import { TransactionsTable } from "@/components/bank/TransactionsTable";
import { TransactionDetailDrawer } from "@/components/bank/TransactionDetailDrawer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 20;

function downloadTransactionsAsCsv(transactions) {
  const header = "Description,Reference,Date,Amount,Type,Status\n";
  const rows = transactions
    .map((tx) => [tx.description, tx.reference, tx.occurredAt, tx.amount, tx.type, tx.status].join(","))
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "securebank-transactions.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data, isLoading } = useGetMyTransactionsQuery({
    search: search || undefined,
    type: type || undefined,
    status: status || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const transactions = data?.transactions ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className="py-8">
      <h1 className="text-[34px]">Transactions</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          className="min-w-[240px] flex-1"
          placeholder="Search description or reference"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
        />
        <select
          value={type}
          onChange={(event) => {
            setPage(1);
            setType(event.target.value);
          }}
          className="rounded-md border border-text/25 bg-bg px-3 py-2 text-[14px]"
        >
          <option value="">All types</option>
          <option value="DEBIT">Debit</option>
          <option value="CREDIT">Credit</option>
        </select>
        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
          className="rounded-md border border-text/25 bg-bg px-3 py-2 text-[14px]"
        >
          <option value="">All statuses</option>
          <option value="SUCCESSFUL">Successful</option>
          <option value="PENDING">Pending</option>
          <option value="REVERSED">Reversed</option>
          <option value="FAILED">Failed</option>
        </select>
        <Button variant="secondary" onClick={() => downloadTransactionsAsCsv(transactions)}>
          Export
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-[15px] text-neutral-700">Loading transactions...</p>
        ) : (
          <TransactionsTable
            transactions={transactions}
            onSelectTransaction={setSelectedTransaction}
            showTypeColumn
          />
        )}
      </div>

      <p className="mt-4 text-[13px] text-neutral-700">
        Showing {transactions.length} of {totalCount} transactions. Select a row for full detail.
      </p>

      {totalCount > PAGE_SIZE ? (
        <div className="mt-2 flex gap-3">
          <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={page * PAGE_SIZE >= totalCount}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <TransactionDetailDrawer transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </div>
  );
}
