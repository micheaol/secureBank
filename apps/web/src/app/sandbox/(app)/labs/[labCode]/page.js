"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetLabByCodeQuery, useGetChallengesForLabQuery } from "@/lib/redux/labsApi";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";

const STATUS_GLYPHS = { SOLVED: "✓", ACTIVE: "●", AVAILABLE: "○", LOCKED: "·" };

export default function LabDetailPage() {
  const { labCode } = useParams();
  const router = useRouter();
  const { data: lab } = useGetLabByCodeQuery(labCode);
  const { data: challengeData, isLoading } = useGetChallengesForLabQuery(labCode);
  const challenges = challengeData?.challenges ?? [];

  const totalPoints = challenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const nextChallenge = challenges.find((challenge) => challenge.status !== "SOLVED") ?? challenges[0];

  function handleLaunch() {
    if (nextChallenge) {
      router.push(`/sandbox/labs/${labCode}/environment?challenge=${nextChallenge.code}`);
    }
  }

  return (
    <div className="py-2">
      <Link href="/sandbox/labs" className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-700">
        Labs
      </Link>
      <h1 className="mt-2 max-w-[24ch] text-[46px] leading-[1.05]">{lab?.name ?? labCode}</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Mission</p>
          <p className="mt-2 max-w-[58ch] text-[19px] leading-[1.5]">{lab?.description}</p>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Challenges</p>
          {isLoading ? (
            <p className="mt-2 text-[15px] text-neutral-700">Loading challenges...</p>
          ) : (
            <table className="mt-2 w-full text-[14px]">
              <thead>
                <tr className="border-b border-divider text-left font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-600">
                  <th className="py-2 font-normal">#</th>
                  <th className="py-2 font-normal">Challenge</th>
                  <th className="py-2 font-normal">Difficulty</th>
                  <th className="py-2 text-right font-normal">XP</th>
                  <th className="py-2 text-right font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {challenges.map((challenge, index) => (
                  <tr key={challenge.code}>
                    <td className="py-3 font-mono text-neutral-600">{String(index + 1).padStart(2, "0")}</td>
                    <td className="py-3">
                      {challenge.status === "LOCKED" ? (
                        <span className="text-neutral-500">{challenge.title}</span>
                      ) : (
                        <Link href={`/sandbox/challenges/${challenge.code}/workspace`} className="hover:text-accent-700">
                          {challenge.title}
                        </Link>
                      )}
                    </td>
                    <td className="py-3">{challenge.difficulty}</td>
                    <td className="py-3 text-right tabular-nums">{challenge.points}</td>
                    <td
                      className={cx(
                        "py-3 text-right font-mono text-[11px] uppercase",
                        challenge.status === "SOLVED" && "text-accent-700",
                        challenge.status === "LOCKED" && "text-neutral-500"
                      )}
                    >
                      {STATUS_GLYPHS[challenge.status]} {challenge.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Difficulty</p>
          <p className="text-[15px]">Mixed</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Points available</p>
          <p className="text-[15px]">{totalPoints} XP</p>
          <p className="mt-4 text-[13px] text-neutral-700">
            Desktop or laptop recommended - this lab uses multiple technical panels side by side.
          </p>
          <Button className="mt-6 w-full py-3" onClick={handleLaunch} disabled={!nextChallenge}>
            Launch Lab Environment
          </Button>
        </div>
      </div>
    </div>
  );
}
