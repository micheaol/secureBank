"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetCurrentUserQuery } from "@/lib/redux/authApi";
import { cx } from "../ui/cx";

const BANK_NAV_ITEMS = [
  { label: "Dashboard", href: "/bank/dashboard", builtInThisSprint: true },
  { label: "Transfers", href: null, builtInThisSprint: false },
  { label: "Transactions", href: null, builtInThisSprint: false },
  { label: "SecureBank AI", href: null, builtInThisSprint: false },
  { label: "Accounts", href: null, builtInThisSprint: false },
  { label: "Beneficiaries", href: null, builtInThisSprint: false },
  { label: "Support", href: null, builtInThisSprint: false },
];

function buildInitialsFromFullName(fullName) {
  if (!fullName) return "";
  const nameParts = fullName.trim().split(/\s+/);
  return nameParts
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("");
}

export function BankTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: currentUser, isError } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isError) {
      router.replace("/bank/login");
    }
  }, [isError, router]);

  return (
    <nav aria-label="Digital Bank" className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-6">
        {BANK_NAV_ITEMS.map((navItem) => {
          const isActive = navItem.href === pathname;

          if (!navItem.builtInThisSprint) {
            return (
              <span
                key={navItem.label}
                className="font-heading text-[16px] text-neutral-500"
                title="Not in this build yet"
              >
                {navItem.label}
              </span>
            );
          }

          return (
            <Link
              key={navItem.label}
              href={navItem.href}
              className={cx(
                "font-heading text-[16px] border-b-2 pb-1",
                isActive ? "border-accent text-text" : "border-transparent text-text/80 hover:border-neutral-300"
              )}
            >
              {navItem.label}
            </Link>
          );
        })}
      </div>

      {currentUser?.user ? (
        <div className="flex items-center gap-2">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-accent-200 font-mono text-[12px] text-accent-800">
            {buildInitialsFromFullName(currentUser.user.fullName)}
          </span>
          <span className="text-[15px]">{currentUser.user.fullName}</span>
        </div>
      ) : null}
    </nav>
  );
}
