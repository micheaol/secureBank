"use client";

import Link from "next/link";
import { useGetCurrentUserQuery } from "@/lib/redux/authApi";
import { useGetLabsQuery } from "@/lib/redux/labsApi";
import { useGetMyScoreQuery } from "@/lib/redux/scoringApi";
import { Card } from "@/components/ui/Card";

const DIFFICULTY_ESTIMATED_XP = { WEB: 900, API: 900, AI: 900, DEVSECOPS: 900, SUPPLY_CHAIN: 800 };

export default function SandboxDashboardPage() {
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: labs, isLoading } = useGetLabsQuery();
  const { data: score } = useGetMyScoreQuery();

  const firstName = currentUser?.user?.fullName?.split(" ")[0] ?? "";
  const totalChallenges = labs?.reduce((sum, lab) => sum + lab.totalChallenges, 0) ?? 0;
  const solvedChallenges = labs?.reduce((sum, lab) => sum + lab.solvedChallenges, 0) ?? 0;

  return (
    <div className="py-2">
      <h1 className="text-[38px]">Good morning, {firstName}</h1>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Challenges</p>
          <p className="mt-1 text-[32px] font-semibold">
            {solvedChallenges} <span className="text-[20px] text-neutral-500">/ {totalChallenges}</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Score</p>
          <p className="mt-1 text-[32px] font-semibold text-accent-700">{(score?.totalScore ?? 0).toLocaleString()} XP</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Rank</p>
          <p className="mt-1 text-[32px] font-semibold">{score?.rank ? `#${score.rank}` : "—"}</p>
        </div>
      </div>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-600">Labs</p>
      {isLoading ? (
        <p className="mt-3 text-[15px] text-neutral-700">Loading labs...</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {labs?.map((lab) => (
            <Link key={lab.code} href={`/sandbox/labs/${lab.code}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-accent-700">{lab.code}</span>
                </div>
                <p className="mt-2 text-[21px] leading-[1.15]">{lab.name}</p>
                <p className="mt-2 font-mono text-[11px] text-neutral-700">
                  {lab.solvedChallenges}/{lab.totalChallenges} challenges · {DIFFICULTY_ESTIMATED_XP[lab.code] ?? 0} XP
                </p>
                <div className="mt-3 h-[3px] w-full bg-neutral-300">
                  <div
                    className="h-[3px] bg-accent transition-all duration-500"
                    style={{ width: lab.totalChallenges ? `${(lab.solvedChallenges / lab.totalChallenges) * 100}%` : "0%" }}
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
