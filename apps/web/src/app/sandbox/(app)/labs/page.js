"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetLabsQuery } from "@/lib/redux/labsApi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";

const FILTERS = ["All labs", "Available", "In progress", "Completed", "Locked"];

function matchesFilter(lab, filter) {
  if (filter === "All labs") return true;
  if (filter === "Locked") return lab.totalChallenges === 0;
  if (filter === "Available") return lab.totalChallenges > 0 && lab.solvedChallenges === 0;
  if (filter === "In progress") return lab.solvedChallenges > 0 && lab.solvedChallenges < lab.totalChallenges;
  if (filter === "Completed") return lab.totalChallenges > 0 && lab.solvedChallenges === lab.totalChallenges;
  return true;
}

export default function LabCataloguePage() {
  const { data: labs, isLoading } = useGetLabsQuery();
  const [activeFilter, setActiveFilter] = useState("All labs");

  const filteredLabs = labs?.filter((lab) => matchesFilter(lab, activeFilter)) ?? [];

  return (
    <div className="py-2">
      <h1 className="text-[40px]">Lab catalogue</h1>
      <p className="mt-2 max-w-[56ch] text-[17px] text-neutral-700">
        Five interconnected security laboratories. Progress through each at your own pace.
      </p>

      <div className="mt-6 flex gap-4 border-b border-divider">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={cx(
              "border-b-2 pb-2 font-mono text-[11px] uppercase tracking-[0.08em]",
              activeFilter === filter ? "border-accent text-text" : "border-transparent text-neutral-600"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-6 text-[15px] text-neutral-700">Loading labs...</p>
      ) : filteredLabs.length === 0 ? (
        <div className="mt-10">
          <h2 className="text-[26px]">Nothing here yet</h2>
          <p className="mt-2 text-[15px] text-neutral-700">No labs match this filter right now.</p>
          <Button variant="secondary" className="mt-4" onClick={() => setActiveFilter("All labs")}>
            Show all labs
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLabs.map((lab) => {
            const isSolved = lab.totalChallenges > 0 && lab.solvedChallenges === lab.totalChallenges;
            return (
              <Card key={lab.code} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-accent-700">{lab.code}</span>
                  <span className="rounded-md border border-accent-2-700 px-2 py-0.5 font-mono text-[10px] uppercase text-accent-2-700">
                    Active
                  </span>
                </div>
                <p className="mt-2 text-[25px] leading-[1.1]">{lab.name}</p>
                <p className="mt-2 text-[15px] text-neutral-700">{lab.description}</p>
                <p className="mt-auto pt-4 font-mono text-[11px] text-neutral-700">
                  {lab.totalChallenges} challenges
                </p>
                <div className="mt-2 h-[3px] w-full bg-neutral-300">
                  <div
                    className="h-[3px] bg-accent"
                    style={{ width: lab.totalChallenges ? `${(lab.solvedChallenges / lab.totalChallenges) * 100}%` : "0%" }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-neutral-700">
                    {lab.solvedChallenges}/{lab.totalChallenges} solved
                  </span>
                  <Link href={`/sandbox/labs/${lab.code}`}>
                    <Button variant="secondary">{isSolved ? "Review lab" : "Open lab"}</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
