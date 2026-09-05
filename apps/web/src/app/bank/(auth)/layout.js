import { Masthead } from "@/components/layout/Masthead";

export default function BankAuthLayout({ children }) {
  return (
    <>
      <Masthead activeSurface="bank" />
      <main className="mx-auto max-w-[1100px] px-8 py-[72px]">{children}</main>
    </>
  );
}
