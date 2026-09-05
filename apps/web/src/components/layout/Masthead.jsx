import Link from "next/link";
import { cx } from "../ui/cx";

const SURFACE_TABS = [
  { id: "bank", label: "Digital Bank", href: "/bank/dashboard" },
  { id: "sandbox", label: "Sandbox", href: "/sandbox/dashboard" },
  { id: "facilitator", label: "Facilitator", href: "/facilitator" },
  { id: "admin", label: "Admin", href: "/admin" },
  { id: "conference", label: "Conference", href: "/conference" },
];

export function Masthead({ activeSurface = "bank" }) {
  return (
    <header>
      <div className="h-1 w-full bg-text" />
      <div className="flex items-center justify-between px-8 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-[22px] font-semibold tracking-[-0.02em]">SecureBank</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-600">
            National AppSec Conference · Lagos
          </span>
        </div>
        <nav aria-label="SecureBank surfaces" className="flex items-center gap-1">
          {SURFACE_TABS.map((surfaceTab) => {
            const isActive = surfaceTab.id === activeSurface;
            const sharedClassName = cx(
              "whitespace-nowrap rounded-md px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em]",
              isActive ? "text-accent-700" : "text-neutral-600"
            );

            if (!surfaceTab.href) {
              return (
                <span key={surfaceTab.id} className={sharedClassName} title="Not in this build">
                  {surfaceTab.label}
                </span>
              );
            }

            return (
              <Link key={surfaceTab.id} href={surfaceTab.href} className={cx(sharedClassName, "hover:bg-neutral-200")}>
                {surfaceTab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="h-px w-full bg-text" />
    </header>
  );
}
