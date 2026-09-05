"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useGetLabsQuery } from "@/lib/redux/labsApi";
import { useGetMyScoreQuery } from "@/lib/redux/scoringApi";
import { useRequestFacilitatorHelpMutation } from "@/lib/redux/helpRequestsApi";
import { cx } from "../ui/cx";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/sandbox/dashboard", builtInThisSprint: true },
  { label: "Labs", href: "/sandbox/labs", builtInThisSprint: true },
  { label: "Findings", href: null, builtInThisSprint: false },
  { label: "Achievements", href: "/sandbox/achievements", builtInThisSprint: true },
  { label: "Leaderboard", href: "/sandbox/leaderboard", builtInThisSprint: true },
  { label: "Team", href: "/sandbox/team", builtInThisSprint: true },
];

export function SandboxRail() {
  const pathname = usePathname();
  const { data: labs } = useGetLabsQuery();
  const { data: score } = useGetMyScoreQuery();
  const [requestFacilitatorHelp] = useRequestFacilitatorHelpMutation();
  const [helpRequestSent, setHelpRequestSent] = useState(false);

  async function handleRequestFacilitator() {
    const reason = window.prompt("What do you need help with?");
    if (!reason) return;
    await requestFacilitatorHelp({ reason });
    setHelpRequestSent(true);
  }

  const totalChallenges = labs?.reduce((sum, lab) => sum + lab.totalChallenges, 0) ?? 0;
  const solvedChallenges = labs?.reduce((sum, lab) => sum + lab.solvedChallenges, 0) ?? 0;

  const counters = {
    Labs: labs?.length,
    Dashboard: undefined,
    Findings: undefined,
    Achievements: undefined,
    Leaderboard: score?.rank ? `#${score.rank}` : undefined,
    Team: undefined,
  };

  return (
    <aside className="sticky top-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-600">Sandbox</p>
      <nav className="mt-3 flex flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === pathname;
          const counter = counters[item.label];

          if (!item.builtInThisSprint) {
            return (
              <span
                key={item.label}
                className="flex items-center justify-between py-[5px] pr-0 font-heading text-[16px] text-neutral-500"
                title="Not in this build yet"
              >
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cx(
                "flex items-center justify-between py-[5px] pr-0 font-heading text-[16px]",
                isActive ? "text-accent-700" : "hover:text-accent-700"
              )}
            >
              <span>{item.label}</span>
              {counter !== undefined ? <span className="font-mono text-[10px] text-neutral-600">{counter}</span> : null}
            </Link>
          );
        })}
        {totalChallenges > 0 ? (
          <p className="mt-2 font-mono text-[10px] text-neutral-600">
            {solvedChallenges}/{totalChallenges} challenges
          </p>
        ) : null}
      </nav>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleRequestFacilitator}
          className="rounded-md border border-text/25 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-neutral-200"
        >
          {helpRequestSent ? "Request sent" : "Request Facilitator"}
        </button>
      </div>
    </aside>
  );
}
