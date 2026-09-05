"use client";

import { Masthead } from "@/components/layout/Masthead";
import { useGetTeamLeaderboardQuery } from "@/lib/redux/teamsApi";
import { CmykNumber } from "@/components/ui/CmykNumber";

export default function ConferenceDisplayPage() {
  const { data: teams, isLoading } = useGetTeamLeaderboardQuery();

  const podium = teams?.slice(0, 3) ?? [];
  const rest = teams?.slice(3, 10) ?? [];

  return (
    <>
      <Masthead activeSurface="conference" />
      <div className="mx-auto max-w-[1600px] px-8 py-8">
        <div className="border-b-4 border-text pb-4">
          <h1 className="text-[52px]">Standings</h1>
        </div>

        {isLoading ? (
          <p className="mt-8 text-[15px] text-neutral-700">Loading standings...</p>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {podium.map((team, index) => (
                <div key={team.id} className="text-center">
                  <CmykNumber value={`#${index + 1}`} className="text-[96px] font-semibold" />
                  <p className="mt-2 text-[34px]">{team.name}</p>
                  <p className="mt-1 font-mono text-[20px] text-accent-700">{team.totalScore.toLocaleString()} XP</p>
                  <p className="font-mono text-[13px] text-neutral-700">{team.memberCount} members</p>
                </div>
              ))}
            </div>

            <table className="mt-16 w-full text-[20px]">
              <thead>
                <tr className="border-b border-divider text-left font-mono text-[14px] uppercase text-neutral-600">
                  <th className="py-2 font-normal">Rank</th>
                  <th className="py-2 font-normal">Team</th>
                  <th className="py-2 text-right font-normal">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {rest.map((team, index) => (
                  <tr key={team.id}>
                    <td className="py-3 font-mono text-neutral-600">#{index + 4}</td>
                    <td className="py-3">{team.name}</td>
                    <td className="py-3 text-right font-mono text-accent-700">{team.totalScore.toLocaleString()} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <p className="mt-10 font-mono text-[12px] text-neutral-600">
          Team names only. No participant environments, credentials or findings are shown on venue displays.
        </p>
      </div>
    </>
  );
}
