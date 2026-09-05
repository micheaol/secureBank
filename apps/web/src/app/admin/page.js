"use client";

import { useState } from "react";
import { Masthead } from "@/components/layout/Masthead";
import {
  useGetAdminOverviewQuery,
  useGetAdminEnvironmentsQuery,
  useTerminateAdminEnvironmentMutation,
  useGetAdminAuditLogQuery,
  useGetEmergencyStatusQuery,
  useStopProvisioningMutation,
  useResumeProvisioningMutation,
  useDisableLabMutation,
  useEnableLabMutation,
  useTerminateAllEnvironmentsForLabMutation,
  useEmergencyShutdownMutation,
  useLiftEmergencyShutdownMutation,
} from "@/lib/redux/adminApi";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";
import { formatShortDate } from "@/lib/formatting/formatShortDate";

const TABS = ["Overview", "Environments", "Audit log", "Emergency"];

function EmergencyControlRow({ label, note, onAction, destructive = true }) {
  return (
    <div className="flex items-center justify-between border-b border-accent-2-500/30 py-4 last:border-0">
      <div>
        <p className="text-[17px]">{label}</p>
        <p className="text-[13px] text-neutral-700">{note}</p>
      </div>
      <Button variant="secondary" destructive={destructive} onClick={onAction}>
        {label}
      </Button>
    </div>
  );
}

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const { data: overview, error: overviewError } = useGetAdminOverviewQuery();
  const { data: environments } = useGetAdminEnvironmentsQuery(undefined, { skip: !overview || activeTab !== "Environments" });
  const [terminateEnvironment] = useTerminateAdminEnvironmentMutation();
  const { data: auditLog } = useGetAdminAuditLogQuery(undefined, { skip: !overview || activeTab !== "Audit log" });
  const { data: emergencyStatus } = useGetEmergencyStatusQuery(undefined, { skip: !overview });

  const [stopProvisioning] = useStopProvisioningMutation();
  const [resumeProvisioning] = useResumeProvisioningMutation();
  const [disableLab] = useDisableLabMutation();
  const [enableLab] = useEnableLabMutation();
  const [terminateAllForLab] = useTerminateAllEnvironmentsForLabMutation();
  const [emergencyShutdown] = useEmergencyShutdownMutation();
  const [liftShutdown] = useLiftEmergencyShutdownMutation();

  function promptForReason(actionLabel) {
    return window.prompt(`Reason for: ${actionLabel} (minimum 10 characters, required and audited)`);
  }

  if (overviewError) {
    return (
      <>
        <Masthead activeSurface="admin" />
        <div className="mx-auto max-w-[720px] px-8 py-16">
          <h1 className="text-[32px]">Access restricted</h1>
          <p className="mt-2 text-[15px] text-neutral-700">
            The Admin console is only available to sandbox administrator or administrator accounts.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Masthead activeSurface="admin" />
      <div className="mx-auto max-w-[1440px] px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[36px]">Administration</h1>
          <nav className="flex gap-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cx(
                  "font-mono text-[11px] uppercase tracking-[0.08em]",
                  activeTab === tab ? (tab === "Emergency" ? "text-accent-2-700 underline" : "text-accent-700") : "text-neutral-600"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "Overview" && overview ? (
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase text-neutral-600">Registered</p>
              <p className="mt-1 text-[32px] font-semibold">{overview.registeredParticipants}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase text-neutral-600">Environments running</p>
              <p className="mt-1 text-[32px] font-semibold">{overview.runningEnvironments}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase text-neutral-600">Validation health</p>
              <p className="mt-1 text-[32px] font-semibold text-accent-700">{overview.validationHealthPercent}%</p>
            </div>
          </div>
        ) : null}

        {activeTab === "Environments" ? (
          <table className="mt-8 w-full text-[14px]">
            <thead>
              <tr className="border-b border-divider text-left font-mono text-[11px] uppercase text-neutral-600">
                <th className="py-2 font-normal">Environment</th>
                <th className="py-2 font-normal">Participant</th>
                <th className="py-2 font-normal">Lab</th>
                <th className="py-2 font-normal">Status</th>
                <th className="py-2 font-normal">Expires</th>
                <th className="py-2 text-right font-normal">Terminate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {environments?.map((environment) => (
                <tr key={environment.id}>
                  <td className="py-2 font-mono">{environment.externalId}</td>
                  <td className="py-2">{environment.participant}</td>
                  <td className="py-2">{environment.lab}</td>
                  <td className="py-2">{environment.status}</td>
                  <td className="py-2">{environment.expiresAt ? formatShortDate(environment.expiresAt) : "—"}</td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => terminateEnvironment(environment.id)}
                      className="font-mono text-[10px] uppercase text-accent-2-700 hover:underline"
                    >
                      Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {activeTab === "Audit log" ? (
          <table className="mt-8 w-full text-[13px]">
            <thead>
              <tr className="border-b border-divider text-left font-mono text-[11px] uppercase text-neutral-600">
                <th className="py-2 font-normal">Timestamp</th>
                <th className="py-2 font-normal">Actor</th>
                <th className="py-2 font-normal">Action</th>
                <th className="py-2 font-normal">Resource</th>
                <th className="py-2 font-normal">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider font-mono">
              {auditLog?.map((event) => (
                <tr key={event.id}>
                  <td className="py-2">{new Date(event.timestamp).toLocaleString()}</td>
                  <td className="py-2">{event.actor}</td>
                  <td className="py-2">{event.action}</td>
                  <td className="py-2">{event.resource ?? "—"}</td>
                  <td className={cx("py-2", event.result === "DENIED" && "text-accent-2-700")}>{event.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {activeTab === "Emergency" && emergencyStatus ? (
          <div className="mt-8 max-w-[720px] rounded-md border-2 border-accent-2-500 bg-accent-2-100 p-6">
            <p className="font-mono text-[11px] uppercase text-accent-2-700">Restricted · Sandbox administrator</p>
            <h2 className="mt-2 text-[28px]">Emergency controls</h2>
            <p className="mt-2 text-[15px] text-neutral-800">
              These controls affect every participant on the floor. Each one requires a written reason and is
              recorded to the audit log.
            </p>

            <EmergencyControlRow
              label={emergencyStatus.provisioningStopped ? "Resume provisioning" : "Stop provisioning"}
              note="Existing environments keep running; the launch button becomes unavailable."
              onAction={() => {
                const reason = promptForReason("provisioning change");
                if (!reason) return;
                (emergencyStatus.provisioningStopped ? resumeProvisioning : stopProvisioning)(reason);
              }}
            />

            {emergencyStatus.labs.map((lab) => (
              <EmergencyControlRow
                key={lab.code}
                label={`${lab.disabled ? "Enable" : "Disable"} ${lab.name}`}
                note="Participants in that lab keep their environment until it expires."
                onAction={() => {
                  const reason = promptForReason(`${lab.disabled ? "enable" : "disable"} ${lab.name}`);
                  if (!reason) return;
                  (lab.disabled ? enableLab : disableLab)({ labCode: lab.code, reason });
                }}
              />
            ))}

            <EmergencyControlRow
              label="Terminate all environments for a lab"
              note="Immediately ends every running environment in the chosen lab."
              onAction={() => {
                const labCode = window.prompt("Lab code (WEB, API, AI, DEVSECOPS, SUPPLY_CHAIN)");
                if (!labCode) return;
                const reason = promptForReason("terminate all environments");
                if (!reason) return;
                terminateAllForLab({ labCode, reason });
              }}
            />

            <EmergencyControlRow
              label={emergencyStatus.emergencyShutdownActive ? "Lift emergency shutdown" : "Emergency sandbox shutdown"}
              note={`Ends the exercise for all ${overview?.registeredParticipants ?? 0} participants on the floor.`}
              onAction={() => {
                const reason = promptForReason("emergency shutdown change");
                if (!reason) return;
                (emergencyStatus.emergencyShutdownActive ? liftShutdown : emergencyShutdown)(reason);
              }}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
