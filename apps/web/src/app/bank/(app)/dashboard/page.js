"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/lib/redux/authApi";
import { useGetMyAccountsQuery } from "@/lib/redux/accountsApi";
import { useGetMyTransactionsQuery } from "@/lib/redux/transactionsApi";
import { AccountCard } from "@/components/bank/AccountCard";
import { TransactionsTable } from "@/components/bank/TransactionsTable";
import { TransactionDetailDrawer } from "@/components/bank/TransactionDetailDrawer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatNairaAmount } from "@/lib/formatting/formatNairaAmount";

function sumAccountBalances(accounts) {
  return accounts.reduce((runningTotal, account) => runningTotal + Number(account.balance), 0);
}

export default function BankDashboardPage() {
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: accounts, isLoading: areAccountsLoading } = useGetMyAccountsQuery();
  const { data: transactionsData } = useGetMyTransactionsQuery({ page: 1, pageSize: 6 });
  const [logout] = useLogoutMutation();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  async function handleSignOut() {
    await logout();
    router.push("/bank/login");
  }

  const firstName = currentUser?.user?.fullName?.split(" ")[0] ?? "";

  return (
    <div className="py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[34px]">Good morning, {firstName}</h1>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>

      {accounts && accounts.length > 0 ? (
        <div className="mt-8">
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Total balance</p>
          <p className="text-[56px] font-semibold tabular-nums">
            {formatNairaAmount(sumAccountBalances(accounts))}
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {areAccountsLoading ? (
          <p className="text-[15px] text-neutral-700">Loading your accounts...</p>
        ) : (
          accounts?.map((account) => <AccountCard key={account.id} account={account} />)
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/bank/transfers">
          <Button>Send money</Button>
        </Link>
        <Link href="/bank/beneficiaries">
          <Button variant="secondary">Add beneficiary</Button>
        </Link>
        <Link href="/bank/transactions">
          <Button variant="ghost">Transaction history</Button>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-600">Recent transactions</p>
          <div className="mt-3">
            {transactionsData?.transactions?.length ? (
              <TransactionsTable
                transactions={transactionsData.transactions}
                onSelectTransaction={setSelectedTransaction}
              />
            ) : (
              <p className="text-[15px] text-neutral-700">No transactions yet.</p>
            )}
          </div>
        </div>

        <Card>
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">
            Your account security
          </p>
          <h3 className="mt-1 text-[19px]">Two checks in place</h3>
          <ul className="mt-4 flex flex-col gap-2 text-[14px]">
            <li>✓ Two-factor authentication on</li>
            <li>✓ Device recognised</li>
            <li className="text-accent-2-700">! Password last changed 14 months ago</li>
          </ul>
          <p className="mt-4 text-[13px] text-neutral-700">
            Last login {currentUser?.user?.lastLoginAt ? new Date(currentUser.user.lastLoginAt).toLocaleString() : "-"}
          </p>
          <Button variant="secondary" className="mt-4 w-full">
            Review security
          </Button>
        </Card>
      </div>

      <TransactionDetailDrawer transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </div>
  );
}
