"use client";

import { useState } from "react";
import { useGetMyTeamQuery, useJoinTeamMutation, useLeaveTeamMutation } from "@/lib/redux/teamsApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SandboxTeamPage() {
  const { data: team, isLoading } = useGetMyTeamQuery();
  const [joinTeam, { isLoading: isJoining }] = useJoinTeamMutation();
  const [leaveTeam] = useLeaveTeamMutation();
  const [teamName, setTeamName] = useState("");

  async function handleJoin(event) {
    event.preventDefault();
    if (!teamName.trim()) return;
    await joinTeam(teamName.trim());
    setTeamName("");
  }

  return (
    <div className="py-2">
      <h1 className="text-[38px]">Team</h1>

      {isLoading ? (
        <p className="mt-6 text-[15px] text-neutral-700">Loading...</p>
      ) : team ? (
        <div className="mt-8 max-w-[560px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Your team</p>
          <h2 className="mt-1 text-[26px]">{team.name}</h2>
          <p className="mt-1 font-mono text-[13px] text-accent-700">{team.totalScore.toLocaleString()} XP combined</p>

          <div className="mt-6 divide-y divide-divider">
            {team.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-2 text-[15px]">
                <span>{member.fullName}</span>
                <span className="font-mono text-[13px] text-neutral-700">{member.score.toLocaleString()} XP</span>
              </div>
            ))}
          </div>

          <Button variant="ghost" destructive className="mt-6" onClick={() => leaveTeam()}>
            Leave team
          </Button>
        </div>
      ) : (
        <Card className="mt-8 max-w-[480px]">
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Join or create a team</p>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleJoin}>
            <Input placeholder="Team name" value={teamName} onChange={(event) => setTeamName(event.target.value)} />
            <Button type="submit" disabled={isJoining || !teamName.trim()}>
              {isJoining ? "Joining..." : "Join team"}
            </Button>
          </form>
          <p className="mt-3 text-[13px] text-neutral-700">
            Enter an existing team&apos;s name to join it, or a new name to create one.
          </p>
        </Card>
      )}
    </div>
  );
}
