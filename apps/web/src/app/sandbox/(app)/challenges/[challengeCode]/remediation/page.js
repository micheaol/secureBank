"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetChallengeByCodeQuery, useRemediateChallengeMutation } from "@/lib/redux/challengesApi";
import { useGetChallengesForLabQuery } from "@/lib/redux/labsApi";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";

const PIPELINE_STAGES = ["Source", "Build", "Test", "SAST", "SCA", "Secrets", "Container", "IaC", "Package", "Deploy"];
const STAGE_INTERVAL_MS = 520;

export default function RemediationPage() {
  const { challengeCode } = useParams();
  const { data: challenge, isLoading } = useGetChallengeByCodeQuery(challengeCode);
  const { data: labChallengeData } = useGetChallengesForLabQuery(challenge?.lab, { skip: !challenge?.lab });
  const [remediateChallenge] = useRemediateChallengeMutation();

  const [pipelineStage, setPipelineStage] = useState(-1);
  const [remediationResult, setRemediationResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  async function handleRunVerification() {
    setIsRunning(true);
    setPipelineStage(0);

    for (let stage = 1; stage <= PIPELINE_STAGES.length; stage += 1) {
      await new Promise((resolve) => setTimeout(resolve, STAGE_INTERVAL_MS));
      setPipelineStage(stage);
    }

    const result = await remediateChallenge(challengeCode).unwrap();
    setRemediationResult(result);
    setIsRunning(false);
  }

  if (isLoading || !challenge) {
    return <p className="py-8 text-[15px] text-neutral-700">Loading...</p>;
  }

  const nextChallenge = labChallengeData?.challenges?.find((item) => item.status === "AVAILABLE");
  const verificationComplete = pipelineStage >= PIPELINE_STAGES.length;

  return (
    <div className="mx-auto max-w-[1200px] py-6">
      <p className="font-mono text-[11px] uppercase text-neutral-600">Remediation · {challengeCode}</p>
      <h1 className="mt-1 text-[44px]">Fix it</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Root cause</p>
          <p className="mt-2 max-w-[62ch] text-[17px] leading-[1.55]">{challenge.remediationGuide}</p>

          {challenge.remediationDiff ? (
            <>
              <p className="mt-6 font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">
                {challenge.remediationDiff.filename} · your change
              </p>
              <pre className="mt-2 overflow-x-auto rounded-md border border-divider bg-neutral-100 p-3 font-mono text-[13px] leading-[1.65]">
                {challenge.remediationDiff.removedLines.map((line, index) => (
                  <div key={`removed-${index}`} className="text-accent-2-700">
                    - {line}
                  </div>
                ))}
                {challenge.remediationDiff.addedLines.map((line, index) => (
                  <div key={`added-${index}`} className="text-accent-700">
                    + {line}
                  </div>
                ))}
              </pre>
            </>
          ) : null}

          <div className="mt-6 flex items-center gap-4">
            <Button onClick={handleRunVerification} disabled={isRunning || Boolean(remediationResult)}>
              {remediationResult ? "Verified" : isRunning ? "Running verification..." : "Submit Fix & Run Verification"}
            </Button>
            <p className="font-mono text-[11px] text-neutral-600">Rebuilds the artifact and re-runs all ten gates.</p>
          </div>

          {remediationResult ? (
            <div className="mt-6">
              <p className="font-mono text-[13px] text-accent-700">✓ Vulnerability no longer reproducible</p>
              <p className="font-mono text-[13px] text-accent-700">✓ Functional tests passed</p>
              <p className="font-mono text-[13px] text-accent-700">✓ Security verification passed</p>
              <p className="mt-4 text-[40px] font-semibold text-accent-700">+{remediationResult.pointsAwarded} XP</p>
              {nextChallenge ? (
                <Link href={`/sandbox/challenges/${nextChallenge.code}/workspace`}>
                  <Button className="mt-4">Next challenge</Button>
                </Link>
              ) : (
                <Link href={`/sandbox/labs/${challenge.lab}`}>
                  <Button className="mt-4">Back to lab</Button>
                </Link>
              )}
            </div>
          ) : null}
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Verification pipeline</p>
          <div className="mt-2 divide-y divide-divider">
            {PIPELINE_STAGES.map((stage, index) => {
              const state = index < pipelineStage || verificationComplete ? "passed" : index === pipelineStage ? "running" : "pending";
              return (
                <div key={stage} className="flex items-center justify-between py-[8px]">
                  <span className="text-[14px]">{stage}</span>
                  <span
                    className={cx(
                      "font-mono text-[11px] uppercase",
                      state === "passed" && "text-accent-700",
                      state === "running" && "sb-pulse text-process-yellow",
                      state === "pending" && "text-neutral-500"
                    )}
                  >
                    {state === "passed" ? "✓ passed" : state === "running" ? "● running" : "○ pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
