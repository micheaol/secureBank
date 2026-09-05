import { Masthead } from "@/components/layout/Masthead";
import { SandboxRail } from "@/components/layout/SandboxRail";

export default function SandboxAppLayout({ children }) {
  return (
    <>
      <Masthead activeSurface="sandbox" />
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-8 pt-6 md:grid-cols-[210px_minmax(0,1fr)]">
        <SandboxRail />
        <main className="pb-8">{children}</main>
      </div>
    </>
  );
}
