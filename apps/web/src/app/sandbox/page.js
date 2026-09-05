"use client";

import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/lib/redux/authApi";
import { useGetLabsQuery } from "@/lib/redux/labsApi";
import { useGetMyScoreQuery } from "@/lib/redux/scoringApi";
import { Button } from "@/components/ui/Button";
import { CmykNumber } from "@/components/ui/CmykNumber";

export default function SandboxWelcomePage() {
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: labs } = useGetLabsQuery();
  const { data: score } = useGetMyScoreQuery();

  const labsCompleted = labs?.filter((lab) => lab.totalChallenges > 0 && lab.solvedChallenges === lab.totalChallenges).length ?? 0;

  return (
    <div className="mx-auto max-w-[1000px] px-8 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-700">Sandbox entry · Edition 04</p>
      <h1 className="mt-4 max-w-[18ch] text-[62px] leading-[1.02]">Welcome to SecureBank Security Operations</h1>
      <p className="mt-4 max-w-[46ch] text-[21px] italic text-neutral-800">
        Your mission is to assess SecureBank before its next major release.
      </p>

      <div className="mt-12 grid max-w-[860px] grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-600">Participant</p>
          <p className="mt-1 text-[22px]">{currentUser?.user?.fullName ?? "—"}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-600">Rank</p>
          <p className="mt-1 text-[22px]">{score?.rank ? `#${score.rank} of ${score.totalParticipants}` : "—"}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-600">Labs completed</p>
          <p className="mt-1 text-[22px]">{labsCompleted} of {labs?.length ?? 5}</p>
        </div>
      </div>

      <div className="mt-10">
        <CmykNumber value={(score?.totalScore ?? 0).toLocaleString()} className="text-[84px] font-semibold" />
      </div>

      <Button size="lg" className="mt-10" onClick={() => router.push("/sandbox/dashboard")}>
        Enter Sandbox
      </Button>

      <p className="mt-[72px] max-w-[62ch] text-[13px] text-neutral-700">
        All accounts, transactions and challenge data in this Sandbox are synthetic and generated for this training
        environment. Stay within your assigned lab scope at all times.
      </p>
    </div>
  );
}
