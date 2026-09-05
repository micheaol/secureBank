"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetChallengeByCodeQuery, useRevealHintMutation, useSubmitChallengeAnswerMutation } from "@/lib/redux/challengesApi";
import { useGetChallengesForLabQuery } from "@/lib/redux/labsApi";
import { EvidenceSectionView } from "@/components/sandbox/EvidenceSectionView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cx } from "@/components/ui/cx";

export default function ChallengeWorkspacePage() {
  const { challengeCode } = useParams();
  const router = useRouter();

  const { data: challenge, isLoading } = useGetChallengeByCodeQuery(challengeCode);
  const { data: labChallengeData } = useGetChallengesForLabQuery(challenge?.lab, { skip: !challenge?.lab });
  const [revealHint] = useRevealHintMutation();
  const [submitAnswer, { isLoading: isSubmitting, error: submitError }] = useSubmitChallengeAnswerMutation();

  const [activeSectionId, setActiveSectionId] = useState(null);
  const [evidenceBoard, setEvidenceBoard] = useState([]);
  const [answer, setAnswer] = useState("");
  const [submitFailedMessage, setSubmitFailedMessage] = useState(null);

  const sections = challenge?.evidenceBundle?.sections ?? [];
  const currentSectionId = activeSectionId ?? sections[0]?.id;
  const currentSection = sections.find((section) => section.id === currentSectionId);

  function handleAddEvidence(item) {
    setEvidenceBoard((current) => {
      const alreadyExists = current.some((existing) => existing.text === item.text);
      if (alreadyExists) return current;
      return [...current, item];
    });
  }

  async function handleRevealHint(hintOrder) {
    await revealHint({ challengeCode, hintOrder });
  }

  async function handleSubmit() {
    setSubmitFailedMessage(null);
    const result = await submitAnswer({ challengeCode, answer, evidence: evidenceBoard }).unwrap();
    if (result.correct) {
      router.push(`/sandbox/challenges/${challengeCode}/success`);
    } else {
      setSubmitFailedMessage("Validation failed - that finding doesn't match what changed in this release. Try again.");
    }
  }

  if (isLoading || !challenge) {
    return <p className="py-8 text-[15px] text-neutral-700">Loading challenge...</p>;
  }

  const labChallenges = labChallengeData?.challenges ?? [];

  return (
    <div className="mx-auto max-w-[1560px] py-4">
      <div className="flex items-center justify-between border-b border-text pb-3">
        <div className="flex items-center gap-4">
          <Link href={`/sandbox/labs/${challenge.lab}`} className="font-mono text-[12px] uppercase text-accent-700">
            ← Labs
          </Link>
          <h1 className="text-[26px]">{labChallengeData?.lab?.name ?? challenge.lab}</h1>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[208px_minmax(0,1fr)_296px]">
        <aside className="sticky top-4 self-start">
          {labChallenges.map((item) => {
            const isCurrent = item.code === challengeCode;
            const isLocked = item.status === "LOCKED";
            return (
              <Link
                key={item.code}
                href={isLocked ? "#" : `/sandbox/challenges/${item.code}/workspace`}
                onClick={(event) => isLocked && event.preventDefault()}
                title={isLocked ? "Solve the previous challenge to unlock this one." : undefined}
                className={cx(
                  "block rounded-md px-2 py-1.5",
                  isCurrent && "bg-accent-100",
                  isLocked && "text-neutral-500"
                )}
              >
                <p className="font-mono text-[10px] text-neutral-600">
                  {item.code} · {item.points} XP
                </p>
                <p className="truncate text-[14px] leading-[1.25]">{item.title}</p>
              </Link>
            );
          })}
        </aside>

        <div>
          <p className="font-mono text-[10px] uppercase text-neutral-600">
            Challenge {challenge.code} · {challenge.difficulty} · {challenge.points} XP
          </p>
          <h2 className="mt-1 max-w-[30ch] text-[32px] leading-[1.1]">{challenge.title}</h2>

          <div className="mt-6 max-w-[66ch] text-[17px] leading-[1.55]">
            <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Scenario</p>
            <p className="mt-1">{challenge.scenario}</p>
            <p className="mt-4 font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Objective</p>
            <p className="mt-1">{challenge.objective}</p>
          </div>

          {sections.length > 0 ? (
            <div className="mt-8">
              <div className="flex gap-4 border-b border-divider">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    className={cx(
                      "border-b-2 pb-2 font-mono text-[11px] uppercase tracking-[0.1em]",
                      currentSectionId === section.id ? "border-accent text-text" : "border-transparent text-neutral-600"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                {currentSection ? <EvidenceSectionView section={currentSection} onAddEvidence={handleAddEvidence} /> : null}
              </div>
            </div>
          ) : null}

          <div className="mt-10 border-t-4 border-text pt-6">
            <h3 className="text-[22px]">Record finding</h3>
            <p className="mt-1 text-[14px] text-neutral-700">
              Submissions are validated against the environment. Evidence is attached automatically from your board.
            </p>

            <div className="mt-4 max-w-[420px]">
              <Input
                placeholder="What did you find? (component, parameter, value...)"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={challenge.status === "SOLVED"}
              />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Button onClick={handleSubmit} disabled={!answer.trim() || isSubmitting || challenge.status === "SOLVED"}>
                {challenge.status === "SOLVED" ? "Solved" : isSubmitting ? "Reproducing against environment..." : "Submit finding"}
              </Button>
              {submitFailedMessage ? <p className="font-mono text-[11px] uppercase text-accent-2-700">{submitFailedMessage}</p> : null}
              {submitError && !submitFailedMessage ? (
                <p className="font-mono text-[11px] uppercase text-accent-2-700">{submitError?.data?.message}</p>
              ) : null}
            </div>

            {challenge.status === "SOLVED" ? (
              <div className="mt-4">
                <Link href={`/sandbox/challenges/${challengeCode}/remediation`}>
                  <Button variant="secondary">Fix It</Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="sticky top-4 flex flex-col gap-6 self-start">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Hints</p>
            <div className="mt-2 divide-y divide-divider">
              {challenge.hints.map((hint) => {
                const isRevealed = hint.revealed;
                const isNextRevealable = !isRevealed && hint.order === (challenge.hints.filter((h) => h.revealed).length + 1);
                return (
                  <div key={hint.order} className="py-2">
                    {isRevealed ? (
                      <p className="text-[14px]">{hint.content}</p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px]">
                          Hint {hint.order} · −{hint.cost} XP
                        </span>
                        {isNextRevealable ? (
                          <button
                            type="button"
                            onClick={() => handleRevealHint(hint.order)}
                            className="font-mono text-[10px] uppercase text-accent-700 hover:underline"
                          >
                            Reveal
                          </button>
                        ) : (
                          <span className="font-mono text-[10px] uppercase text-neutral-500">Locked</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">
              Evidence board · {evidenceBoard.length} items
            </p>
            {evidenceBoard.length === 0 ? (
              <p className="mt-2 text-[13px] text-neutral-700">
                Nothing collected yet. Add rows from the tabs above as you work - they attach to your finding.
              </p>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                {evidenceBoard.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-2 rounded-md border border-divider p-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase text-accent-700">{item.source}</p>
                      <p className="text-[13px]">{item.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEvidenceBoard((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      className="text-[14px] text-neutral-600"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
