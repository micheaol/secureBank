"use client";

import { useState } from "react";
import { Masthead } from "@/components/layout/Masthead";
import {
  useGetFacilitatorOverviewQuery,
  useGetFacilitatorLabHealthQuery,
  useGetFacilitatorParticipantsQuery,
  useGetFacilitatorParticipantDetailQuery,
  useExtendParticipantEnvironmentMutation,
  useResetParticipantEnvironmentMutation,
} from "@/lib/redux/facilitatorApi";
import { useGetOpenHelpRequestsQuery, useResolveHelpRequestMutation } from "@/lib/redux/helpRequestsApi";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";

function StatTile({ label, value, note, alert }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">{label}</p>
      <p className={cx("mt-1 text-[32px] font-semibold", alert && "text-accent-2-700")}>{value}</p>
      {note ? <p className="text-[13px] text-neutral-700">{note}</p> : null}
    </div>
  );
}

export default function FacilitatorConsolePage() {
  const { data: overview, error: overviewError } = useGetFacilitatorOverviewQuery();
  const { data: labHealth } = useGetFacilitatorLabHealthQuery(undefined, { skip: !overview });
  const { data: participants } = useGetFacilitatorParticipantsQuery(undefined, { skip: !overview });
  const { data: helpQueue } = useGetOpenHelpRequestsQuery(undefined, { skip: !overview });
  const [resolveHelpRequest] = useResolveHelpRequestMutation();

  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const { data: participantDetail } = useGetFacilitatorParticipantDetailQuery(selectedParticipantId, {
    skip: !selectedParticipantId,
  });
  const [extendEnvironment] = useExtendParticipantEnvironmentMutation();
  const [resetEnvironment] = useResetParticipantEnvironmentMutation();

  if (overviewError) {
    return (
      <>
        <Masthead activeSurface="facilitator" />
        <div className="mx-auto max-w-[720px] px-8 py-16">
          <h1 className="text-[32px]">Access restricted</h1>
          <p className="mt-2 text-[15px] text-neutral-700">
            The Facilitator console is only available to facilitator, sandbox administrator, or administrator
            accounts.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Masthead activeSurface="facilitator" />
      <div className="mx-auto max-w-[1440px] px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[36px]">Facilitator Console</h1>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <StatTile label="Registered" value={overview?.registeredParticipants ?? "—"} />
          <StatTile label="Active" value={overview?.activeParticipants ?? "—"} note="have scored at least once" />
          <StatTile label="Environments running" value={overview?.runningEnvironments ?? "—"} />
          <StatTile label="Need assistance" value={overview?.openHelpRequests ?? 0} alert={Boolean(overview?.openHelpRequests)} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Help queue</p>
            <table className="mt-2 w-full text-[14px]">
              <thead>
                <tr className="border-b border-divider text-left font-mono text-[11px] uppercase text-neutral-600">
                  <th className="py-2 font-normal">Requester</th>
                  <th className="py-2 font-normal">Lab</th>
                  <th className="py-2 font-normal">Reason</th>
                  <th className="py-2 text-right font-normal">Waiting</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {helpQueue?.map((request) => (
                  <tr key={request.id}>
                    <td className="py-2">{request.requester}</td>
                    <td className="py-2">{request.lab}</td>
                    <td className="py-2">{request.reason}</td>
                    <td className={cx("py-2 text-right font-mono", request.waitingSeconds > 180 && "text-accent-2-700")}>
                      {Math.floor(request.waitingSeconds / 60)}:{String(request.waitingSeconds % 60).padStart(2, "0")}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => resolveHelpRequest(request.id)}
                        className="font-mono text-[10px] uppercase text-accent-700 hover:underline"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
                {helpQueue?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-neutral-700">
                      No open requests.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Lab health & completion</p>
            <table className="mt-2 w-full text-[14px]">
              <thead>
                <tr className="border-b border-divider text-left font-mono text-[11px] uppercase text-neutral-600">
                  <th className="py-2 font-normal">Lab</th>
                  <th className="py-2 text-right font-normal">Total solves</th>
                  <th className="py-2 text-right font-normal">Environments running</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {labHealth?.map((lab) => (
                  <tr key={lab.code}>
                    <td className="py-2">{lab.name}</td>
                    <td className="py-2 text-right tabular-nums">
                      {lab.totalSolves} / {lab.totalChallenges}
                    </td>
                    <td className="py-2 text-right tabular-nums">{lab.runningEnvironments}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Participants</p>
            <div className="mt-2 divide-y divide-divider">
              {participants?.map((participant) => (
                <button
                  key={participant.id}
                  type="button"
                  onClick={() => setSelectedParticipantId(participant.id)}
                  className="flex w-full items-center justify-between py-2 text-left hover:bg-neutral-200"
                >
                  <span>{participant.fullName}</span>
                  <span className="font-mono text-[13px] text-neutral-700">{participant.totalScore.toLocaleString()} XP</span>
                </button>
              ))}
            </div>
          </div>

          <aside>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-600">Participant inspector</p>
            {participantDetail ? (
              <div className="mt-2">
                <h2 className="text-[22px]">{participantDetail.fullName}</h2>
                <p className="font-mono text-[11px] text-neutral-700">{participantDetail.team ?? "No team"}</p>

                <div className="mt-4 divide-y divide-divider">
                  <div className="flex justify-between py-2 text-[14px]">
                    <span className="font-mono text-[11px] uppercase text-neutral-600">Score</span>
                    <span>{participantDetail.totalScore.toLocaleString()} XP</span>
                  </div>
                  <div className="flex justify-between py-2 text-[14px]">
                    <span className="font-mono text-[11px] uppercase text-neutral-600">Progress</span>
                    <span>{participantDetail.progress.filter((p) => p.status === "SOLVED").length} solved</span>
                  </div>
                </div>

                <p className="mt-4 font-mono text-[11px] uppercase text-neutral-600">Environments</p>
                {participantDetail.environments.map((environment) => (
                  <div key={environment.id} className="mt-2 flex items-center justify-between text-[13px]">
                    <span className="font-mono">{environment.externalId} · {environment.status}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => extendEnvironment(environment.id)}
                        className="font-mono text-[10px] uppercase text-accent-700 hover:underline"
                      >
                        Extend
                      </button>
                      <button
                        type="button"
                        onClick={() => resetEnvironment(environment.id)}
                        className="font-mono text-[10px] uppercase text-accent-2-700 hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ))}

                <p className="mt-6 text-[13px] text-neutral-700">
                  Every privileged action is written to the audit log with your facilitator ID.
                </p>
              </div>
            ) : (
              <p className="mt-2 text-[14px] text-neutral-700">Select a participant to inspect their session.</p>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
