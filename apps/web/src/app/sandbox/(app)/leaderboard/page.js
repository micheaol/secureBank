"use client";

import { useState } from "react";
import { useGetLeaderboardQuery } from "@/lib/redux/scoringApi";
import { useGetTeamLeaderboardQuery } from "@/lib/redux/teamsApi";
import { cx } from "@/components/ui/cx";

export default function LeaderboardPage() {
  const [view, setView] = useState("individual");
  const { data: individualLeaderboard, isLoading: isLoadingIndividual } = useGetLeaderboardQuery();
  const { data: teamLeaderboard, isLoading: isLoadingTeams } = useGetTeamLeaderboardQuery();

  return (
    <div className="py-2">
      <h1 className="text-[38px]">Leaderboard</h1>

      <div className="mt-6 flex gap-4 border-b border-divider">
        {["individual", "team"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setView(option)}
            className={cx(
              "border-b-2 pb-2 font-mono text-[11px] uppercase tracking-[0.08em]",
              view === option ? "border-accent text-text" : "border-transparent text-neutral-600"
            )}
          >
            {option === "individual" ? "Individual" : "Team"}
          </button>
        ))}
      </div>

      {view === "individual" ? (
        isLoadingIndividual ? (
          <p className="mt-6 text-[15px] text-neutral-700">Loading...</p>
        ) : (
          <table className="mt-6 w-full text-[15px]">
            <tbody className="divide-y divide-divider">
              {individualLeaderboard?.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="w-12 py-3 font-mono text-neutral-600">#{index + 1}</td>
                  <td className="py-3">{entry.fullName}</td>
                  <td className="py-3 text-right font-mono text-accent-700">{entry.totalScore.toLocaleString()} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : isLoadingTeams ? (
        <p className="mt-6 text-[15px] text-neutral-700">Loading...</p>
      ) : (
        <table className="mt-6 w-full text-[15px]">
          <tbody className="divide-y divide-divider">
            {teamLeaderboard?.map((entry, index) => (
              <tr key={entry.id}>
                <td className="w-12 py-3 font-mono text-neutral-600">#{index + 1}</td>
                <td className="py-3">{entry.name}</td>
                <td className="py-3 font-mono text-[13px] text-neutral-700">{entry.memberCount} members</td>
                <td className="py-3 text-right font-mono text-accent-700">{entry.totalScore.toLocaleString()} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
