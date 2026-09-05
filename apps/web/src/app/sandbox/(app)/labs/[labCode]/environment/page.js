"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStartChallengeMutation } from "@/lib/redux/challengesApi";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";

const PROVISIONING_STEPS = [
  "Allocating isolated environment",
  "Loading SecureBank services",
  "Seeding synthetic data",
  "Configuring access",
  "Running health checks",
];

const STEP_INTERVAL_MS = 1100;

export default function LabEnvironmentPage() {
  const { labCode } = useParams();
  const searchParams = useSearchParams();
  const challengeCode = searchParams.get("challenge");
  const router = useRouter();

  const [startChallenge] = useStartChallengeMutation();
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      setStepIndex(currentStep);
    }, STEP_INTERVAL_MS);

    startChallenge(challengeCode)
      .unwrap()
      .then((startResult) => setResult(startResult))
      .catch(() => {});

    return () => clearInterval(interval);
  }, [challengeCode, startChallenge]);

  const animationDone = stepIndex >= PROVISIONING_STEPS.length;
  const isReady = animationDone && result;

  if (isReady) {
    return (
      <div className="mx-auto max-w-[620px] py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">● Environment ready</p>
        <h1 className="mt-2 text-[42px]">Your environment is running</h1>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase text-neutral-600">Environment ID</p>
            <p className="font-mono text-[15px]">{result.environment.externalId} · {labCode.toLowerCase()}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-neutral-600">Expires in</p>
            <p className="font-mono text-[15px]">2h 00m</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-neutral-600">Health</p>
            <p className="text-[15px]">✓ All checks passing</p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button onClick={() => router.push(`/sandbox/challenges/${challengeCode}/workspace`)}>Open Workspace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[620px] py-8">
      <h1 className="text-[34px]">Preparing your SecureBank environment</h1>
      <p className="mt-1 font-mono text-[12px] uppercase text-neutral-600">{labCode} lab · usually 60-90 seconds</p>

      <div className="mt-8 divide-y divide-divider">
        {PROVISIONING_STEPS.map((step, index) => {
          const state = index < stepIndex ? "done" : index === stepIndex ? "working" : "queued";
          return (
            <div key={step} className="flex items-center justify-between py-[9px]">
              <span className="text-[15px]">{step}</span>
              <span
                className={cx(
                  "font-mono text-[11px] uppercase",
                  state === "done" && "text-accent-700",
                  state === "working" && "sb-pulse text-accent-2-700",
                  state === "queued" && "text-neutral-500"
                )}
              >
                {state === "done" ? "✓ done" : state === "working" ? "● working" : "○ queued"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 h-[3px] w-full bg-neutral-300">
        <div className="h-[3px] bg-accent transition-all duration-500" style={{ width: `${(stepIndex / PROVISIONING_STEPS.length) * 100}%` }} />
      </div>

      <Button variant="ghost" className="mt-6" onClick={() => router.push(`/sandbox/labs/${labCode}`)}>
        Cancel and return to labs
      </Button>
    </div>
  );
}
