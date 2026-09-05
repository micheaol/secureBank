import { Masthead } from "@/components/layout/Masthead";
import { BankTopNav } from "@/components/layout/BankTopNav";

export default function BankAppLayout({ children }) {
  return (
    <>
      <Masthead activeSurface="bank" />
      <BankTopNav />
      <main className="mx-auto max-w-[1280px] px-8 pb-8">{children}</main>
    </>
  );
}
