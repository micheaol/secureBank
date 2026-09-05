"use client";

import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/lib/redux/authApi";
import { useGetMyAccountsQuery } from "@/lib/redux/accountsApi";
import { useLogoutMutation } from "@/lib/redux/authApi";
import { AccountCard } from "@/components/bank/AccountCard";
import { Button } from "@/components/ui/Button";
import { formatNairaAmount } from "@/lib/formatting/formatNairaAmount";

function sumAccountBalances(accounts) {
  return accounts.reduce((runningTotal, account) => runningTotal + Number(account.balance), 0);
}

export default function BankDashboardPage() {
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: accounts, isLoading: areAccountsLoading } = useGetMyAccountsQuery();
  const [logout] = useLogoutMutation();

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
    </div>
  );
}
