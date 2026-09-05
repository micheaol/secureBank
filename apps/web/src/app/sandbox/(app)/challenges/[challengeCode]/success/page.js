"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetChallengeByCodeQuery } from "@/lib/redux/challengesApi";
import { Button } from "@/components/ui/Button";
import { CmykNumber } from "@/components/ui/CmykNumber";

export default function ChallengeSuccessPage() {
  const { challengeCode } = useParams();
  const { data: challenge, isLoading } = useGetChallengeByCodeQuery(challengeCode);

  if (isLoading || !challenge) {
    return <p className="py-8 text-[15px] text-neutral-700">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-[900px] py-[72px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Validated against your environment</p>
      <h1 className="mt-2 max-w-[22ch] text-[54px] leading-[1.05]">Vulnerability confirmed</h1>
      <p className="mt-3 max-w-[52ch] text-[20px] italic text-neutral-800">{challenge.title}</p>

      <div className="mt-8 flex items-center gap-6">
        <CmykNumber value={`+${challenge.pointsAwarded}`} className="text-[76px] font-semibold" />
        <div className="font-mono text-[12px] leading-[1.9] text-neutral-700">
          <p>Challenge solved</p>
          <p>Score updated</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <p className="font-mono text-[10px] uppercase text-neutral-600">Finding</p>
          <p className="text-[15px]">{challenge.title}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-neutral-600">Affected component</p>
          <p className="font-mono text-[15px]">{challenge.submittedAnswer}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-neutral-600">Difficulty</p>
          <p className="text-[15px]">{challenge.difficulty}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-neutral-600">Evidence attached</p>
          <p className="text-[15px]">{challenge.evidence?.length ?? 0} items</p>
        </div>
      </div>

      <p className="mt-8 text-[16px] text-neutral-700">
        Finding it is half the exercise. The release is still shipping the vulnerable component.
      </p>

      <div className="mt-6 flex gap-3">
        <Link href={`/sandbox/challenges/${challengeCode}/remediation`}>
          <Button size="lg">Fix It</Button>
        </Link>
        <Link href={`/sandbox/labs/${challenge.lab}`}>
          <Button variant="ghost">Back to challenges</Button>
        </Link>
      </div>
    </div>
  );
}
