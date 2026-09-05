"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/lib/validation/authSchemas";
import { useLoginMutation } from "@/lib/redux/authApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";

export default function BankLoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginFormSchema) });

  async function onSubmitLoginForm(loginCredentials) {
    await login(loginCredentials).unwrap();
    router.push("/bank/dashboard");
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        <h1 className="max-w-[20ch] text-[52px] leading-[1.05]">
          Banking built for how SecureBank actually works.
        </h1>
        <p className="mt-4 max-w-[44ch] text-[19px] text-neutral-800">
          Manage accounts, send money and get help - all from one secure dashboard.
        </p>
        <dl className="mt-8 flex gap-10">
          <div>
            <dt className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Licensed</dt>
            <dd className="text-[15px]">CBN-regulated · NDIC insured</dd>
          </div>
          <div>
            <dt className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Support</dt>
            <dd className="text-[15px]">0700 SECUREBANK</dd>
          </div>
        </dl>
        <p className="mt-16 max-w-[62ch] text-[13px] text-neutral-700">
          This is a training environment. All accounts, balances and transactions are synthetic and used
          exclusively for Application Security education.
        </p>
      </div>

      <Card>
        <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Sign in</p>
        <h2 className="mt-1 text-[26px]">SecureBank Online</h2>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmitLoginForm)} noValidate>
          <ApiErrorBanner error={error} />

          <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          </FormField>

          <div className="flex items-center justify-between text-[13px]">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("rememberMe")} />
              Remember me
            </label>
            <Link href="/bank/forgot-password" className="text-accent-700">
              Forgot password
            </Link>
          </div>

          <Button type="submit" className="w-full py-3" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-[12px] text-neutral-700">
            SecureBank will never ask for your PIN, OTP or full password by phone, SMS or email.
          </p>

          <p className="text-[13px] text-neutral-700">
            New to SecureBank?{" "}
            <Link href="/bank/register" className="text-accent-700">
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
